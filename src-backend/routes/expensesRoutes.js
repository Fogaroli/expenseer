"use strict";

/** Routes for Expenses. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/authMiddleware");
const ExpressError = require("../helpers/expressError");
const Expense = require("../dbModels/ExpenseModel");
const newExpenseSchema = require("../schemas/newExpenseSchema.json");
const expenseUpdateSchema = require("../schemas/expenseUpdateSchema.json");
const expenseSearchSchema = require("../schemas/expenseSearchSchema.json");

const router = express.Router();

/** Add new expense Route
 *
 * POST / {data:{ <expense> }}  => { expense }
 *
 * This route only adds an expense to the logged user.
 *
 * This returns the newly created expense:
 *  {expense: { name, amount, description, date, category, budget_name }
 *
 * Authorization required: logged in user
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body.data, newExpenseSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs, 400);
    }
    const expense = await Expense.create(
      res.locals.user.username,
      req.body.data
    );
    return res.status(201).json({ expense });
  } catch (err) {
    return next(err);
  }
});

/** Get all expenses in the database for the logged in user.
 * Optional filters can be applied to the request.
 *
 * GET /expenses?<param=value> => { expenses: [ {name}, ... ] }
 *
 * Filters can include:
 *  { limit, offset, start_date, end_date, category, budget_name }
 *
 * Data should be in format yyyy-mm-dd.
 *
 * Returns last 20 expenses from all user expenses.
 * Only matching expenses are returned when filters are provided
 *
 * Authorization required: logged in user
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.query, expenseSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs, 400);
    }
    const expenses = await Expense.getAll(
      res.locals.user.username,
      req.query || {}
    );
    return res.json({ expenses });
  } catch (err) {
    return next(err);
  }
});

/** Get details of a single expense provided in params. 
 
 * GET /[expense] {}=> { expense: {id, name, amount, description, date, budget, category} }
 * Authorization required: logged in user
 **/

router.get("/:expenseId", ensureLoggedIn, async function (req, res, next) {
  try {
    const expense = await Expense.get(
      res.locals.user.username,
      req.params.expenseId
    );
    return res.json({ expense });
  } catch (err) {
    return next(err);
  }
});

/** Update expense data
 *
 * PATCH /[expenseId] {data:{ <expense> }} => { expense: {id, name, amount, description, date, budget, category} }
 *
 * Data can include:
 *   {  name, amount, description, date, category, budget_name }
 *
 * Authorization required: Logged in user
 **/

router.patch("/:expenseId", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body.data, expenseUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs, 400);
    }

    const expense = await Expense.update(
      res.locals.user.username,
      req.params.expenseId,
      req.body.data
    );
    return res.json({ expense });
  } catch (err) {
    return next(err);
  }
});

/** Delete expense from the database
 * DELETE /[expense]  =>  { deleted: <expense name> }
 *
 * Authorization required: Logged in user
 **/

router.delete("/:expenseId", ensureLoggedIn, async function (req, res, next) {
  try {
    await Expense.delete(res.locals.user.username, req.params.expenseId);
    return res.json({ deleted: req.params.expenseId });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
