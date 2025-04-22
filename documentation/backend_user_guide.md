# Backend API User Guide

This document provides a comprehensive guide to the backend API of the Expenseer application. It details each route, its functionality, required inputs, and expected outputs.
Routes that require JWT authetication, the token should be added to the request header under "authorization", no prefix to the token itself.

## Authentication Routes (`/auth`)

### 1. POST /auth/login

- **Description:** Authenticates a user and returns a JWT token.
- **Input:**

  ```json
  {
    "username": "username",
    "password": "password"
  }
  ```

- **Output:**

  ```json
  {
    "token": "JWT_TOKEN",
    "last_logged": "Date"
  }
  ```

- **Authentication:** None

### 2. POST /auth/register

- **Description:** Registers a new user and returns a JWT token.
- **Input:**

  ```json
  {
    "username": "new_username",
    "password": "new_password",
    "first_name": "FirstName",
    "last_name": "LastName",
    "email": "email@example.com",
    "image_url": "optional_url"
  }
  ```

- **Output:**

  ```json
  {
    "token": "JWT_TOKEN",
    "last_logged": "Date"
  }
  ```

- **Authentication:** None

## User Routes (`/users`)

### 1. POST /users

- **Description:** Adds a new user (Admin only). This is not the registration endpoint.
- **Input:**

  ```json
  {
    "data": {
      "username": "new_username",
      "password": "new_password",
      "first_name": "FirstName",
      "last_name": "LastName",
      "email": "email@example.com",
      "image_url": "optional_url",
      "is_admin": true
    }
  }
  ```

- **Output:**

  ```json
  {
    "user": {
      "username": "new_username",
      "firstName": "FirstName",
      "lastName": "LastName",
      "email": "email@example.com",
      "image_url": "optional_url",
      "is_admin": true
    },
    "token": "JWT_TOKEN"
  }
  ```

- **Authentication:** JWT Token required, Admin only

### 2. GET /users

- **Description:** Retrieves all users (Admin only).
- **Input:**
  ```json
  {}
  ```
- **Output:**

  ```json
  {
    "users": [
      {
        "username": "username1",
        "firstName": "FirstName1",
        "lastName": "LastName1",
        "email": "email1@example.com"
      },
      {
        "username": "username2",
        "firstName": "FirstName2",
        "lastName": "LastName2",
        "email": "email2@example.com"
      }
    ]
  }
  ```

- **Authentication:** JWT Token required, Admin only

### 3. GET /users/:username

- **Description:** Retrieves a specific user by username.
- **Input:** Username in the URL (`/users/:username`)

  ```json
  {}
  ```

- **Output:**

  ```json
  {
    "user": {
      "username": "username",
      "first_name": "FirstName",
      "last_name": "LastName",
      "email": "email@example.com",
      "image_url": "optional_url",
      "last_logged": "Date",
      "is_admin": true
    }
  }
  ```

- **Authentication:** JWT Token required, Admin or the user themselves

### 4. PATCH /users/:username

- **Description:** Updates a user's information.
- **Input:**

  ```json
  {
    "data": {
      "first_name": "NewFirstName",
      "last_name": "NewLastName",
      "password": "NewPassword",
      "email": "newemail@example.com",
      "image_url": "new_url"
    }
  }
  ```

- **Output:**

  ```json
  {
    "user": {
      "username": "username",
      "firstName": "NewFirstName",
      "lastName": "NewLastName",
      "email": "newemail@example.com",
      "image_url": "new_url",
      "last_logged": "Date"
    }
  }
  ```

- **Authentication:** JWT Token required, Admin or the user themselves

### 5. PATCH /users/:username/setAdmin

- **Description:** Sets a user as an admin (Admin only).
- **Input:**

  ```json
  {
    "data": {
      "is_admin": true
    }
  }
  ```

- **Output:**

  ```json
  {
    "user": {
      "username": "username",
      "firstName": "FirstName",
      "lastName": "LastName",
      "email": "email@example.com",
      "image_url": "optional_url",
      "last_logged": "Date",
      "is_admin": true
    }
  }
  ```

- **Authentication:** JWT Token required, Admin only

### 6. DELETE /users/:username

- **Description:** Deletes a user.
- **Input:** Username in the URL (`/users/:username`)

  ```json
  {}
  ```

- **Output:**

  ```json
  {
    "deleted": "username"
  }
  ```

- **Authentication:** JWT Token required, Admin or the user themselves

## Budget Routes (`/budgets`)

### 1. POST /budgets

- **Description:** Adds a new budget for the logged-in user.
- **Input:**

  ```json
  {
    "data": {
      "name": "Budget Name",
      "type": "Type",
      "amount": 1000,
      "description": "Description"
    }
  }
  ```

- **Output:**

  ```json
  {
    "budget": {
      "name": "Budget Name",
      "type": "Type",
      "amount": 1000,
      "description": "Description"
    }
  }
  ```

- **Authentication:** JWT Token required

### 2. GET /budgets

- **Description:** Retrieves all budgets for the logged-in user.
- **Input:**

  ```json
  {}
  ```

- **Output:**

  ```json
  {
    "budgets": [
      {
        "name": "Budget Name 1",
        "type": "Type 1",
        "amount": 1000
      },
      {
        "name": "Budget Name 2",
        "type": "Type 2",
        "amount": 2000
      }
    ]
  }
  ```

- **Authentication:** JWT Token required

### 3. GET /budgets/:budget

- **Description:** Retrieves a specific budget by name for the logged-in user.
- **Input:** Budget name in the URL (`/budgets/:budget`)

  ```json
  {}
  ```

- **Output:**

  ```json
  {
    "budget": {
      "name": "Budget Name",
      "type": "Type",
      "amount": 1000,
      "description": "Description"
    }
  }
  ```

- **Authentication:** JWT Token required

### 4. PATCH /budgets/:budget

- **Description:** Updates a budget's information for the logged-in user.
- **Input:**

  ```json
  {
    "data": {
      "name": "New Budget Name",
      "type": "New Type",
      "amount": 1500,
      "description": "New Description"
    }
  }
  ```

- **Output:**

  ```json
  {
    "budget": {
      "name": "New Budget Name",
      "type": "New Type",
      "amount": 1500,
      "description": "New Description"
    }
  }
  ```

- **Authentication:** JWT Token required

### 5. DELETE /budgets/:budget

- **Description:** Deletes a budget for the logged-in user.
- **Input:** Budget name in the URL (`/budgets/:budget`)

  ```json
  {}
  ```

- **Output:**

  ```json
  {
    "deleted": "Budget Name"
  }
  ```

- **Authentication:** JWT Token required

## Category Routes (`/categories`)

### 1. POST /categories

- **Description:** Adds a new category for the logged-in user.
- **Input:**

  ```json
  {
    "data": {
      "name": "Category Name"
    }
  }
  ```

- **Output:**

  ```json
  {
    "category": {
      "name": "Category Name"
    }
  }
  ```

- **Authentication:** JWT Token required

### 2. GET /categories

- **Description:** Retrieves all categories for the logged-in user.
- **Input:**

  ```json
  {}
  ```

- **Output:**

  ```json
  {
    "categories": [
      {
        "name": "Category Name 1"
      },
      {
        "name": "Category Name 2"
      }
    ]
  }
  ```

- **Authentication:** JWT Token required

### 3. GET /categories/:category

- **Description:** Retrieves a specific category by name for the logged-in user.
- **Input:** Category name in the URL (`/categories/:category`)

  ```json
  {}
  ```

- **Output:**

  ```json
  {
    "category": {
      "name": "Category Name"
    }
  }
  ```

- **Authentication:** JWT Token required

### 4. PATCH /categories/:category

- **Description:** Updates a category's information for the logged-in user.
- **Input:**

  ```json
  {
    "data": {
      "name": "New Category Name"
    }
  }
  ```

- **Output:**

  ```json
  {
    "category": {
      "name": "New Category Name"
    }
  }
  ```

- **Authentication:** JWT Token required

### 5. DELETE /categories/:category

- **Description:** Deletes a category for the logged-in user.
- **Input:** Category name in the URL (`/categories/:category`)

  ```json
  {}
  ```

- **Output:**

  ```json
  {
    "deleted": "Category Name"
  }
  ```

- **Authentication:** JWT Token required

## Expense Routes (`/expenses`)

### 1. POST /expenses

- **Description:** Adds a new expense for the logged-in user.
- **Input:**

  ```json
  {
    "data": {
      "name": "Expense Name",
      "amount": 50,
      "description": "Expense Description",
      "date": "2024-01-01",
      "category": "Category Name",
      "budget_name": "Budget Name"
    }
  }
  ```

- **Output:**

  ```json
  {
    "expense": {
      "name": "Expense Name",
      "amount": 50,
      "description": "Expense Description",
      "date": "2024-01-01",
      "category": "Category Name",
      "budget_name": "Budget Name"
    }
  }
  ```

- **Authentication:** JWT Token required

### 2. GET /expenses

- **Description:** Retrieves all expenses for the logged-in user, with optional filters.
- **Input:**

  ```json
  {
    "filters": {
      "limit": 20,
      "offset": 0,
      "start_date": "2023-01-01",
      "end_date": "2024-01-01",
      "category": "Category Name",
      "budget_name": "Budget Name"
    }
  }
  ```

- **Output:**

  ```json
  {
    "expenses": [
      {
        "name": "Expense Name 1"
      },
      {
        "name": "Expense Name 2"
      }
    ]
  }
  ```

- **Authentication:** JWT Token required

### 3. GET /expenses/:expenseId

- **Description:** Retrieves a specific expense by ID for the logged-in user.
- **Input:** Expense ID in the URL (`/expenses/:expenseId`)

  ```json
  {}
  ```

- **Output:**

  ```json
  {
    "expense": {
      "id": 1,
      "name": "Expense Name",
      "amount": 50,
      "description": "Expense Description",
      "date": "2024-01-01",
      "budget": "Budget Name",
      "category": "Category Name"
    }
  }
  ```

- **Authentication:** JWT Token required

### 4. PATCH /expenses/:expenseId

- **Description:** Updates an expense's information for the logged-in user.
- **Input:**

  ```json
  {
    "data": {
      "name": "New Expense Name",
      "amount": 75,
      "description": "New Expense Description",
      "date": "2024-02-01",
      "category": "New Category Name",
      "budget_name": "New Budget Name"
    }
  }
  ```

- **Output:**

  ```json
  {
    "expense": {
      "id": 1,
      "name": "New Expense Name",
      "amount": 75,
      "description": "New Expense Description",
      "date": "2024-02-01",
      "budget": "New Budget Name",
      "category": "New Category Name"
    }
  }
  ```

- **Authentication:** JWT Token required

### 5. DELETE /expenses/:expenseId

- **Description:** Deletes an expense for the logged-in user.
- **Input:** Expense ID in the URL (`/expenses/:expenseId`)

  ```json
  {}
  ```

- **Output:**

  ```json
  {
    "deleted": "expenseId"
  }
  ```

- **Authentication:** JWT Token required (via [`ensureLoggedIn`](src-backend/middleware/authMiddleware.js))

## Exchange Routes (`/exchanges`)

### 1. POST /exchanges

- **Description:** Assigns a currency pair to the logged-in user.
- **Input:**

  ```json
  {
    "data": {
      "currency1": "USD",
      "currency2": "EUR"
    }
  }
  ```

- **Output:**

  ```json
  {
    "exchange_rate": {
      "currency1": "USD",
      "currency2": "EUR",
      "rate": 0.85,
      "last_updated": "Date"
    }
  }
  ```

- **Authentication:** JWT Token required

### 2. GET /exchanges

- **Description:** Retrieves exchange rates. If no data is provided, returns all exchange rates for the logged-in user. If a currency pair is provided, returns the exchange rate for that pair.
- **Input (All exchange rates):**

  ```json
  {}
  ```

- **Input (Specific pair):**

  ```json
  {
    "data": {
      "currency1": "USD",
      "currency2": "EUR"
    }
  }
  ```

- **Output (All exchange rates):**

  ```json
  {
    "exchange_rates": [
      {
        "currency1": "USD",
        "currency2": "EUR",
        "rate": 0.85,
        "last_updated": "Date"
      },
      {
        "currency1": "EUR",
        "currency2": "GBP",
        "rate": 0.72,
        "last_updated": "Date"
      }
    ]
  }
  ```

- **Output (Specific pair):**

  ```json
  {
    "exchange_rate": {
      "currency1": "USD",
      "currency2": "EUR",
      "rate": 0.85,
      "last_updated": "Date"
    }
  }
  ```

- **Authentication:** JWT Token required

### 3. DELETE /exchanges

- **Description:** Deletes a currency pair from the logged-in user.
- **Input:**

  ```json
  {
    "data": {
      "currency1": "USD",
      "currency2": "EUR"
    }
  }
  ```

- **Output:**

  ```json
  {
    "deleted": {
      "currency1": "USD",
      "currency2": "EUR"
    }
  }
  ```

- **Authentication:** JWT Token required

## Stock Routes (`/stocks`)

### 1. POST /stocks

- **Description:** Assigns a stock to the logged-in user.
- **Input:**

  ```json
  {
    "data": {
      "symbol": "AAPL"
    }
  }
  ```

- **Output:**

  ```json
  {
    "stock": {
      "symbol": "AAPL",
      "value": 150.25,
      "variation": 0.01,
      "last_updated": "Date"
    }
  }
  ```

- **Authentication:** JWT Token required

### 2. GET /stocks

- **Description:** Retrieves stock prices. If no data is provided, returns all stock values and daily variation for the logged-in user. If a stock symbol is provided, returns the value and daily variation for that symbol.
- **Input (All stocks):**

  ```json
  {}
  ```

- **Input (Specific stock):**

  ```json
  {
    "data": {
      "symbol": "AAPL"
    }
  }
  ```

- **Output (All stocks):**

  ```json
  {
    "stocks": [
      {
        "symbol": "AAPL",
        "value": 150.25,
        "variation": 0.01,
        "last_updated": "Date"
      },
      {
        "symbol": "GOOG",
        "value": 2700.5,
        "variation": -0.005,
        "last_updated": "Date"
      }
    ]
  }
  ```

- **Output (Specific stock):**

  ```json
  {
    "stock": {
      "symbol": "AAPL",
      "value": 150.25,
      "variation": 0.01,
      "last_updated": "Date"
    }
  }
  ```

- **Authentication:** JWT Token required

### 3. DELETE /stocks

- **Description:** Deletes a stock from the logged-in user.
- **Input:**

  ```json
  {
    "data": {
      "symbol": "AAPL"
    }
  }
  ```

- **Output:**

  ```json
  {
    "deleted": {
      "symbol": "AAPL"
    }
  }
  ```

- **Authentication:** JWT Token required

### 4. GET /stocks/search?term=\<searchTerm>

- **Description:** Searches for a stock symbol based on a string input.
- **Input:** Search term as a query parameter (`/stocks/search?term=appl`)

  ```json
  {}
  ```

- **Output:**

  ```json
  {
    "stocks": [
      {
        "symbol": "AAPL",
        "name": "Apple Inc."
      },
      {
        "symbol": "APPL",
        "name": "Applied Materials Inc."
      }
    ]
  }
  ```

- **Authentication:** JWT Token required
