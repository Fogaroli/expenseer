"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db.js");
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

describe("POST /budgets", function () {
  test("works for valid data", async function () {
    const resp = await request(app)
      .post("/budgets")
      .send({
        data: {
          name: "TestBudget",
          type: 1,
          amount: 123.45,
          description: "Test budget",
        },
      })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(201);
    expect(resp.body.budget).toMatchObject({
      name: "TestBudget",
      type: 1,
      amount: 123.45,
      description: "Test budget",
    });
  });

  test("fails for missing required fields", async function () {
    const resp = await request(app)
      .post("/budgets")
      .send({ data: { name: "NoType" } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(400);
    expect(resp.body.message).toBeDefined();
  });

  test("fails for duplicate budget name", async function () {
    const resp = await request(app)
      .post("/budgets")
      .send({
        data: {
          name: "Groceries",
          type: 1,
          amount: 100,
        },
      })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(400);
    expect(resp.body.message).toBeDefined();
  });

  test("fails for unauthenticated user", async function () {
    const resp = await request(app)
      .post("/budgets")
      .send({
        data: {
          name: "NoAuthBudget",
          type: 1,
          amount: 100,
        },
      });
    expect(resp.statusCode).toBe(403);
  });
});

describe("GET /budgets", function () {
  test("works for logged in user", async function () {
    const resp = await request(app)
      .get("/budgets")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(Array.isArray(resp.body.budgets)).toBe(true);
    expect(resp.body.budgets.length).toBeGreaterThan(0);
  });

  test("fails for unauthenticated user", async function () {
    const resp = await request(app).get("/budgets");
    expect(resp.statusCode).toBe(403);
  });
});

describe("GET /budgets/:budget", function () {
  test("works for valid budget", async function () {
    const resp = await request(app)
      .get("/budgets/Groceries")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.budget).toHaveProperty("name", "Groceries");
  });

  test("fails for not found", async function () {
    const resp = await request(app)
      .get("/budgets/NoSuchBudget")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(404);
  });

  test("fails for unauthenticated user", async function () {
    const resp = await request(app).get("/budgets/Groceries");
    expect(resp.statusCode).toBe(403);
  });
});

describe("PATCH /budgets/:budget", function () {
  test("works for valid update", async function () {
    const resp = await request(app)
      .patch("/budgets/Groceries")
      .send({ data: { amount: 777.77, description: "Updated!" } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.budget).toMatchObject({
      name: "Groceries",
      amount: 777.77,
      description: "Updated!",
    });
  });

  test("fails for invalid data", async function () {
    const resp = await request(app)
      .patch("/budgets/Groceries")
      .send({ data: { amount: -100 } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(400);
    expect(resp.body.message).toBeDefined();
  });

  test("fails for not found", async function () {
    const resp = await request(app)
      .patch("/budgets/NoSuchBudget")
      .send({ data: { amount: 100 } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(404);
  });

  test("fails for unauthenticated user", async function () {
    const resp = await request(app)
      .patch("/budgets/Groceries")
      .send({ data: { amount: 100 } });
    expect(resp.statusCode).toBe(403);
  });
});

describe("DELETE /budgets/:budget", function () {
  test("works for valid delete", async function () {
    const resp = await request(app)
      .delete("/budgets/Groceries")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ deleted: "Groceries" });
  });

  test("fails for not found", async function () {
    const resp = await request(app)
      .delete("/budgets/NoSuchBudget")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(404);
  });

  test("fails for unauthenticated user", async function () {
    const resp = await request(app).delete("/budgets/Groceries");
    expect(resp.statusCode).toBe(403);
  });
});
