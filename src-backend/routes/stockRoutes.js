"use strict";

/** Routes for Stocks. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/authMiddleware");
const ExpressError = require("../helpers/expressError");
const Stock = require("../dbModels/StockModel");
const stockSchema = require("../schemas/stockSchema.json");
const stockSearchSchema = require("../schemas/stockSearchSchema.json");

const router = express.Router();

/** Assign a stock to the logged user
 *
 * POST / {data:{ symbol: <symbol> } }  =>
 *        { stock: {symbol, value, variation, last_updated}}
 *
 * This route returns the updated stock information assigned to the user.
 *
 * Authorization required: logged in user
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body.data, stockSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.message);
      throw new ExpressError(errs, 400);
    }
    const addedStock = await Stock.addToUser(
      res.locals.user.username,
      req.body.data
    );
    return res.status(201).json({ stock: addedStock });
  } catch (err) {
    return next(err);
  }
});

/** Get Stock price
 *
 * If a no data is provided, returns all stock values and daily variation for the logged user.
 * If a stock symbol is provided, returns the value and daily variation for that symbol.
 *
 * GET / {} => { stocks: [ {symbol, value, variation, last_updated}, ... ] }
 * Returns list of all user stocks, current value and daily variation.
 *
 * GET /?symbol=<> => { stock: {symbol, value, variation, last_updated}}
 * Returns current value and daily variation for the given stock.
 *
 * Authorization required: logged in user
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const givenData = req.query;
    console.log(givenData);
    if (Object.keys(givenData).length > 0) {
      console.log("inside validator");
      const validator = jsonschema.validate(req.query, stockSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.message);
        throw new ExpressError(errs, 400);
      }
      const stock = await Stock.get(givenData.symbol);
      return res.json({ stock });
    }
    const stocks = await Stock.getAll(res.locals.user.username);
    return res.json({ stocks });
  } catch (err) {
    return next(err);
  }
});

/** Delete stock from logged user
 * DELETE / {data:{ symbol: <symbol> }}  =>
 *      { deleted: {symbol:<symbol>} }
 *
 * Authorization required: Logged in user
 **/

router.delete("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const givenData = req.body.data;
    if (Object.keys(givenData).length > 0) {
      const validator = jsonschema.validate(req.body.data, stockSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.message);
        throw new ExpressError(errs, 400);
      }
      const deletedData = await Stock.delete(
        res.locals.user.username,
        req.body.data
      );
      return res.json({ deleted: deletedData });
    } else {
      throw new ExpressError("No Stock symbol provided", 400);
    }
  } catch (err) {
    return next(err);
  }
});

/**
 * Search for stock symbol based on string input
 *
 * GET /search?term=<searchTerm> { }  =>
 *      { stocks: [ {symbol, name}, ... ] }
 */
router.get("/search", ensureLoggedIn, async function (req, res, next) {
  try {
    const givenParams = req.query;
    if (givenParams) {
      const validator = jsonschema.validate(req.query, stockSearchSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.message);
        throw new ExpressError(errs, 400);
      }
      const stocks = await Stock.search(givenParams.term);
      return res.json({ stocks });
    } else {
      throw new ExpressError("No Stock symbol provided", 400);
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
