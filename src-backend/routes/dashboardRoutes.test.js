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

describe("GET /dashboards/categories", function () {
  test("returns expenses by category", async function () {
    const resp = await request(app)
      .get("/dashboards/categories")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.dashboard).toHaveProperty("categories");
    expect(Array.isArray(resp.body.dashboard.categories)).toBe(true);
  });
});

describe("GET /dashboards/budgets", function () {
  test("returns expenses by budget", async function () {
    const resp = await request(app)
      .get("/dashboards/budgets")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.dashboard).toHaveProperty("budgets");
    expect(Array.isArray(resp.body.dashboard.budgets)).toBe(true);
  });
});
