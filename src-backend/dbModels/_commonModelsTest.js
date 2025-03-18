const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

async function commonBeforeAll() {

  await db.query("DELETE FROM users");

  await db.query(
    `
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email,
                          last_logged,
                          is_admin)
        VALUES ('tuser1', $1, 'TUser 1 Name', 'TUser 1 Last', 'u1@email.com', '2025-01-01', false),
               ('tuser2', $2, 'TUser 2 Name', 'TUser 2 Last', 'u2@email.com', '2025-01-01', true)
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};

