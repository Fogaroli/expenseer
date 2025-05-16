const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

async function commonBeforeAll() {
  await db.query("DELETE FROM expenses");
  await db.query("DELETE FROM user_exchange");
  await db.query("DELETE FROM exchanges");
  await db.query("DELETE FROM categories");
  await db.query("DELETE FROM budgets");
  await db.query("DELETE FROM users");
}

async function commonBeforeEach() {
  await db.query("BEGIN");
  await db.query(
    `
      INSERT INTO users (username,
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

  // Insert categories for both users
  await db.query(`
    INSERT INTO categories (name, username)
    VALUES ('Bills', 'tuser1'),
           ('Groceries', 'tuser1'),
           ('Fun', 'tuser1'),
           ('Bills', 'tuser2')
  `);

  // Insert budgets for both users
  await db.query(`
    INSERT INTO budgets(name, type, amount, description, username)
    VALUES ('Groceries', 1, 500.00, 'Monthly groceries budget', 'tuser1'),
           ('Entertainment', 2, 200.00, 'Monthly entertainment budget', 'tuser1'),
           ('Main', 1, 1000.00, 'Main budget', 'tuser1'),
           ('Vacation', 3, 1000.00, 'Vacation savings', 'tuser2')
  `);

  // Insert expenses for tuser1 in current month
  await db.query(`
    INSERT INTO expenses (name, amount, date, username, category_id, budget_id)
    VALUES 
      ('Electric Bill', 100.00, CURRENT_DATE, 'tuser1',
        (SELECT id FROM categories WHERE name='Bills' AND username='tuser1'),
        (SELECT id FROM budgets WHERE name='Main' AND username='tuser1')),
      ('Supermarket', 50.00, CURRENT_DATE, 'tuser1',
        (SELECT id FROM categories WHERE name='Groceries' AND username='tuser1'),
        (SELECT id FROM budgets WHERE name='Groceries' AND username='tuser1')),
      ('Movie', 20.00, CURRENT_DATE, 'tuser1',
        (SELECT id FROM categories WHERE name='Fun' AND username='tuser1'),
        (SELECT id FROM budgets WHERE name='Entertainment' AND username='tuser1'))
  `);

  // Insert exchanges
  await db.query(`
      INSERT INTO exchanges (currency1, currency2, rate, last_update)
      VALUES ('USD', 'EUR', 0.9, NOW() - INTERVAL '2 days'),
             ('EUR', 'USD', 1.1, NOW() - INTERVAL '1 hour')
    `);

  // Assign exchanges to users
  await db.query(`
      INSERT INTO user_exchange (username, exchange_id)
      VALUES ('tuser1', (SELECT id FROM exchanges WHERE currency1='USD' AND currency2='EUR')),
             ('tuser1', (SELECT id FROM exchanges WHERE currency1='EUR' AND currency2='USD')),
             ('tuser2', (SELECT id FROM exchanges WHERE currency1='USD' AND currency2='EUR'))
    `);
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
