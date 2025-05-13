"use strict";

const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../dbModels/_commonModelsTest.js");

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

describe("POST /exchanges", function () {
  test("works for valid data", async function () {
    const resp = await request(app)
      .post("/exchanges")
      .send({ data: { currency1: "USD", currency2: "BRL" } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(201);
    expect(resp.body.exchange_rate).toHaveProperty("currency1", "USD");
    expect(resp.body.exchange_rate).toHaveProperty("currency2", "BRL");
  });

  test("fails for missing fields", async function () {
    const resp = await request(app)
      .post("/exchanges")
      .send({ data: { currency1: "USD" } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(400);
  });
});

describe("GET /exchanges", function () {
  test("returns all user exchanges", async function () {
    const resp = await request(app)
      .get("/exchanges")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(Array.isArray(resp.body.exchange_rates)).toBe(true);
  });

  test("returns specific exchange", async function () {
    const resp = await request(app)
      .get("/exchanges?currency1=USD&currency2=EUR")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.exchange_rate).toHaveProperty("currency1", "USD");
    expect(resp.body.exchange_rate).toHaveProperty("currency2", "EUR");
  });
});

describe("DELETE /exchanges", function () {
  test("works for valid delete", async function () {
    const resp = await request(app)
      .delete("/exchanges")
      .send({ data: { currency1: "USD", currency2: "EUR" } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.deleted).toHaveProperty("currency1", "USD");
    expect(resp.body.deleted).toHaveProperty("currency2", "EUR");
  });

  test("fails for missing data", async function () {
    const resp = await request(app)
      .delete("/exchanges")
      .send({})
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(400);
  });
});

describe("GET /exchanges/codes", function () {
  test("returns supported codes", async function () {
    const resp = await request(app)
      .get("/exchanges/codes")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.supported_codes).toBeDefined();
  });
});
