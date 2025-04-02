"use strict";
const express = require("express");
const app = express();
const ExpressError = require("./helpers/expressError");
const cors = require("cors");
const morgan = require("morgan");
const {authenticateJWT} = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/usersRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const categoriesRoutes = require("./routes/categoryRoutes");
const expenseRoutes = require("./routes/expensesRoutes");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// middleware to authenticate JWT
app.use(authenticateJWT);

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/budgets", budgetRoutes);
app.use("/categories", categoriesRoutes);
app.use("/expenses", expenseRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
