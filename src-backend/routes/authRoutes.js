"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");
const User = require("../dbModels/UserModel");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuthenticationSchema.json");
const userRegisterSchema = require("../schemas/userRegistrationSchema.json");
const ExpressError = require("../helpers/expressError");

/** POST /auth/login:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 * * Authorization required: none
 */

router.post("/login", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs, 400);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.status(200).json({ token, last_logged: user.last_logged });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, first_name, last_name, email }
 * optionally the filed {image_url} can be included.
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    console.assert(
      Object.keys(req.body).includes(
        "username",
        "password",
        "first_name",
        "last_name",
        "email"
      ),
      "Missing required fields"
    );
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new ExpressError(errs, 400);
    }

    const newUser = await User.register(req.body);
    const token = createToken(newUser);
    return res.status(201).json({ token, last_logged: newUser.last_logged });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
