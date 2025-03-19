"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../helpers/expressError");

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
    const authToken = req.body.token
    if (authToken) {
      res.locals.user = jwt.verify(authToken, SECRET_KEY);
    }
    console.assert(res.locals.user, "Token verification failed, no user saved");
    return next();
  } catch (err) {
    console.error(err);
    return next();
  }
}

/** Middleware to verify user is logged in.
 *
 * If not, raises Unauthorized error.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new ExpressError("Unauthorized", 401);
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
      throw new ExpressError("Unauthorized", 401);
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
    if (!res.locals.user) throw new ExpressError("Unauthorized", 401);
    if (
      !res.locals.user.is_admin &&
      res.locals.user.username !== req.params.username
    )
      throw new ExpressError("Unauthorized", 401);
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
  ensureIsAuthorized,
};
