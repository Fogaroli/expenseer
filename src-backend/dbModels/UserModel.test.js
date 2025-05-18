"use strict";

const db = require("../db.js");
const User = require("./UserModel");
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

/************************************** register */

describe("test function register", function () {
  const newUser = {
    username: "newuser",
    password: "password123",
    first_name: "New",
    last_name: "User",
    email: "newuser@example.com",
    image_url: null,
  };

  test("works", async function () {
    const user = await User.register(newUser);
    expect(user).toEqual({
      username: "newuser",
      first_name: "New",
      last_name: "User",
      email: "newuser@example.com",
      image_url:
        "https://images.freeimages.com/fic/images/icons/989/ivista_2/256/user.png",
      last_logged: expect.any(Date),
    });

    const found = await db.query(
      "SELECT * FROM users WHERE username = 'newuser'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].username).toEqual("newuser");
  });

  test("bad request with duplicate username", async function () {
    try {
      await User.register({
        username: "tuser1",
        password: "password123",
        first_name: "Duplicate",
        last_name: "User",
        email: "duplicate@example.com",
      });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(400);
    }
  });
});

/************************************** authenticate */

describe("test function authenticate", function () {
  test("works for non admin", async function () {
    const user = await User.authenticate("tuser1", "password1");
    expect(user).toEqual({
      username: "tuser1",
      first_name: "TUser 1 Name",
      last_name: "TUser 1 Last",
      last_logged: expect.any(Date),
      email: "u1@email.com",
      image_url: null,
    });
  });

  test("works for admin", async function () {
    const user = await User.authenticate("tuser2", "password2");
    expect(user).toEqual({
      username: "tuser2",
      first_name: "TUser 2 Name",
      last_name: "TUser 2 Last",
      last_logged: expect.any(Date),
      email: "u2@email.com",
      image_url: null,
      is_admin: true,
    });
  });

  test("error if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(401);
    }
  });

  test("error if wrong password", async function () {
    try {
      await User.authenticate("tuser1", "wrongpassword");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(401);
    }
  });
});

/************************************** getAll */

describe("test function getAll", function () {
  test("works", async function () {
    const users = await User.getAll();
    expect(users).toEqual([
      {
        username: "tuser1",
        first_name: "TUser 1 Name",
        last_name: "TUser 1 Last",
        email: "u1@email.com",
      },
      {
        username: "tuser2",
        first_name: "TUser 2 Name",
        last_name: "TUser 2 Last",
        email: "u2@email.com",
      },
    ]);
  });
});

/************************************** get */

describe("test function get", function () {
  test("works for non admin user", async function () {
    const user = await User.get("tuser1");
    expect(user).toEqual({
      username: "tuser1",
      first_name: "TUser 1 Name",
      last_name: "TUser 1 Last",
      email: "u1@email.com",
      image_url: null,
      last_logged: expect.any(Date),
    });
  });

  test("works for admin users", async function () {
    const user = await User.get("tuser2");
    expect(user).toEqual({
      username: "tuser2",
      first_name: "TUser 2 Name",
      last_name: "TUser 2 Last",
      email: "u2@email.com",
      image_url: null,
      last_logged: expect.any(Date),
      is_admin: true,
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });
});

/************************************** update */

describe("test function update", function () {
  const updateData = {
    first_name: "Updated",
    last_name: "User",
    email: "updated@example.com",
  };

  test("works", async function () {
    const user = await User.update("tuser1", updateData);
    expect(user).toEqual({
      username: "tuser1",
      first_name: "Updated",
      last_name: "User",
      email: "updated@example.com",
      image_url: null,
      last_logged: expect.any(Date),
    });
  });

  test("works to ser user admin", async function () {
    const user = await User.update("tuser1", { ...updateData, is_admin: true });
    expect(user).toEqual({
      username: "tuser1",
      first_name: "Updated",
      last_name: "User",
      email: "updated@example.com",
      image_url: null,
      last_logged: expect.any(Date),
      is_admin: true,
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });

  test("bad request if no data", async function () {
    try {
      await User.update("tuser1", {});
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(400);
    }
  });
});

/************************************** delete */

describe("test function delete", function () {
  test("works", async function () {
    const result = await User.delete("tuser1");
    expect(result).toBe(true);

    const res = await db.query("SELECT * FROM users WHERE username = 'tuser1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.delete("nope");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
      expect(err.status).toBe(404);
    }
  });
});
