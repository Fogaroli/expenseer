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

describe("GET /dashboards/category", function () {
  test("works for valid category", async function () {
    const resp = await request(app)
      .get("/dashboards/category?category=Bills")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.dashboard).toHaveProperty("category", "Bills");
    expect(resp.body.dashboard).toHaveProperty("current_month");
    expect(resp.body.dashboard).toHaveProperty("history");
  });

  test("fails for missing category", async function () {
    const resp = await request(app)
      .get("/dashboards/category")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(400);
  });
});

describe("GET /dashboards/budget", function () {
  test("works for valid budget", async function () {
    const resp = await request(app)
      .get("/dashboards/budget?budget=Groceries")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.dashboard).toHaveProperty("budget", "Groceries");
    expect(resp.body.dashboard).toHaveProperty("current_month");
    expect(resp.body.dashboard).toHaveProperty("history");
  });

  test("fails for missing budget", async function () {
    const resp = await request(app)
      .get("/dashboards/budget")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(400);
  });
});

describe("GET /dashboards/monthly", function () {
  test("returns monthly budgets", async function () {
    const resp = await request(app)
      .get("/dashboards/monthly")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.dashboard).toHaveProperty("monthly_budget");
    expect(Array.isArray(resp.body.dashboard.monthly_budget)).toBe(true);
  });
});

describe("GET /dashboards/yearly", function () {
  test("returns yearly budgets", async function () {
    const resp = await request(app)
      .get("/dashboards/yearly")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.dashboard).toHaveProperty("yearly_budget");
    expect(Array.isArray(resp.body.dashboard.yearly_budget)).toBe(true);
  });
});

describe("GET /dashboards/event", function () {
  test("returns event budgets", async function () {
    const resp = await request(app)
      .get("/dashboards/event")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.dashboard).toHaveProperty("event_budget");
    expect(Array.isArray(resp.body.dashboard.event_budget)).toBe(true);
  });
});

describe("GET /dashboards/savings", function () {
  test("returns savings budgets", async function () {
    const resp = await request(app)
      .get("/dashboards/savings")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.dashboard).toHaveProperty("saving_budget");
    expect(Array.isArray(resp.body.dashboard.saving_budget)).toBe(true);
  });
});

describe("GET /dashboards/expenses/category", function () {
  test("returns expenses by category", async function () {
    const resp = await request(app)
      .get("/dashboards/expenses/category")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.dashboard).toHaveProperty("category");
    expect(Array.isArray(resp.body.dashboard.category)).toBe(true);
  });
});

describe("GET /dashboards/expenses/budget", function () {
  test("returns expenses by budget", async function () {
    const resp = await request(app)
      .get("/dashboards/expenses/budget")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.dashboard).toHaveProperty("budget");
    expect(Array.isArray(resp.body.dashboard.budget)).toBe(true);
  });
});
