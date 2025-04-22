"use strict";

/** Routes for Exchanges. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/authMiddleware");
const ExpressError = require("../helpers/expressError");
const Exchange = require("../dbModels/ExchangeModel");
const exchangeSchema = require("../schemas/exchangeSchema.json");

const router = express.Router();

/** Assign a currency pair to the logged user
 *
 * POST / {data:{ <currency1>, <currency2> }}  =>
 *        { exchange_rate: {currency1, currency2, rate, last_updated} }
 *
 * This route returns the updated data of the exchange rate assigned to the user.
 *
 * Authorization required: logged in user
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body.data, exchangeSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs, 400);
    }
    const addedRate = await Exchange.addToUser(
      res.locals.user.username,
      req.body.data
    );
    return res.status(201).json({ exchange_rate: addedRate });
  } catch (err) {
    return next(err);
  }
});

/** Get exchange rates
 *
 * If a no data ir provided, returns all exchange rates for the logged in user.
 * If a currency pair is provided, returns the exchange rate for that pair.
 *
 * GET / {} => { exchange_rates: [ {currency1, currency2, rate, last_updated}, ... ] }
 * Returns list of all exchanges and latest rates.
 *
 * GET / { data : {currency1:<>, currency2:<>} }=> { exchange_rate: {currency1, currency2, rate, last_updated} }
 * Returns exchange rate for a given pair of currencies.
 *
 * Authorization required: logged in user
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const givenData = req.body.data;
    if (givenData) {
      const validator = jsonschema.validate(req.body.data, exchangeSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new ExpressError(errs, 400);
      }
      const exchange_rate = await Exchange.get({
        currency1: givenData.currency1,
        currency2: givenData.currency2,
      });
      return res.json({ exchange_rate });
    }
    const exchangeRates = await Exchange.getAll(res.locals.user.username);
    return res.json({ exchange_rates: exchangeRates });
  } catch (err) {
    return next(err);
  }
});

/** Delete currency pair from logged user
 * DELETE / {data:{ <currency1>, <currency2> }}  =>
 *      { deleted: {currency1:<currency1>,currency2:<currency2>} }
 *
 * Authorization required: Logged in user
 **/

router.delete("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const givenData = req.body.data;
    if (givenData) {
      const validator = jsonschema.validate(req.body.data, exchangeSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new ExpressError(errs, 400);
      }
      const deletedData = await Exchange.delete(
        res.locals.user.username,
        req.body.data
      );
      return res.json({ deleted: deletedData });
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
