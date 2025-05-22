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

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /auth/login", function () {
  test("works for valid credentials", async function () {
    const resp = await request(app)
      .post("/auth/login")
      .send({ username: "tuser1", password: "password1" });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toHaveProperty("token");
    expect(resp.body).toHaveProperty("last_logged");
  });

  test("fails for invalid credentials", async function () {
    const resp = await request(app)
      .post("/auth/login")
      .send({ username: "tuser1", password: "wrongpassword" });
    expect(resp.statusCode).toBe(401);
    expect(resp.body.message).toBeDefined();
  });

  test("fails for missing data", async function () {
    const resp = await request(app)
      .post("/auth/login")
      .send({ username: "tuser1" });
    expect(resp.statusCode).toBe(400);
    expect(resp.body.message).toBeDefined();
  });
});

describe("POST /auth/register", function () {
  test("works for valid registration", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "newuser",
      password: "newpassword",
      first_name: "New",
      last_name: "User",
      email: "newuser@example.com",
    });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toHaveProperty("token");
    expect(resp.body).toHaveProperty("last_logged");
  });

  test("fails for missing required fields", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "nouser",
      password: "nopass",
    });
    expect(resp.statusCode).toBe(400);
    expect(resp.body.message).toBeDefined();
  });

  test("fails for duplicate username", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "tuser1",
      password: "password1",
      first_name: "Test",
      last_name: "User",
      email: "tuser1@example.com",
    });
    expect(resp.statusCode).toBe(400);
    expect(resp.body.message).toBeDefined();
  });
});
