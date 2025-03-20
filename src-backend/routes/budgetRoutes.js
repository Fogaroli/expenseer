"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/authMiddleware");
const ExpressError = require("../helpers/expressError");
const Budget = require("../dbModels/BudgetModel");
const newBudgetSchema = require("../schemas/newBudgetSchema.json");
const budgetUpdateSchema = require("../schemas/budgetUpdateSchema.json");


const router = express.Router();

/** Add new Budget Route
 *
 * POST / {data:{ budget }, token: <adminToken> }  => { budget }
 *
 * This route only adds a budget to the logged in user.
 *
 * This returns the newly created budget:
 *  {budget: { name, type, amount, description }
 *
 * Authorization required: logged in user
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body.data, newBudgetSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs, 400);
    }
    const budget = await Budget.create(res.locals.user.username, req.body.data);
    return res.status(201).json({ budget });
  } catch (err) {
    return next(err);
  }
});

/** Get all budged in the database for the logged in user
 *  *
 * GET / {token: <Token> }=> { budgets: [ {name, amount, type}, ... ] }
 *
 * Returns list of all budgets.
 *
 * Authorization required: logged in user
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const budgets = await Budget.getAll(res.locals.user.username);
    return res.json({ budgets });
  } catch (err) {
    return next(err);
  }
});

/** Get details of a single budget provided in params. 
 
 * GET /[budget] {token: <Token> }=> { name, type, amount, description }
 * Authorization required: logged in user
 **/

router.get("/:budget", ensureLoggedIn, async function (req, res, next) {
  try {
    const budget = await Budget.get(res.locals.user.username, req.params.budget);
    return res.json({ budget });
  } catch (err) {
    return next(err);
  }
});

/** Update budget data
 *
 * PATCH /[budget] {data:{ <budget> }, token: <adminToken> } => { name, type, amount, description}
 *
 * Data can include:
 *   {  name, type, amount, description}
 *
 * Authorization required: Logged in user
 **/

router.patch("/:budget", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body.data, budgetUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs, 400);
    }

    const budget = await Budget.update(
      res.locals.user.username,
      req.params.budget,
      req.body.data
    );
    return res.json({ budget });
  } catch (err) {
    return next(err);
  }
});

/** Delete budget form the database
 * DELETE /[budget]  =>  { deleted: <budget name> }
 *
 * Authorization required: Logged in user
 **/

router.delete(
  "/:budget",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      await Budget.delete(res.locals.user.username, req.params.budget);
      return res.json({ deleted: req.params.budget });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
