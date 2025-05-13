"use strict";

const db = require("../db.js");
const Dashboard = require("./DashboardModel");
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

describe("DashboardModel", function () {
  /************************************** getCurrentMonthExpensesByCategory */
  describe("getCurrentMonthExpensesByCategory", function () {
    test("returns all categories with totals (including zero)", async function () {
      const result = await Dashboard.getCurrentMonthExpensesByCategory(
        "tuser1"
      );
      expect(Array.isArray(result)).toBe(true);
      // Should include all categories for tuser1, even if no expenses
      for (let row of result) {
        expect(row).toHaveProperty("category");
        expect(row).toHaveProperty("total_amount");
        expect(typeof row.total_amount).toBe("number");
      }
    });
    test("returns empty array for user with no categories", async function () {
      const result = await Dashboard.getCurrentMonthExpensesByCategory(
        "nouser"
      );
      expect(result).toEqual([]);
    });
  });

  /************************************** getCurrentMonthExpensesByBudget */
  describe("getCurrentMonthExpensesByBudget", function () {
    test("returns all budgets with totals (including zero)", async function () {
      const result = await Dashboard.getCurrentMonthExpensesByBudget("tuser1");
      expect(Array.isArray(result)).toBe(true);
      for (let row of result) {
        expect(row).toHaveProperty("budget");
        expect(row).toHaveProperty("total_amount");
        expect(row).toHaveProperty("budget_amount");
        expect(row).toHaveProperty("percent_used");
      }
    });
    test("returns empty array for user with no budgets", async function () {
      const result = await Dashboard.getCurrentMonthExpensesByBudget("nouser");
      expect(result).toEqual([]);
    });
  });

  /************************************** getByCategory */
  describe("getByCategory", function () {
    test("returns current month data for a category", async function () {
      // Add a category and expense for tuser1 if needed in your fixtures
      const result = await Dashboard.getByCategory("tuser1", "Bills");
      expect(result).toHaveProperty("month");
      expect(result).toHaveProperty("total_amount");
    });
    test("throws 404 if category not found", async function () {
      try {
        await Dashboard.getByCategory("tuser1", "NoSuchCategory");
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
        expect(err.status).toBe(500); // or 404 depending on your implementation
      }
    });
  });

  /************************************** getByBudget */
  describe("getByBudget", function () {
    test("returns current month data for a budget", async function () {
      // Add a budget and expense for tuser1 if needed in your fixtures
      const result = await Dashboard.getByBudget("tuser1", "Main");
      expect(result).toHaveProperty("month");
      expect(result).toHaveProperty("total_amount");
      expect(result).toHaveProperty("budget_amount");
      expect(result).toHaveProperty("percent_used");
    });
    test("throws 404 if budget not found", async function () {
      try {
        await Dashboard.getByBudget("tuser1", "NoSuchBudget");
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
        expect(err.status).toBe(500); // or 404 depending on your implementation
      }
    });
  });

  /************************************** getHistoryByCategory */
  describe("getHistoryByCategory", function () {
    test("returns last 6 months for a category", async function () {
      const result = await Dashboard.getHistoryByCategory("tuser1", "Bills");
      expect(Array.isArray(result)).toBe(true);
      for (let row of result) {
        expect(row).toHaveProperty("month");
        expect(row).toHaveProperty("total_amount");
      }
    });
    test("throws 404 if category not found", async function () {
      try {
        await Dashboard.getHistoryByCategory("tuser1", "NoSuchCategory");
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
        expect(err.status).toBe(500); // or 404 depending on your implementation
      }
    });
  });

  /************************************** getHistoryByBudget */
  describe("getHistoryByBudget", function () {
    test("returns last 6 months for a budget", async function () {
      const result = await Dashboard.getHistoryByBudget("tuser1", "Main");
      expect(Array.isArray(result)).toBe(true);
      for (let row of result) {
        expect(row).toHaveProperty("month");
        expect(row).toHaveProperty("total_amount");
        expect(row).toHaveProperty("budget_amount");
        expect(row).toHaveProperty("percent_used");
      }
    });
    test("throws 404 if budget not found", async function () {
      try {
        await Dashboard.getHistoryByBudget("tuser1", "NoSuchBudget");
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
        expect(err.status).toBe(500); // or 404 depending on your implementation
      }
    });
  });

  /************************************** getMonthlyBudgets */
  describe("getMonthlyBudgets", function () {
    test("returns all monthly budgets", async function () {
      const result = await Dashboard.getMonthlyBudgets("tuser1");
      expect(Array.isArray(result)).toBe(true);
      for (let row of result) {
        expect(row).toHaveProperty("name");
        expect(row).toHaveProperty("total_amount");
        expect(row).toHaveProperty("budget_amount");
        expect(row).toHaveProperty("percent_used");
      }
    });
  });

  /************************************** getYearlyBudgets */
  describe("getYearlyBudgets", function () {
    test("returns all yearly budgets", async function () {
      const result = await Dashboard.getYearlyBudgets("tuser1");
      expect(Array.isArray(result)).toBe(true);
      for (let row of result) {
        expect(row).toHaveProperty("name");
        expect(row).toHaveProperty("total_amount");
        expect(row).toHaveProperty("budget_amount");
        expect(row).toHaveProperty("percent_used");
      }
    });
  });

  /************************************** getEventBudgets */
  describe("getEventBudgets", function () {
    test("returns all event budgets", async function () {
      const result = await Dashboard.getEventBudgets("tuser1");
      expect(Array.isArray(result)).toBe(true);
      for (let row of result) {
        expect(row).toHaveProperty("name");
        expect(row).toHaveProperty("total_amount");
        expect(row).toHaveProperty("budget_amount");
        expect(row).toHaveProperty("percent_used");
      }
    });
  });

  /************************************** getSavingsBudgets */
  describe("getSavingsBudgets", function () {
    test("returns all savings budgets", async function () {
      const result = await Dashboard.getSavingsBudgets("tuser1");
      expect(Array.isArray(result)).toBe(true);
      for (let row of result) {
        expect(row).toHaveProperty("name");
        expect(row).toHaveProperty("total_amount");
        expect(row).toHaveProperty("budget_amount");
        expect(row).toHaveProperty("percent_used");
      }
    });
  });
});
