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
    try {
      const categoryRes = await db.query(
        `SELECT id FROM categories WHERE name = $1 AND username = $2`,
        [category, username]
      );
      if (!categoryRes.rows[0]) {
        throw new ExpressError("Category not found", 404);
      }
    } catch (err) {
      console.error("Error reading category", err);
      throw new ExpressError("No such category", 500);
    }
    let query = `
    SELECT 
      TO_CHAR(DATE_TRUNC('month', CURRENT_DATE), 'Mon YYYY') AS month,
      SUM(e.amount) AS total_amount
    FROM expenses e
    LEFT JOIN categories c ON c.id = e.category_id
    WHERE e.username = $1
      AND e.date >= DATE_TRUNC('month', CURRENT_DATE) -- Start of the current month
      AND e.date <= CURRENT_DATE -- Up to the current date
      AND c.name = $2
    GROUP BY month
  `;

    const params = [username, category];

    try {
      const result = await db.query(query, params);

      const monthData = result.rows.map((row) => ({
        month: row.month,
        total_amount: +row.total_amount,
      }));
      return monthData[0];
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
    try {
      const categoryRes = await db.query(
        `SELECT id FROM categories WHERE name = $1 AND username = $2`,
        [category, username]
      );
      if (!categoryRes.rows[0]) {
        throw new ExpressError("Category not found", 404);
      }
    } catch (err) {
      console.error("Error reading category", err);
      throw new ExpressError("No such category", 500);
    }

    let query = `
    SELECT 
      TO_CHAR(DATE_TRUNC('month', e.date), 'Mon YYYY') AS month,
      DATE_TRUNC('month', e.date) AS month_start,
      SUM(e.amount) AS total_amount
      FROM expenses e
      LEFT JOIN categories c ON c.id = e.category_id
      WHERE e.username = $1
      AND e.date >= (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months')
      AND e.date <= CURRENT_DATE
      AND c.name = $2
      GROUP BY month, month_start
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
    let budgetType = null;
    try {
      const budgetRes = await db.query(
        `SELECT amount, type FROM budgets WHERE name = $1 AND username = $2`,
        [budget, username]
      );
      if (!budgetRes.rows[0]) {
        throw new ExpressError("Budget not found", 404);
      }
      budgetAmount = +budgetRes.rows[0].amount;
      budgetType = +budgetRes.rows[0].type;
    } catch (err) {
      console.error("Error reading budget", err);
      throw new ExpressError("No such budget", 500);
    }

    let dateFilter = "";
    if (budgetType === 1) {
      dateFilter = "AND e.date >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (budgetType === 2) {
      dateFilter = "AND e.date >= DATE_TRUNC('year', CURRENT_DATE)";
    } else if (budgetType === 3 || budgetType === 4) {
      dateFilter = "";
    }
    let query = `
    SELECT 
      TO_CHAR(DATE_TRUNC('month', CURRENT_DATE), 'Mon YYYY') AS current_month,
      SUM(e.amount) AS total_amount
    FROM expenses e
    LEFT JOIN budgets b ON b.id = e.budget_id
    WHERE e.username = $1
    ${dateFilter}
    AND b.name = $2
  `;

    const params = [username, budget];
    try {
      const result = await db.query(query, params);
      const monthData = result.rows.map((row) => ({
        month: row.current_month,
        total_amount: +row.total_amount,
        percent_used:
          budgetAmount > 0
            ? Number(((row.total_amount / budgetAmount) * 100).toFixed(2))
            : null,
      }));
      return monthData[0];
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
    let budgetType = null;

    try {
      const budgetRes = await db.query(
        `SELECT amount, type FROM budgets WHERE name = $1 AND username = $2`,
        [budget, username]
      );
      if (!budgetRes.rows[0]) {
        throw new ExpressError("Budget not found", 404);
      }
      budgetAmount = +budgetRes.rows[0].amount;
      budgetType = +budgetRes.rows[0].type;
    } catch (err) {
      console.error("Error reading budget", err);
      throw new ExpressError("No such budget", 500);
    }

    let dateFilter = "";
    let limitClause = "";

    if (budgetType === 1) {
      dateFilter = `
        AND e.date >= (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months')
        AND e.date <= CURRENT_DATE
      `;
      limitClause = "LIMIT 6";
    } else if (budgetType === 2) {
      // All months for the current year up to the current month
      dateFilter = `
        AND e.date >= DATE_TRUNC('year', CURRENT_DATE)
        AND e.date <= CURRENT_DATE
      `;
    } else if (budgetType === 3 || budgetType === 4) {
      // All months with reported expenses
      dateFilter = "AND e.date <= CURRENT_DATE";
    }

    let query = `
    SELECT 
      TO_CHAR(DATE_TRUNC('month', e.date), 'Mon YYYY') AS month,
      DATE_TRUNC('month', e.date) AS month_start,
      SUM(e.amount) AS total_amount
    FROM expenses e
    LEFT JOIN budgets b ON b.id = e.budget_id
    WHERE e.username = $1
      ${dateFilter}
      AND b.name = $2
    GROUP BY month, month_start
    ORDER BY month_start DESC
    ${limitClause}
  `;
    const params = [username, budget];

    try {
      const result = await db.query(query, params);

      // Add percent of budget used for each month
      return result.rows.map((row) => ({
        month: row.month,
        total_amount: +row.total_amount,
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

  /**
   * Get total os expenses for each category in the current month
   *
   * This function retrieves the total expenses for each category in the current month.
   *
   * Returns an array of objects, each containing the category name and the total amount spent in that category.
   */
  static async getCategoriesDashboard(username) {
    let query = `
    SELECT 
      c.name AS category,
      COALESCE(SUM(e.amount), 0) AS total_amount
    FROM categories c
    LEFT JOIN expenses e
      ON c.id = e.category_id
      AND e.username = $1
      AND e.date >= DATE_TRUNC('month', CURRENT_DATE)
      AND e.date <= CURRENT_DATE
    WHERE c.username = $1
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
  static async getBudgetsDashboard(username) {
    let query = `
    SELECT 
      b.name AS budget, 
      b.type, 
      b.amount,
      CASE 
        WHEN b.type = 1 THEN (
          SELECT COALESCE(SUM(e.amount), 0)
          FROM expenses e
          WHERE e.budget_id = b.id
          AND e.username = $1
          AND e.date >= DATE_TRUNC('month', CURRENT_DATE)
          AND e.date <= CURRENT_DATE
        )
        WHEN b.type = 2 THEN (
          SELECT COALESCE(SUM(e.amount), 0)
          FROM expenses e
          WHERE e.budget_id = b.id
          AND e.username = $1
          AND e.date >= DATE_TRUNC('year', CURRENT_DATE)
          AND e.date <= CURRENT_DATE
        )
        WHEN b.type IN (3, 4) THEN (
          SELECT COALESCE(SUM(e.amount), 0)
          FROM expenses e
          WHERE e.budget_id = b.id
          AND e.username = $1
          AND e.date <= CURRENT_DATE
        )
        ELSE 0
      END AS total_amount
    FROM budgets b
    WHERE b.username = $1
    ORDER BY b.name
  `;
    const params = [username];

    try {
      const result = await db.query(query, params);
      return result.rows.map((row) => ({
        budget: row.budget,
        type: row.type,
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
