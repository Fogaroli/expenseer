"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const express = require("express");
const {
  ensureIsAdmin,
  ensureIsAuthorized,
} = require("../middleware/authMiddleware");
const ExpressError = require("../helpers/expressError");
const User = require("../dbModels/UserModel");
const { createToken } = require("../helpers/tokens");
const newUserSchema = require("../schemas/newUserSchema.json");
const userUpdateSchema = require("../schemas/userUpdateSchema.json");

const router = express.Router();

/** Add new User Route
 *
 * POST / {data:{ <user> } }  => { user, token }
 *
 * """This is not the registration endpoint"""
 *
 * This route is only for admin users to add new users.
 *
 * This returns the newly created user and an authentication token:
 *  {user: { username, firstName, lastName, email, image_url, is_admin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureIsAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body.data, newUserSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs, 400);
    }

    const user = await User.register(req.body.data);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/** Get all users in the database
 *  *
 * GET / {}=> { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureIsAdmin, async function (req, res, next) {
  try {
    const users = await User.getAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** Get details of a single user provided in params. 
 
 * GET /[username] {}=> { username, first_name, last_name, email, image_url, last_logged}
 * If the user is admin, add is_admin: true to the return object.
 * Authorization required: admin or own user
 **/

router.get("/:username", ensureIsAuthorized, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** Update user data
 *
 * PATCH /[username] {data:{ <user> } } => { username, firstName, lastName, email, image_url, last_logged}
 *
 * Data can include:
 *   { first_name, last_name, password, email, image_url}
 *
 *
 * Authorization required: admin or own user
 **/

router.patch("/:username", ensureIsAuthorized, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body.data, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs, 400);
    }

    const user = await User.update(req.params.username, req.body.data);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** Set User as Admin
 *
 * PATCH /[username] {data:{ is_admin:true } } => { username, firstName, lastName, email, image_url, last_logged, is_admin}
 *
 *This route is only for is_admin parameter
 *
 * Authorization required: admin
 **/

router.patch(
  "/:username/setAdmin",
  ensureIsAdmin,
  async function (req, res, next) {
    try {
      if (!Object.keys(req.body.data).includes("is_admin")) {
        throw new ExpressError("Missing is_admin parameter", 400);
      }

      const user = await User.update(req.params.username, req.body.data);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** Delete a user form the database
 * DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or own user
 **/

router.delete(
  "/:username",
  ensureIsAuthorized,
  async function (req, res, next) {
    try {
      await User.delete(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
