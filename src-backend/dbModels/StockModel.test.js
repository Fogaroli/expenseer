"use strict";

const db = require("../db.js");
const Stock = require("./StockModel");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_commonModelsTest.js");
const ExpressError = require("../helpers/expressError");

// Mock getStockPrice and stockSearch to avoid real API calls
jest.mock("../helpers/api.js", () => ({
  getStockPrice: jest.fn((symbol) =>
    Promise.resolve({
      "Global Quote": {
        "05. price": "123.45",
        "10. change percent": "2.34",
      },
    })
  ),
  stockSearch: jest.fn((term) =>
    Promise.resolve({
      bestMatches: [
        { "1. symbol": "AAPL", "2. name": "Apple Inc." },
        { "1. symbol": "GOOG", "2. name": "Alphabet Inc." },
      ],
    })
  ),
}));

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** createStock */

describe("createStock", function () {
  test("works", async function () {
    const stock = await Stock.createStock("AAPL");
    expect(stock).toHaveProperty("symbol", "AAPL");
    expect(stock).toHaveProperty("value", "123.45");
    expect(stock).toHaveProperty("variation", "2.34");
    expect(stock).toHaveProperty("last_update");
  });
});

/************************************** getAll */

describe("getAll", function () {
  test("returns all user stocks and updates old values", async function () {
    // Add a stock to user
    await Stock.createStock("AAPL");
    await db.query(
      `INSERT INTO user_stock (username, stock_ref) VALUES ('tuser1', 'AAPL')`
    );
    const stocks = await Stock.getAll("tuser1");
    expect(Array.isArray(stocks)).toBe(true);
    expect(stocks.length).toBeGreaterThanOrEqual(1);
    for (let stock of stocks) {
      expect(stock).toHaveProperty("symbol");
      expect(stock).toHaveProperty("value");
      expect(stock).toHaveProperty("variation");
      expect(stock).toHaveProperty("last_update");
    }
  });

  test("returns empty array for user with no stocks", async function () {
    const stocks = await Stock.getAll("nouser");
    expect(stocks).toEqual([]);
  });
});

/************************************** get */

describe("get", function () {
  test("returns up-to-date value if exists", async function () {
    await Stock.createStock("AAPL");
    const stock = await Stock.get("AAPL");
    expect(stock).toHaveProperty("symbol", "AAPL");
    expect(stock).toHaveProperty("value", "123.45");
    expect(stock).toHaveProperty("variation", "2.34");
    expect(stock).toHaveProperty("last_update");
  });

  test("creates and returns new stock if none exists", async function () {
    const stock = await Stock.get("MSFT");
    expect(stock).toHaveProperty("symbol", "MSFT");
    expect(stock).toHaveProperty("value", "123.45");
    expect(stock).toHaveProperty("variation", "2.34");
    expect(stock).toHaveProperty("last_update");
  });
});

/************************************** addToUser */

describe("addToUser", function () {
  test("adds existing stock to user", async function () {
    await Stock.createStock("AAPL");
    const stock = await Stock.addToUser("tuser2", { symbol: "AAPL" });
    expect(stock).toHaveProperty("symbol", "AAPL");
  });

  test("creates new stock and adds to user", async function () {
    const stock = await Stock.addToUser("tuser2", { symbol: "TSLA" });
    expect(stock).toHaveProperty("symbol", "TSLA");
  });

  test("throws error for duplicate assignment", async function () {
    await Stock.createStock("AAPL");
    await Stock.addToUser("tuser2", { symbol: "AAPL" });
    try {
      await Stock.addToUser("tuser2", { symbol: "AAPL" });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(400);
    }
  });
});

/************************************** delete */

describe("delete", function () {
  test("removes stock from user", async function () {
    await Stock.createStock("AAPL");
    await Stock.addToUser("tuser2", { symbol: "AAPL" });
    const result = await Stock.delete("tuser2", { symbol: "AAPL" });
    expect(result).toEqual({ symbol: "AAPL" });

    // Should not be in user_stock anymore
    const found = await db.query(
      `SELECT * FROM user_stock WHERE username = $1 AND stock_ref = $2`,
      ["tuser2", "AAPL"]
    );
    expect(found.rows.length).toBe(0);
  });

  test("throws error if not assigned to user", async function () {
    await Stock.createStock("AAPL");
    try {
      await Stock.delete("tuser2", { symbol: "AAPL" });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });

  test("throws error if stock does not exist", async function () {
    try {
      await Stock.delete("tuser2", { symbol: "ZZZZ" });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });
});

/************************************** search */

describe("search", function () {
  test("returns search results", async function () {
    const results = await Stock.search("apple");
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("symbol");
    expect(results[0]).toHaveProperty("name");
  });

  test("returns empty array if no results", async function () {
    // Mock stockSearch to return empty
    const { stockSearch } = require("../helpers/api.js");
    stockSearch.mockResolvedValueOnce({ bestMatches: [] });
    const results = await Stock.search("noresults");
    expect(results).toEqual([]);
  });
});
