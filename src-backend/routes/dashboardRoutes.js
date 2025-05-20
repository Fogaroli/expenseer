"use strict";

/** Routes for Dashboards. */

const express = require("express");
const { ensureLoggedIn } = require("../middleware/authMiddleware");
const ExpressError = require("../helpers/expressError");
const Dashboard = require("../dbModels/DashboardModel");
const Budget = require("../dbModels/BudgetModel");

const router = express.Router();

/**
 * Get dashboard data for a specific category
 *
 * GET /category?category=<category_name> =>
 *      { dashboard: { category, current_month : {month, total_amount}, history : {month, total_amount} } }
 *
 * This route returns the current month data and history for a specific category.
 */
router.get("/category", ensureLoggedIn, async function (req, res, next) {
  try {
    const category = req.query.category;
    const user = res.locals.user.username;

    if (!category) {
      throw new ExpressError("Category is required", 400);
    }

    const currentMonth = await Dashboard.getByCategory(user, category);
    const history = await Dashboard.getHistoryByCategory(user, category);

    return res.json({
      dashboard: {
        category,
        current_month: currentMonth,
        history,
      },
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get dashboard data for a specific budget
 *
 * GET /budget?budget=<budget_name> =>
 *      { dashboard: { budget, type, amount, current_month : {month, total_amount, percentage_used},
 *          history : {month, total_amount, percentage_used} } }
 *
 * This route returns the current month data and history for a specific budget.
 */
router.get("/budget", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = res.locals.user.username;

    if (!req.query.budget) {
      throw new ExpressError("Budget is required", 400);
    }

    const budget = await Budget.get(res.locals.user.username, req.query.budget);
    const currentMonth = await Dashboard.getByBudget(user, budget.name);
    const history = await Dashboard.getHistoryByBudget(user, budget.name);

    return res.json({
      dashboard: {
        budget: budget.name,
        type: budget.type,
        amount: budget.amount,
        current_month: currentMonth,
        history,
      },
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get summary dashboard data for all categories
 *
 * GET /category =>
 *      { dashboard: { categories : [{category, total_amount}, ...] } }
 *
 * This route returns the current month data for all categories.
 */
router.get("/categories", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = res.locals.user.username;

    const categoryExpenses = await Dashboard.getCategoriesDashboard(user);

    return res.json({
      dashboard: {
        categories: categoryExpenses,
      },
    });
  } catch (err) {
    return next(err);
  }
});

/**
 *
 * Get summary dashboard data for all budgets
 *
 * GET /expenses/budget =>
 *     { dashboard: { budgets : [{budget, type, total_amount, budget_amount, "percentage_used"}, ...] } }
 *
 * The returned data depensds on the type of budged being reported. Monthly budged will show current month aggregate,
 * yearly budged will show current year aggregate, event budget and savings will return total aggregate value for all expenses/deposits found in teh database.
 *
 */
router.get("/budgets", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = res.locals.user.username;

    const budgetExpenses = await Dashboard.getBudgetsDashboard(user);

    return res.json({
      dashboard: {
        budgets: budgetExpenses,
      },
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
