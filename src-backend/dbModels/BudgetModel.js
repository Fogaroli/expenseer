const db = require("../db");
const ExpressError = require("../helpers/expressError");
const { sqlForPartialUpdate } = require("../helpers/partialUpdate.js");

class Budget {
  /** Create a new budget.
   *
   * [{name, type, amount, username}]
   * Optional: {description}
   *
   * Returns new budget data.
   *
   * */
  static async create(username, budget) {
    const duplicateCheck = await db.query(
      `SELECT name 
            FROM budgets 
            WHERE username = $1 AND name = $2`,
      [username, budget.name]
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(`User already have a budget with this name`, 400);
    }

    const result = await db.query(
      `INSERT INTO budgets (name, type, amount, description, username)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING name, type, amount, description`,
      [
        budget.name,
        budget.type,
        budget.amount,
        budget.description || null,
        username,
      ]
    );
    const newBudget = result.rows[0];
    // Convert amount to a number before returning
    newBudget.amount = parseFloat(newBudget.amount);
    return newBudget;
  }

  /** Returns list of budgets for a provided username:
   *
   * [{name, type, amount, description}, ...]
   *
   * */
  static async getAll(username) {
    const result = await db.query(
      `SELECT name, amount, type
            FROM budgets
            WHERE username = $1 
            ORDER BY name`,
      [username]
    );
    result.rows.forEach((budget) => {
      budget.amount = parseFloat(budget.amount);
    });
    return result.rows;
  }

  /** Returns budget info for given budget and username
   *
   * return: {name, type, amount, description}
   *
   * If budget cannot be found, should raise a 404.
   *
   **/

  static async get(username, budgetName) {
    const result = await db.query(
      `SELECT name, type, amount, description
         FROM budgets
         WHERE username = $1 AND name = $2`,
      [username, budgetName]
    );

    const readBudget = result.rows[0];

    if (!readBudget) {
      throw new ExpressError("No such budget", 404);
    }

    // Convert amount to a number before returning
    readBudget.amount = parseFloat(readBudget.amount);
    return readBudget;
  }

  /** Selectively updates budget from given data
   *
   * If the target budget could not be found for given user, should raise a 404.
   *
   * Returns data from budget after update.
   *
   **/

  static async update(username, budgetName, data) {
    const duplicateCheck = await db.query(
      `SELECT name 
            FROM budgets 
            WHERE username = $1 AND name = $2`,
      [username, data.name]
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(`User already have a budget with this name`, 400);
    }
    const result = await db.query(
      `SELECT name, type
         FROM budgets
         WHERE username = $1 AND name = $2`,
      [username, budgetName]
    );
    if (result.rows.length === 0) {
      throw new ExpressError("No such budget", 404);
    }

    let { query, values } = sqlForPartialUpdate(
      "budgets",
      data,
      "name",
      budgetName
    );
    const updated = await db.query(query, values);
    const readBudget = updated.rows[0];
    delete readBudget.id;
    delete readBudget.username;
    readBudget.amount = parseFloat(readBudget.amount);
    return readBudget;
  }

  /** Delete budget by name. Returns true.
   *
   * If budget cannot be found, should raise a 404.
   *
   **/

  static async delete(username, budgetName) {
    const result = await db.query(
      "DELETE FROM budgets WHERE username = $1 AND name = $2 RETURNING name",
      [username, budgetName]
    );
    const deletedBudget = result.rows[0];

    if (!deletedBudget) {
      throw new ExpressError("No such budget", 404);
    }
    return true;
  }
}

module.exports = Budget;
