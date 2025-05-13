"use strict";

const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../dbModels/_commonModelsTest.js");

let adminToken, userToken;

beforeAll(commonBeforeAll);
beforeEach(async () => {
  await commonBeforeEach();
  // Login as admin and user
  let resp = await request(app)
    .post("/auth/login")
    .send({ username: "tuser2", password: "password2" });
  adminToken = resp.body.token;
  resp = await request(app)
    .post("/auth/login")
    .send({ username: "tuser1", password: "password1" });
  userToken = resp.body.token;
});
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /users", function () {
  test("admin can add user", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        data: {
          username: "newuser",
          password: "newpass",
          first_name: "New",
          last_name: "User",
          email: "newuser@example.com",
        },
      })
      .set("authorization", adminToken);
    expect(resp.statusCode).toBe(201);
    expect(resp.body.user).toHaveProperty("username", "newuser");
    expect(resp.body).toHaveProperty("token");
  });

  test("non-admin cannot add user", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        data: {
          username: "failuser",
          password: "failpass",
          first_name: "Fail",
          last_name: "User",
          email: "failuser@example.com",
        },
      })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(403);
  });
});

describe("GET /users", function () {
  test("admin can get all users", async function () {
    const resp = await request(app)
      .get("/users")
      .set("authorization", adminToken);
    expect(resp.statusCode).toBe(200);
    expect(Array.isArray(resp.body.users)).toBe(true);
  });

  test("non-admin cannot get all users", async function () {
    const resp = await request(app)
      .get("/users")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(403);
  });
});

describe("GET /users/:username", function () {
  test("admin can get any user", async function () {
    const resp = await request(app)
      .get("/users/tuser1")
      .set("authorization", adminToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.user).toHaveProperty("username", "tuser1");
  });

  test("user can get own data", async function () {
    const resp = await request(app)
      .get("/users/tuser1")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.user).toHaveProperty("username", "tuser1");
  });

  test("user cannot get other user's data", async function () {
    const resp = await request(app)
      .get("/users/tuser2")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(403);
  });
});

describe("PATCH /users/:username", function () {
  test("admin can update any user", async function () {
    const resp = await request(app)
      .patch("/users/tuser1")
      .send({ data: { first_name: "Updated" } })
      .set("authorization", adminToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.user).toHaveProperty("first_name", "Updated");
  });

  test("user can update own data", async function () {
    const resp = await request(app)
      .patch("/users/tuser1")
      .send({ data: { last_name: "Changed" } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.user).toHaveProperty("last_name", "Changed");
  });

  test("user cannot update other user", async function () {
    const resp = await request(app)
      .patch("/users/tuser2")
      .send({ data: { last_name: "Nope" } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(403);
  });
});

describe("PATCH /users/:username/setAdmin", function () {
  test("admin can set user as admin", async function () {
    const resp = await request(app)
      .patch("/users/tuser1/setAdmin")
      .send({ data: { is_admin: true } })
      .set("authorization", adminToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.user).toHaveProperty("is_admin", true);
  });

  test("non-admin cannot set admin", async function () {
    const resp = await request(app)
      .patch("/users/tuser1/setAdmin")
      .send({ data: { is_admin: true } })
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(403);
  });
});

describe("DELETE /users/:username", function () {
  test("admin can delete any user", async function () {
    const resp = await request(app)
      .delete("/users/tuser1")
      .set("authorization", adminToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ deleted: "tuser1" });
  });

  test("user can delete self", async function () {
    const resp = await request(app)
      .delete("/users/tuser1")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ deleted: "tuser1" });
  });

  test("user cannot delete other user", async function () {
    const resp = await request(app)
      .delete("/users/tuser2")
      .set("authorization", userToken);
    expect(resp.statusCode).toBe(403);
  });
});
