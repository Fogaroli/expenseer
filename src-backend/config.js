"use strict";
/** Shared config for application; can be req'd many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const PORT = +process.env.PORT;

const BCRYPT_WORK_FACTOR =
  process.env.NODE_ENV === "test" ? 1 : +process.env.BCRYPT_WORK_FACTOR;

const DB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.DB_URI_TEST
    : process.env.DB_URI;

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const STOCK_API_KEY = process.env.STOCK_API_KEY;

module.exports = {
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
  PORT,
  DB_URI,
  API_KEY,
  STOCK_API_KEY,
};
