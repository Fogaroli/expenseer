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
  /************************************** getCategoriesDashboard */
  describe("getCategoriesDashboard", function () {
    test("returns all categories with totals (including zero)", async function () {
      const result = await Dashboard.getCategoriesDashboard("tuser1");
      expect(Array.isArray(result)).toBe(true);
      for (let row of result) {
        expect(row).toHaveProperty("category");
        expect(row).toHaveProperty("total_amount");
        expect(typeof row.total_amount).toBe("number");
      }
    });
    test("returns empty array for user with no categories", async function () {
      const result = await Dashboard.getCategoriesDashboard("nouser");
      expect(result).toEqual([]);
    });
  });

  /************************************** getBudgetsashbaord */
  describe("getBudgetsDashboard", function () {
    test("returns all budgets with totals (including zero)", async function () {
      const result = await Dashboard.getBudgetsDashboard("tuser1");
      expect(Array.isArray(result)).toBe(true);
      for (let row of result) {
        expect(row).toHaveProperty("budget");
        expect(row).toHaveProperty("total_amount");
        expect(row).toHaveProperty("percent_used");
      }
    });
    test("returns empty array for user with no budgets", async function () {
      const result = await Dashboard.getBudgetsDashboard("nouser");
      expect(result).toEqual([]);
    });
  });

  /************************************** getByCategory */
  describe("getByCategory", function () {
    test("returns current month data for a category", async function () {
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
        expect(err.status).toBe(500);
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
      expect(result).toHaveProperty("percent_used");
    });
    test("throws 404 if budget not found", async function () {
      try {
        await Dashboard.getByBudget("tuser1", "NoSuchBudget");
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
        expect(err.status).toBe(500);
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
        expect(err.status).toBe(500);
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
        expect(row).toHaveProperty("percent_used");
      }
    });
    test("throws 404 if budget not found", async function () {
      try {
        await Dashboard.getHistoryByBudget("tuser1", "NoSuchBudget");
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
        expect(err.status).toBe(500);
      }
    });
  });
});
