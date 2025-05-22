"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../helpers/expressError");
const rateLimit = require("express-rate-limit");

/** Middleware: Authenticate user.
 *
 * This function should be executed for every request.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and is_admin field.)
 *
 * If no token is provided no data is added to the res.locals.
 */

function authenticateJWT(req, res, next) {
  try {
    const authToken = req.headers.authorization;
    if (authToken) {
      res.locals.user = jwt.verify(authToken, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to verify user is logged in.
 *
 * If not, raises Unauthorized error.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new ExpressError("Forbidden", 403);
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Middleware to verify the user is admin.
 *
 * If not, raises Unauthorized.
 */
function ensureIsAdmin(req, res, next) {
  try {
    if (!res.locals.user || !res.locals.user.is_admin)
      throw new ExpressError("Forbidden", 403);
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Middleware to verify either the user is admin, or accessing route for its own profile.
 *
 * If not, raises Unauthorized.
 */
function ensureIsAuthorized(req, res, next) {
  try {
    if (!res.locals.user) throw new ExpressError("Forbidden", 403);
    if (
      !res.locals.user.is_admin &&
      res.locals.user.username !== req.params.username
    )
      throw new ExpressError("Forbidden", 403);
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Middleware to limit access of requests coming from the same IP.
 *
 * IF more than 5 requests are sent within a timeinterval of 10 minutes, the request will
 * be blocked until the next window is available.
 *
 * Under test the limit is extended to 1000 requests.
 *
 */
const max = process.env.NODE_ENV === "test" ? 1000 : 5;

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max,
  message: new ExpressError(
    "Too many login attempts from this IP, please try again after 10 minutes",
    429
  ),
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
  ensureIsAuthorized,
  loginLimiter,
};
