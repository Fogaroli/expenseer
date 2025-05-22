"use strict";

/** Routes for Categories. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/authMiddleware");
const ExpressError = require("../helpers/expressError");
const Category = require("../dbModels/CategoryModel");
const newCategorySchema = require("../schemas/newCategorySchema.json");
const categoryUpdateSchema = require("../schemas/categoryUpdateSchema.json");

const router = express.Router();

/** Add new Category Route
 *
 * POST / {data:{ <category> }}  => { category }
 *
 * This route only adds a category to the logged in user.
 *
 * This returns the newly created category:
 *  {category: { name }
 *
 * Authorization required: logged in user
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body.data, newCategorySchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.message);
      throw new ExpressError(errs, 400);
    }
    const category = await Category.create(
      res.locals.user.username,
      req.body.data
    );
    return res.status(201).json({ category });
  } catch (err) {
    return next(err);
  }
});

/** Get all categories in the database for the logged in user
 *  *
 * GET / {}=> { categories: [ {name}, ... ] }
 *
 * Returns list of all categories.
 *
 * Authorization required: logged in user
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const categories = await Category.getAll(res.locals.user.username);
    return res.json({ categories });
  } catch (err) {
    return next(err);
  }
});

/** Get details of a single category provided in params. 
 
 * GET /[category] {}=> {category:{ name }}
 * Authorization required: logged in user
 **/

router.get("/:category", ensureLoggedIn, async function (req, res, next) {
  try {
    const category = await Category.get(
      res.locals.user.username,
      req.params.category
    );
    return res.json({ category });
  } catch (err) {
    return next(err);
  }
});

/** Update category data
 *
 * PATCH /[category] {data:{ <category> }} => { name }
 *
 * Data can include:
 *   {  name }
 *
 * Authorization required: Logged in user
 **/

router.patch("/:category", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body.data, categoryUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.message);
      throw new ExpressError(errs, 400);
    }

    const category = await Category.update(
      res.locals.user.username,
      req.params.category,
      req.body.data
    );
    return res.json({ category });
  } catch (err) {
    return next(err);
  }
});

/** Delete category form the database
 * DELETE /[category]  =>  { deleted: <category name> }
 *
 * Authorization required: Logged in user
 **/

router.delete("/:category", ensureLoggedIn, async function (req, res, next) {
  try {
    await Category.delete(res.locals.user.username, req.params.category);
    return res.json({ deleted: req.params.category });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
