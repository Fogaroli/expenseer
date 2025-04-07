"use strict";
/** Shared config for application; can be req'd many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "development-secret-key";

const PORT = +process.env.PORT || 3000;

const BCRYPT_WORK_FACTOR = +process.env.BCRYPT_WORK_FACTOR || 10;

const DB_URI =
  process.env.NODE_ENV === "test"
    ? "postgresql:///expenseer_test"
    : process.env.DB_URI || "postgresql:///expenseer";

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

module.exports = {
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
  PORT,
  DB_URI,
  API_KEY,
};
