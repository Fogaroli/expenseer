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
      console.assert(
        !duplicateCheck.rows[0],
        "Attempt to create already existing budget"
      );

      if (duplicateCheck.rows[0]) {
        throw new ExpressError(
          `User already have a budget with this name`,
          400
        );
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
      const readBudget = result.rows[0];
      // Convert amount to a number before returning
      readBudget.amount = parseFloat(readBudget.amount);
      return readBudget
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
            ORDER BY username`,
            [username]
    );
    return result.rows;
  }

  /** Returns budget info for given budget and username
   *
   * return: {name, type, amount, description}
   * If user is admin, add is_admin: true to the return object.
   *
   * If user cannot be found, should raise a 404.
   *
   **/

  static async get(username, budget) {
    const result = await db.query(
      `SELECT name, type, amount, description
         FROM budgets
         WHERE username = $1 AND name = $2`,
      [username, budget]
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
   * If the target budget does not belong to given user, should raise a 401.
   *
   * Returns all data about budget.
   *
   * If budget cannot be found, should raise a 404.
   *
   **/

  static async update(username, budget, data) {
    const result = await db.query(
      `SELECT name, type
         FROM budgets
         WHERE username = $1 AND name = $2`,
      [username, budget]
    );
    if (result.rows.length === 0) {
      throw new ExpressError("No such budget", 404);
    }

    let { query, values } = sqlForPartialUpdate(
      "budgets",
      data,
      "name",
      budget
    );

    const updated = await db.query(query, values);
    const readBudget = updated.rows[0];
    delete readBudget.id;
    delete readBudget.username;
    readBudget.amount = parseFloat(readBudget.amount);
    return readBudget;
  }

  /** Delete budget for given budget name. Returns true.
   *
   * If budget cannot be found, should raise a 404.
   *
   **/

  static async delete(username, budget) {
    const result = await db.query(
      "DELETE FROM budgets WHERE username = $1 AND name = $2 RETURNING name",
      [username, budget]
    );
    const deletedBudget = result.rows[0];

    if (!deletedBudget) {
      throw new ExpressError("No such budget", 404);
    }
    return true;
  }
}

module.exports = Budget;
