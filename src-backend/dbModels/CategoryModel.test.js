"use strict";

const db = require("../db.js");
const Category = require("./CategoryModel");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_commonModelsTest.js");
const ExpressError = require("../helpers/expressError");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  test("works", async function () {
    const newCategory = { name: "Utilities" };
    const cat = await Category.create("tuser1", newCategory);
    expect(cat).toEqual({ name: "Utilities" });

    const found = await db.query(
      "SELECT * FROM categories WHERE username = 'tuser1' AND name = 'Utilities'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].name).toEqual("Utilities");
  });

  test("throws error for duplicate category name", async function () {
    await Category.create("tuser1", { name: "Bills2" });
    try {
      await Category.create("tuser1", { name: "Bills2" });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(400);
    }
  });
});

/************************************** getAll */

describe("getAll", function () {
  test("works", async function () {
    // Add some categories for tuser1
    await Category.create("tuser1", { name: "Food" });
    await Category.create("tuser1", { name: "Transport" });

    const categories = await Category.getAll("tuser1");
    const names = categories.map((c) => c.name);
    expect(names).toEqual(
      expect.arrayContaining(["Food", "Transport", "Bills", "Groceries", "Fun"])
    );
  });

  test("returns empty array if no categories", async function () {
    const categories = await Category.getAll("nonexistentuser");
    expect(categories).toEqual([]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    await Category.create("tuser1", { name: "Shopping" });
    const cat = await Category.get("tuser1", "Shopping");
    expect(cat).toEqual({ name: "Shopping" });
  });

  test("throws error if category not found", async function () {
    try {
      await Category.get("tuser1", "Nonexistent Category");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });
});

/************************************** update */

describe("update", function () {
  test("works", async function () {
    await Category.create("tuser1", { name: "OldName" });
    const updated = await Category.update("tuser1", "OldName", {
      name: "NewName",
    });
    expect(updated).toEqual({ name: "NewName" });

    const found = await db.query(
      "SELECT * FROM categories WHERE username = 'tuser1' AND name = 'NewName'"
    );
    expect(found.rows.length).toEqual(1);
  });

  test("throws error if category not found", async function () {
    try {
      await Category.update("tuser1", "Nonexistent", { name: "Whatever" });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });

  test("throws error for duplicate category name", async function () {
    await Category.create("tuser1", { name: "CatA" });
    await Category.create("tuser1", { name: "CatB" });
    try {
      await Category.update("tuser1", "CatA", { name: "CatB" });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(400);
    }
  });
});

/************************************** delete */

describe("delete", function () {
  test("works", async function () {
    await Category.create("tuser1", { name: "ToDelete" });
    const result = await Category.delete("tuser1", "ToDelete");
    expect(result).toBe(true);

    const found = await db.query(
      "SELECT * FROM categories WHERE username = 'tuser1' AND name = 'ToDelete'"
    );
    expect(found.rows.length).toEqual(0);
  });

  test("throws error if category not found", async function () {
    try {
      await Category.delete("tuser1", "Nonexistent");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });
});
