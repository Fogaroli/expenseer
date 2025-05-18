"use strict";

const db = require("../db.js");
const Expense = require("./ExpenseModel");
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
    const expenseData = {
      name: "Test Expense",
      amount: 42.5,
      description: "Test desc",
      date: new Date().toISOString().slice(0, 10),
      category: "Bills",
      budget: "Main",
    };
    const expense = await Expense.create("tuser1", expenseData);
    expect(expense).toMatchObject({
      name: "Test Expense",
      amount: 42.5,
      description: "Test desc",
      category: "Bills",
      budget: "Main",
    });
    expect(expense).toHaveProperty("id");
    expect(expense).toHaveProperty("date");
  });

  test("throws error if category not found", async function () {
    try {
      await Expense.create("tuser1", {
        name: "BadCat",
        amount: 10,
        date: new Date().toISOString().slice(0, 10),
        category: "NoSuchCat",
        budget: "Main",
      });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(400);
    }
  });

  test("throws error if budget not found", async function () {
    try {
      await Expense.create("tuser1", {
        name: "BadBudget",
        amount: 10,
        date: new Date().toISOString().slice(0, 10),
        category: "Bills",
        budget: "NoSuchBudget",
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
  test("works with no filters", async function () {
    const expenses = await Expense.getAll("tuser1", {});
    expect(Array.isArray(expenses)).toBe(true);
    expect(expenses.length).toBeGreaterThan(0);
    for (let exp of expenses) {
      expect(exp).toHaveProperty("id");
      expect(exp).toHaveProperty("name");
      expect(exp).toHaveProperty("amount");
      expect(exp).toHaveProperty("date");
    }
  });

  test("works with category filter", async function () {
    const expenses = await Expense.getAll("tuser1", { category: "Bills" });
    expect(expenses.every((e) => e.category === "Bills")).toBe(true);
  });

  test("works with budget filter", async function () {
    const expenses = await Expense.getAll("tuser1", { budget: "Main" });
    expect(expenses.every((e) => e.budget === "Main")).toBe(true);
  });

  test("throws error if category filter not found", async function () {
    try {
      await Expense.getAll("tuser1", { category: "NoSuchCat" });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(400);
    }
  });

  test("throws error if budget filter not found", async function () {
    try {
      await Expense.getAll("tuser1", { budget: "NoSuchBudget" });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(400);
    }
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    // Get an existing expense id
    const expenses = await Expense.getAll("tuser1", {});
    const expense = await Expense.get("tuser1", expenses[0].id);
    expect(expense).toHaveProperty("id", expenses[0].id);
    expect(expense).toHaveProperty("name");
    expect(expense).toHaveProperty("amount");
    expect(expense).toHaveProperty("date");
  });

  test("throws error if not found", async function () {
    try {
      await Expense.get("tuser1", 999999);
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
    const expenses = await Expense.getAll("tuser1", {});
    const expenseId = expenses[0].id;
    const updated = await Expense.update("tuser1", expenseId, {
      name: "Updated Expense",
      amount: 123.45,
      description: "Updated desc",
    });
    expect(updated).toMatchObject({
      id: expenseId,
      name: "Updated Expense",
      amount: 123.45,
      description: "Updated desc",
    });
  });

  test("throws error if not found", async function () {
    try {
      await Expense.update("tuser1", 999999, { name: "Nope" });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });

  test("throws error if category not found", async function () {
    const expenses = await Expense.getAll("tuser1", {});
    const expenseId = expenses[0].id;
    try {
      await Expense.update("tuser1", expenseId, { category: "NoSuchCat" });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(400);
    }
  });

  test("throws error if budget not found", async function () {
    const expenses = await Expense.getAll("tuser1", {});
    const expenseId = expenses[0].id;
    try {
      await Expense.update("tuser1", expenseId, { budget: "NoSuchBudget" });
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
    const expenses = await Expense.getAll("tuser1", {});
    const expenseId = expenses[0].id;
    const result = await Expense.delete("tuser1", expenseId);
    expect(result).toBe(true);

    try {
      await Expense.get("tuser1", expenseId);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });

  test("throws error if not found", async function () {
    try {
      await Expense.delete("tuser1", 999999);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });
});
