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

describe("POST /expenses", function () {
  test("works for valid data", async function () {
    const resp = await request(app)
      .post("/expenses")
      .send({
        data: {
          name: "TestExpense",
          amount: 10,
          date: new Date().toISOString().slice(0, 10),
          category: "Bills",
          budget: "Main",
        },
      })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(201);
    expect(resp.body.expense).toHaveProperty("name", "TestExpense");
  });

  test("fails for missing fields", async function () {
    const resp = await request(app)
      .post("/expenses")
      .send({ data: { name: "NoAmount" } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(400);
  });
});

describe("GET /expenses", function () {
  test("returns all user expenses", async function () {
    const resp = await request(app)
      .get("/expenses")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(Array.isArray(resp.body.expenses)).toBe(true);
  });
});

describe("GET /expenses/:expenseId", function () {
  test("works for valid expense", async function () {
    const all = await request(app)
      .get("/expenses")
      .set("authorization", userToken);
    const expenseId = all.body.expenses[0].id;
    const resp = await request(app)
      .get(`/expenses/${expenseId}`)
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.expense).toHaveProperty("id", expenseId);
  });

  test("fails for not found", async function () {
    const resp = await request(app)
      .get("/expenses/999999")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(404);
  });
});

describe("PATCH /expenses/:expenseId", function () {
  test("works for valid update", async function () {
    const all = await request(app)
      .get("/expenses")
      .set("authorization", userToken);
    const expenseId = all.body.expenses[0].id;
    const resp = await request(app)
      .patch(`/expenses/${expenseId}`)
      .send({ data: { name: "UpdatedExpense" } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.expense).toHaveProperty("name", "UpdatedExpense");
  });

  test("fails for invalid data", async function () {
    const all = await request(app)
      .get("/expenses")
      .set("authorization", userToken);
    const expenseId = all.body.expenses[0].id;
    const resp = await request(app)
      .patch(`/expenses/${expenseId}`)
      .send({ data: { amount: -100 } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(400);
  });
});

describe("DELETE /expenses/:expenseId", function () {
  test("works for valid delete", async function () {
    const all = await request(app)
      .get("/expenses")
      .set("authorization", userToken);
    const expenseId = all.body.expenses[0].id;
    const resp = await request(app)
      .delete(`/expenses/${expenseId}`)
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ deleted: `${expenseId}` });
  });

  test("fails for not found", async function () {
    const resp = await request(app)
      .delete("/expenses/999999")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(404);
  });
});
