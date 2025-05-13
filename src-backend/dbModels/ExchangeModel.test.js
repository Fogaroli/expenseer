"use strict";

const db = require("../db.js");
const Exchange = require("./ExchangeModel");
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

// Mock getExchangeRate to avoid real API calls
// const api = require("../helpers/api.js");
// jest.spyOn(api, "getExchangeRate").mockImplementation((c1, c2) =>
//   Promise.resolve({
//     conversion_rate: c1 === "USD" && c2 === "EUR" ? 0.95 : 1.05,
//     time_last_update_utc: new Date().toISOString(),
//   })
// );

jest.mock("../helpers/api.js", () => ({
  getExchangeRate: jest.fn((c1, c2) =>
    Promise.resolve({
      conversion_rate: c1 === "USD" && c2 === "EUR" ? 0.95 : 1.05,
      time_last_update_utc: new Date().toISOString(),
    })
  ),
}));

describe("ExchangeModel", function () {
  describe("getAll", function () {
    test("returns all user exchanges and updates old rates", async function () {
      const rates = await Exchange.getAll("tuser1");
      expect(Array.isArray(rates)).toBe(true);
      expect(rates.length).toBeGreaterThanOrEqual(2);
      for (let rate of rates) {
        expect(rate).toHaveProperty("currency1");
        expect(rate).toHaveProperty("currency2");
        expect(rate).toHaveProperty("rate");
        expect(rate).toHaveProperty("last_update");
      }
    });

    test("returns empty array for user with no exchanges", async function () {
      const rates = await Exchange.getAll("nouser");
      expect(rates).toEqual([]);
    });
  });

  describe("get", function () {
    test("returns up-to-date rate if exists", async function () {
      const rate = await Exchange.get({ currency1: "EUR", currency2: "USD" });
      expect(rate).toHaveProperty("currency1", "EUR");
      expect(rate).toHaveProperty("currency2", "USD");
      expect(rate).toHaveProperty("rate");
      expect(rate).toHaveProperty("last_update");
    });

    test("creates and returns new rate if none exists", async function () {
      const rate = await Exchange.get({ currency1: "GBP", currency2: "USD" });
      expect(rate).toHaveProperty("currency1", "GBP");
      expect(rate).toHaveProperty("currency2", "USD");
      expect(rate).toHaveProperty("rate");
      expect(rate).toHaveProperty("last_update");
    });
  });

  describe("addToUser", function () {
    test("adds existing exchange to user", async function () {
      const rate = await Exchange.addToUser("tuser2", {
        currency1: "EUR",
        currency2: "USD",
      });
      expect(rate).toHaveProperty("currency1", "EUR");
      expect(rate).toHaveProperty("currency2", "USD");
    });

    test("creates new exchange and adds to user", async function () {
      const rate = await Exchange.addToUser("tuser2", {
        currency1: "GBP",
        currency2: "USD",
      });
      expect(rate).toHaveProperty("currency1", "GBP");
      expect(rate).toHaveProperty("currency2", "USD");
    });

    test("throws error for duplicate assignment", async function () {
      try {
        await Exchange.addToUser("tuser1", {
          currency1: "USD",
          currency2: "EUR",
        });
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
        expect(err.status).toBe(400);
      }
    });
  });

  describe("delete", function () {
    test("removes exchange from user", async function () {
      const result = await Exchange.delete("tuser1", {
        currency1: "USD",
        currency2: "EUR",
      });
      expect(result).toEqual({ currency1: "USD", currency2: "EUR" });

      // Should not be in user_exchange anymore
      const found = await db.query(
        `SELECT * FROM user_exchange ue
         JOIN exchanges e ON ue.exchange_id = e.id
         WHERE ue.username = $1 AND e.currency1 = $2 AND e.currency2 = $3`,
        ["tuser1", "USD", "EUR"]
      );
      expect(found.rows.length).toBe(0);
    });

    test("throws error if not assigned to user", async function () {
      try {
        await Exchange.delete("tuser2", { currency1: "EUR", currency2: "USD" }); // not assigned
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
        expect(err.status).toBe(404);
      }
    });

    test("throws error if exchange does not exist", async function () {
      try {
        await Exchange.delete("tuser1", { currency1: "ZZZ", currency2: "YYY" });
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
        expect(err.status).toBe(404);
      }
    });
  });
});
