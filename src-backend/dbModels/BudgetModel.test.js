"use strict";

const db = require("../db.js");
const Budget = require("./BudgetModel");
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
  const newBudget = {
    name: "New Budget",
    type: 4,
    amount: 300.0,
    description: "New budget description",
  };

  test("works", async function () {
    const budget = await Budget.create("tuser1", newBudget);
    expect(budget).toEqual({
      name: "New Budget",
      type: 4,
      amount: 300.0,
      description: "New budget description",
    });

    const found = await db.query(
      "SELECT * FROM budgets WHERE username = 'tuser1' AND name = 'New Budget'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].amount).toEqual("300");
  });

  test("throws error for duplicate budget name", async function () {
    try {
      await Budget.create("tuser1", {
        name: "Groceries",
        type: 1,
        amount: 500.0,
        description: "Duplicate budget",
      });
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
    const budgets = await Budget.getAll("tuser1");
    expect(budgets).toEqual([
      { name: "Entertainment", type: 2, amount: 200 },
      { name: "Groceries", type: 1, amount: 500.0 },
      { name: "Main", type: 1, amount: 1000.0 },
    ]);
  });

  test("returns empty array if no budgets", async function () {
    const budgets = await Budget.getAll("nonexistentuser");
    expect(budgets).toEqual([]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    const budget = await Budget.get("tuser1", "Groceries");
    expect(budget).toEqual({
      name: "Groceries",
      type: 1,
      amount: 500.0,
      description: "Monthly groceries budget",
    });
  });

  test("throws error if budget not found", async function () {
    try {
      await Budget.get("tuser1", "Nonexistent Budget");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    amount: 600.0,
    description: "Updated description",
  };

  test("works", async function () {
    const budget = await Budget.update("tuser1", "Groceries", updateData);
    expect(budget).toEqual({
      name: "Groceries",
      type: 1,
      amount: 600.0,
      description: "Updated description",
    });

    const found = await db.query(
      "SELECT * FROM budgets WHERE username = 'tuser1' AND name = 'Groceries'"
    );
    expect(found.rows[0].amount).toEqual("600");
  });

  test("throws error if budget not found", async function () {
    try {
      await Budget.update("tuser1", "Nonexistent Budget", updateData);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });
});

/************************************** delete */

describe("delete", function () {
  test("works", async function () {
    const result = await Budget.delete("tuser1", "Groceries");
    expect(result).toBe(true);

    const found = await db.query(
      "SELECT * FROM budgets WHERE username = 'tuser1' AND name = 'Groceries'"
    );
    expect(found.rows.length).toEqual(0);
  });

  test("throws error if budget not found", async function () {
    try {
      await Budget.delete("tuser1", "Nonexistent Budget");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });
});
