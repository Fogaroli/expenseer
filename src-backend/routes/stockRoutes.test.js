"use strict";

const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../dbModels/_commonModelsTest.js");

// Mock API calls for stocks
jest.mock("../helpers/api.js", () => ({
  getStockPrice: jest.fn(() =>
    Promise.resolve({
      "Global Quote": {
        "05. price": "123.45",
        "10. change percent": "2.34",
      },
    })
  ),
  stockSearch: jest.fn(() =>
    Promise.resolve({
      bestMatches: [
        { "1. symbol": "AAPL", "2. name": "Apple Inc." },
        { "1. symbol": "GOOG", "2. name": "Alphabet Inc." },
      ],
    })
  ),
}));

let userToken;

beforeAll(commonBeforeAll);
beforeEach(async () => {
  await commonBeforeEach();
  const resp = await request(app)
    .post("/auth/login")
    .send({ username: "tuser1", password: "password1" });
  userToken = resp.body.token;
});
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /stocks", function () {
  test("works for valid data", async function () {
    const resp = await request(app)
      .post("/stocks")
      .send({ data: { symbol: "AAPL" } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(201);
    expect(resp.body.stock).toHaveProperty("symbol", "AAPL");
  });

  test("fails for missing symbol", async function () {
    const resp = await request(app)
      .post("/stocks")
      .send({ data: {} })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(500);
  });
});

describe("GET /stocks", function () {
  test("returns all user stocks", async function () {
    await request(app)
      .post("/stocks")
      .send({ data: { symbol: "AAPL" } })
      .set("authorization", userToken);
    const resp = await request(app)
      .get("/stocks")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(Array.isArray(resp.body.stocks)).toBe(true);
  });

  test("returns specific stock", async function () {
    await request(app)
      .post("/stocks")
      .send({ data: { symbol: "AAPL" } })
      .set("authorization", userToken);
    const resp = await request(app)
      .get("/stocks?symbol=AAPL")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.stock).toHaveProperty("symbol", "AAPL");
  });
});

describe("DELETE /stocks", function () {
  test("works for valid delete", async function () {
    await request(app)
      .post("/stocks")
      .send({ data: { symbol: "AAPL" } })
      .set("authorization", userToken);
    const resp = await request(app)
      .delete("/stocks")
      .send({ data: { symbol: "AAPL" } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.deleted).toHaveProperty("symbol", "AAPL");
  });

  test("fails for missing symbol", async function () {
    const resp = await request(app)
      .delete("/stocks")
      .send({ data: {} })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(400);
  });
});

describe("GET /stocks/search", function () {
  test("returns search results", async function () {
    const resp = await request(app)
      .get("/stocks/search?term=apple")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(Array.isArray(resp.body.stocks)).toBe(true);
  });
});
