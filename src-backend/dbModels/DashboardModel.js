const db = require("../db.js");
const ExpressError = require("../helpers/expressError.js");

class Dashboard {
  /** Get dashboard data for a given category
   *
   * This function retrieves the total expenses for a specific category in the current month.
   *
   * Returns the category name and the total amount spent in that category for the current month.
   */
  static async getByCategory(username, category) {
    let query = `
    SELECT 
      TO_CHAR(DATE_TRUNC('month', e.date), 'Mon YYYY') AS month,
      DATE_TRUNC('month', e.date) AS month_start,
      SUM(e.amount) AS total_amount
      FROM expenses e
      JOIN categories c ON c.id = e.category
      WHERE e.username = $1
      AND e.date >= DATE_TRUNC('month', CURRENT_DATE)
      AND c.name = $2
      GROUP BY month, month_start
      ORDER BY month_start DESC
    `;

    const params = [username, category];

    try {
      const result = await db.query(query, params);

      return result.rows.map((row) => ({
        month: row.month,
        total_amount: +row.total_amount,
      }));
    } catch (err) {
      console.error("Error fetching category data:", err);
      throw new ExpressError("Error fetching category data", 500);
    }
  }

  /** Get historical data for a given category
   *
   * This function retrieves the total expenses for a specific category in the last 6 months.
   *
   * Returns the historical data for the specified category.
   */
  static async getHistoryByCategory(username, category) {
    let query = `
    SELECT 
      TO_CHAR(DATE_TRUNC('month', e.date), 'Mon YYYY') AS month,
      DATE_TRUNC('month', e.date) AS month_start,
      SUM(e.amount) AS total_amount
      FROM expenses e
      JOIN categories c ON c.id = e.category
      WHERE e.username = $1
      AND e.date >= (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months')
      AND c.name = $2  GROUP BY month, month_start
      ORDER BY month_start DESC
      LIMIT 6
    `;

    const params = [username, category];
    try {
      const result = await db.query(query, params);
      return result.rows.map((row) => ({
        month: row.month,
        total_amount: +row.total_amount,
      }));
    } catch (err) {
      console.error("Error fetching category history:", err);
      throw new ExpressError("Error fetching category history", 500);
    }
  }

  /** Get dashboard data for a given budget
   *
   * This function retrieves the total expenses for a specific budget in the current month.
   *
   * Returns the budget name and the total amount spent in that budget for the current month.
   */
  static async getByBudget(username, budget) {
    let budgetAmount = null;
    try {
      const budgetRes = await db.query(
        `SELECT amount FROM budgets WHERE name = $1 AND username = $2`,
        [budget, username]
      );
      if (!budgetRes.rows[0]) {
        throw new ExpressError("Budget not found", 404);
      }
      budgetAmount = +budgetRes.rows[0].amount;
    } catch (err) {
      console.error("Error reading budget", err);
      throw new ExpressError("No such budget", 500);
    }
    let query = `
    SELECT 
      TO_CHAR(DATE_TRUNC('month', e.date), 'Mon YYYY') AS month,
      DATE_TRUNC('month', e.date) AS month_start,
      SUM(e.amount) AS total_amount
      FROM expenses e
      JOIN budgets b ON b.id = e.budget_id
      WHERE e.username = $1
      AND e.date >= DATE_TRUNC('month', CURRENT_DATE)
      AND b.name = $2
      GROUP BY month, month_start
      ORDER BY month_start DESC
    `;

    const params = [username, budget];
    try {
      const result = await db.query(query, params);

      return result.rows.map((row) => ({
        month: row.month,
        total_amount: +row.total_amount,
        budget_amount: budgetAmount,
        percent_used:
          budgetAmount > 0
            ? Number(((row.total_amount / budgetAmount) * 100).toFixed(2))
            : null,
      }));
    } catch (err) {
      console.error("Error fetching budget data:", err);
      throw new ExpressError("Error fetching budget data", 500);
    }
  }

  /** Get historical data for given budget
   *
   * This function retrieves the total expenses for a specific budget in teh last 6 months.
   *
   */
  static async getHistoryByBudget(username, budget) {
    let budgetAmount = null;
    try {
      const budgetRes = await db.query(
        `SELECT amount FROM budgets WHERE name = $1 AND username = $2`,
        [budget, username]
      );
      if (!budgetRes.rows[0]) {
        throw new ExpressError("Budget not found", 404);
      }
      budgetAmount = +budgetRes.rows[0].amount;
    } catch (err) {
      console.error("Error reading budget", err);
      throw new ExpressError("No such budget", 500);
    }

    let query = `
    SELECT 
      TO_CHAR(DATE_TRUNC('month', e.date), 'Mon YYYY') AS month,
      DATE_TRUNC('month', e.date) AS month_start,
      SUM(e.amount) AS total_amount
      FROM expenses e
      JOIN budgets b ON b.id = e.budget_id
      WHERE e.username = $1
      AND e.date >= (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months')
      AND b.name = $2 
      GROUP BY month, month_start
      ORDER BY month_start DESC
      LIMIT 6
    `;
    const params = [username, budget];

    try {
      const result = await db.query(query, params);

      // Add percent of budget used for each month
      return result.rows.map((row) => ({
        month: row.month,
        total_amount: +row.total_amount,
        budget_amount: budgetAmount,
        percent_used:
          budgetAmount > 0
            ? Number(((row.total_amount / budgetAmount) * 100).toFixed(2))
            : null,
      }));
    } catch (err) {
      console.error("Error fetching budget history:", err);
      throw new ExpressError("Error fetching budget history", 500);
    }
  }

  /** Get all Monthly budgets for a user
   *
   * This function retrieves all budgets of the type month (type 1) for a specific user.
   *
   * Returns an array of budget objects, total expenses int eh current month and percentage.
   */
  static async getMonthlyBudgets(username) {
    let query = `
    SELECT 
      b.name,
      b.amount,
      SUM(e.amount) AS total_amount
      FROM budgets b
      LEFT JOIN expenses e ON e.budget_id = b.id
      WHERE b.username = $1
      AND b.type = 1
      AND e.date >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY b.name, b.amount
      ORDER BY b.name
    `;
    const params = [username];

    try {
      const result = await db.query(query, params);
      return result.rows.map((row) => ({
        name: row.name,
        total_amount: +row.total_amount,
        budget_amount: +row.amount,
        percent_used:
          row.amount > 0
            ? Number(((row.total_amount / row.amount) * 100).toFixed(2))
            : null,
      }));
    } catch (err) {
      console.error("Error fetching monthly budgets:", err);
      throw new ExpressError("Error fetching monthly budgets", 500);
    }
  }

  /** Get all Yearly budgets for a user
   *
   * This function retrieves all budgets of the type year (type 2) for a specific user.
   *
   * Returns an array of budget objects, total expenses in the current month and percentage.
   */
  static async getYearlyBudgets(username) {
    let query = `
    SELECT 
      b.name,
      b.amount,
      SUM(e.amount) AS total_amount
      FROM budgets b
      LEFT JOIN expenses e ON e.budget_id = b.id
      WHERE b.username = $1
      AND b.type = 2
      AND e.date >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY b.name, b.amount
      ORDER BY b.name
    `;
    const params = [username];

    try {
      const result = await db.query(query, params);
      return result.rows.map((row) => ({
        name: row.name,
        total_amount: +row.total_amount,
        budget_amount: +row.amount,
        percent_used:
          row.amount > 0
            ? Number(((row.total_amount / row.amount) * 100).toFixed(2))
            : null,
      }));
    } catch (err) {
      console.error("Error fetching yearly budgets:", err);
      throw new ExpressError("Error fetching yearly budgets", 500);
    }
  }

  /** Get all individual event budgets for a user
   *
   * This function retrieves all budgets of the type event (type 3) for a specific user.
   *
   * Returns an array of budget objects, total expenses in the current month and percentage.
   */
  static async getEventBudgets(username) {
    let query = `
    SELECT 
      b.name,
      b.amount,
      SUM(e.amount) AS total_amount
      FROM budgets b
      LEFT JOIN expenses e ON e.budget_id = b.id
      WHERE b.username = $1
      AND b.type = 3
      AND e.date >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY b.name, b.amount
      ORDER BY b.name
    `;
    const params = [username];

    try {
      const result = await db.query(query, params);
      return result.rows.map((row) => ({
        name: row.name,
        total_amount: +row.total_amount,
        budget_amount: +row.amount,
        percent_used:
          row.amount > 0
            ? Number(((row.total_amount / row.amount) * 100).toFixed(2))
            : null,
      }));
    } catch (err) {
      console.error("Error fetching event budgets:", err);
      throw new ExpressError("Error fetching event budgets", 500);
    }
  }

  /** Get all savings budgets for a user
   *
   * This function retrieves all budgets of the type savings (type 4) for a specific user.
   *
   * Returns an array of budget objects, total expenses in the current month and percentage.
   */
  static async getSavingsBudgets(username) {
    let query = `
    SELECT 
      b.name,
      b.amount,
      SUM(e.amount) AS total_amount
      FROM budgets b
      LEFT JOIN expenses e ON e.budget_id = b.id
      WHERE b.username = $1
      AND b.type = 4
      AND e.date >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY b.name, b.amount
      ORDER BY b.name
    `;
    const params = [username];

    try {
      const result = await db.query(query, params);
      return result.rows.map((row) => ({
        name: row.name,
        total_amount: +row.total_amount,
        budget_amount: +row.amount,
        percent_used:
          row.amount > 0
            ? Number(((row.total_amount / row.amount) * 100).toFixed(2))
            : null,
      }));
    } catch (err) {
      console.error("Error fetching event budgets:", err);
      throw new ExpressError("Error fetching event budgets", 500);
    }
  }

  /**
   * Get total os expenses for each category in the current month
   *
   * This function retrieves the total expenses for each category in the current month.
   *
   * Returns an array of objects, each containing the category name and the total amount spent in that category.
   */
  static async getCurrentMonthExpensesByCategory(username) {
    let query = `
    SELECT 
      c.name AS category,
      SUM(e.amount) AS total_amount
      FROM expenses e
      JOIN categories c ON c.id = e.category
      WHERE e.username = $1
      AND e.date >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY c.name
      ORDER BY c.name
    `;
    const params = [username];

    try {
      const result = await db.query(query, params);
      return result.rows.map((row) => ({
        category: row.category,
        total_amount: +row.total_amount,
      }));
    } catch (err) {
      console.error("Error fetching current month expenses by category:", err);
      throw new ExpressError(
        "Error fetching current month expenses by category",
        500
      );
    }
  }

  /**
   * Get total expenses for each budget in the current month
   *
   * This function retrieves the total expenses for each budget in the current month.
   *
   * Returns an array of objects, each containing the budget name and the total amount spent in that budget.
   */
  static async getCurrentMonthExpensesByBudget(username) {
    let query = `
    SELECT 
      b.name AS budget,
      b.amount,
      SUM(e.amount) AS total_amount
      FROM expenses AS e
      JOIN budgets AS b ON b.id = e.budget_id
      WHERE e.username = $1
      AND e.date >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY b.name, b.amount
      ORDER BY b.name
    `;
    const params = [username];

    try {
      const result = await db.query(query, params);
      return result.rows.map((row) => ({
        budget: row.budget,
        total_amount: +row.total_amount,
        budget_amount: +row.amount,
        percent_used:
          row.amount > 0
            ? Number(((row.total_amount / row.amount) * 100).toFixed(2))
            : null,
      }));
    } catch (err) {
      console.error("Error fetching current month expenses by budget:", err);
      throw new ExpressError(
        "Error fetching current month expenses by budget",
        500
      );
    }
  }
}

module.exports = Dashboard;
