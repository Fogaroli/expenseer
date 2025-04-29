"use strict";

/** Routes for Dashboards. */

const express = require("express");
const { ensureLoggedIn } = require("../middleware/authMiddleware");
const ExpressError = require("../helpers/expressError");
const Dashboard = require("../dbModels/DashboardModel");

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
 *      { dashboard: { budget, current_month : {month, total_amount, budget_amount, percentage_used},
 *          history : {month, total_amount, budget_amount, percentage_used} } }
 *
 * This route returns the current month data and history for a specific budget.
 */
router.get("/budget", ensureLoggedIn, async function (req, res, next) {
  try {
    const budget = req.query.budget;
    const user = res.locals.user.username;

    if (!budget) {
      throw new ExpressError("Budget is required", 400);
    }

    const currentMonth = await Dashboard.getByBudget(user, budget);
    const history = await Dashboard.getHistoryByBudget(user, budget);

    return res.json({
      dashboard: {
        budget,
        current_month: currentMonth,
        history,
      },
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get dashboard data for all monthly budgets in the current month
 *
 * GET /monthly =>
 *      { dashboard: { monthly_budget : [{name, total_amount, budget_amount, percentage_used}, ...] } }
 *
 * This route returns the current month data for all monthly budgets.
 */
router.get("/monthly", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = res.locals.user.username;

    const monthlyBudget = await Dashboard.getMonthlyBudgets(user);

    return res.json({
      dashboard: {
        monthly_budget: monthlyBudget,
      },
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get dashboard data for all yearly budgets in the current month
 *
 * GET /yearly =>
 *      { dashboard: { yearly_budget : [{name, total_amount, budget_amount, percentage_used}, ...] } }
 *
 * This route returns the current month data for all yearly budgets.
 */
router.get("/yearly", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = res.locals.user.username;

    const yearlyBudget = await Dashboard.getYearlyBudgets(user);

    return res.json({
      dashboard: {
        yearly_budget: yearlyBudget,
      },
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get dashboard data for all event budgets in the current month
 *
 * GET /event =>
 *      { dashboard: { event_budget : [{name, total_amount, budget_amount, percentage_used}, ...] } }
 *
 * This route returns the current month data for all event budgets.
 */
router.get("/event", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = res.locals.user.username;

    const eventBudget = await Dashboard.getEventBudgets(user);

    return res.json({
      dashboard: {
        event_budget: eventBudget,
      },
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get dashboard data for all savings budgets in the current month
 *
 * GET /savings =>
 *      { dashboard: { saving_budget : [{name, total_amount, budget_amount, percentage_used}, ...] } }
 *
 * This route returns the current month data for all savings budgets.
 */
router.get("/savings", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = res.locals.user.username;

    const savingsBudget = await Dashboard.getSavingsBudgets(user);

    return res.json({
      dashboard: {
        saving_budget: savingsBudget,
      },
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get dashboard data for all expenses in the current month total value by category
 *
 * GET /expenses/category =>
 *      { dashboard: { expenses : [{category, total_amount}, ...] } }
 *
 * This route returns the current month data for all expenses by category.
 */
router.get(
  "/expenses/category",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const user = res.locals.user.username;

      const categoryExpenses =
        await Dashboard.getCurrentMonthExpensesByCategory(user);

      return res.json({
        dashboard: {
          expenses: categoryExpenses,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

/**
 *
 * Get dashboard data for all expenses in the current month total value by budget
 *
 * GET /expenses/budget =>
 *     { dashboard: { expenses : [{budget, total_amount, budget_amount, "percentage_used"}, ...] } }
 *
 * This route returns the current month data for all expenses by budget.
 */
router.get("/expenses/budget", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = res.locals.user.username;

    const budgetExpenses = await Dashboard.getCurrentMonthExpensesByBudget(
      user
    );

    return res.json({
      dashboard: {
        expenses: budgetExpenses,
      },
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
