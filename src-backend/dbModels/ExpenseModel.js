const db = require("../db");
const ExpressError = require("../helpers/expressError");
const { sqlForPartialUpdate } = require("../helpers/partialUpdate.js");

class Expense {
  /** Create a new expense
   *expense object
   * [{name, amount, description, date, category, budget}]
   *
   * Returns new expense data.
   *
   * */
  static async create(username, expenseData) {
    const category = await db.query(
      `SELECT id 
            FROM categories
            WHERE username = $1 AND name = $2`,
      [username, expenseData.category]
    );
    console.assert(category.rows[0], "Category not found to create expense");

    if (!category.rows[0]) {
      throw new ExpressError(`Category not found to create expense`, 400);
    }

    const budget = await db.query(
      `SELECT id 
            FROM budgets 
            WHERE username = $1 AND name = $2`,
      [username, expenseData.budget]
    );
    console.assert(budget.rows[0], "Budget not found to create expense");

    if (!budget.rows[0]) {
      throw new ExpressError(`Budget not found to create expense`, 400);
    }
    const result = await db.query(
      `INSERT INTO expenses (name, amount, description, date, category, budget_id, username)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, name, amount, description, date, category, budget_id AS budget`,
      [
        expenseData.name,
        expenseData.amount,
        expenseData.description || null,
        expenseData.date,
        category.rows[0].id,
        budget.rows[0].id,
        username,
      ]
    );
    const expense = result.rows[0];
    expense.category = expenseData.category;
    expense.budget = expenseData.budget;
    expense.amount = parseFloat(expense.amount);
    return expense;
  }

  /** Returns list of expenses for a provided username:
   *
   * [{id, name, amount, date, budget}, ...]
   *
   * Use filters to limit the results:
   * - start_date: YYYY-MM-DD
   * - end_date: YYYY-MM-DD
   * - category: string
   * - budget: string
   * - limit: number (default 20)
   * - offset: number (default 0)
   *
   * */
  static async getAll(username, filters) {
    const { limit, offset, start_date, end_date, category, budget } = filters;
    let query = `SELECT e.id, e.name, e.amount, e.date, b.name AS budget, c.name AS category
            FROM expenses AS e
            LEFT JOIN budgets AS b ON e.budget_id = b.id
            LEFT JOIN categories AS c ON e.category = c.id
            WHERE e.username = $1`;
    let values = [username];
    if (start_date) {
      query += ` AND e.date >= $${values.length + 1}`;
      values.push(start_date);
    }
    if (end_date) {
      query += ` AND e.date <= $${values.length + 1}`;
      values.push(end_date);
    }
    if (category) {
      const categoryResult = await db.query(
        `SELECT id 
            FROM categories 
            WHERE username = $1 AND name = $2`,
        [username, category]
      );
      if (!categoryResult.rows[0]) {
        throw new ExpressError(`Category not found to get expenses`, 400);
      }
      query += ` AND e.category = $${values.length + 1}`;
      values.push(categoryResult.rows[0].id);
    }
    if (budget) {
      const budgetResult = await db.query(
        `SELECT id
            FROM budgets 
            WHERE username = $1 AND name = $2`,
        [username, budget]
      );
      if (!budgetResult.rows[0]) {
        throw new ExpressError(`Budget not found to get expenses`, 400);
      }
      query += ` AND e.budget_id = $${values.length + 1}`;
      values.push(budgetResult.rows[0].id);
    }
    query += ` ORDER BY e.date DESC`;
    query += ` LIMIT $${values.length + 1}`;
    values.push(parseInt(limit) || 20);
    query += ` OFFSET $${values.length + 1}`;
    values.push(parseInt(offset) || 0);
    try {
      console.log("query", query);
      console.log("values", values);
      const result = await db.query(query, values);
      result.rows.forEach((expense) => {
        expense.amount = parseFloat(expense.amount);
      });
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new ExpressError("Error fetching expenses", 500);
    }
  }

  /** Returns expense info for given expense id and username
   *
   * return: {id, name, amount, description, date, budget, category}
   *
   * If expense cannot be found, should raise a 404.
   *
   **/

  static async get(username, expenseId) {
    const result = await db.query(
      `SELECT e.id, e.name, e.amount, e.description, e.date, b.name AS budget, c.name AS category
        FROM expenses AS e
        JOIN budgets AS b ON e.budget_id = b.id
        JOIN categories AS c ON e.category = c.id
        WHERE e.username = $1 AND e.id = $2`,
      [username, expenseId]
    );

    const expense = result.rows[0];

    if (!expense) {
      throw new ExpressError("No such expense", 404);
    }
    expense.amount = parseFloat(expense.amount);
    return expense;
  }

  /** Selectively updates expense information from given data
   *
   * If the target expense does not exist to given user, should raise a 404.
   *
   * Returns the data for the expense after update.
   *
   *
   **/

  static async update(username, expenseId, data) {
    const result = await db.query(
      `SELECT name
         FROM expenses
         WHERE username = $1 AND id = $2`,
      [username, expenseId]
    );
    if (result.rows.length === 0) {
      throw new ExpressError("No such expense", 404);
    }

    if (data.category) {
      const category = await db.query(
        `SELECT id 
            FROM categories 
            WHERE username = $1 AND name = $2`,
        [username, data.category]
      );
      console.assert(category.rows[0], "Category not found to update expense");

      if (!category.rows[0]) {
        throw new ExpressError(`Category not found to update expense`, 400);
      }
      data.category = category.rows[0].id;
    }

    if (data.budget) {
      const budget = await db.query(
        `SELECT id 
                FROM budgets 
                WHERE username = $1 AND name = $2`,
        [username, data.budget]
      );
      console.assert(budget.rows[0], "Budget not found to update expense");

      if (!budget.rows[0]) {
        throw new ExpressError(`Budget not found to update expense`, 400);
      }
      data.budget_id = budget.rows[0].id;
      delete data.budget;
    }

    let { query, values } = sqlForPartialUpdate(
      "expenses",
      data,
      "id",
      expenseId
    );
    await db.query(query, values);
    const updated = await this.get(username, expenseId);
    return updated;
  }

  /** Delete expense by id. Returns true.
   *
   * If expense cannot be found for given username, should raise a 404.
   *
   **/

  static async delete(username, expenseId) {
    const result = await db.query(
      "DELETE FROM expenses WHERE username = $1 AND id = $2 RETURNING name",
      [username, expenseId]
    );
    const deletedExpense = result.rows[0];

    if (!deletedExpense) {
      throw new ExpressError("No such expense", 404);
    }
    return true;
  }
}

module.exports = Expense;
