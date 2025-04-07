CREATE TABLE users (
    username VARCHAR(30) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    image_url TEXT,
    last_logged TIMESTAMP NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    username VARCHAR(30)
        REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    username VARCHAR(30)
        REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    category INTEGER
        REFERENCES categories(id) ON DELETE SET NULL,
    budget_id INTEGER
        REFERENCES budgets(id) ON DELETE SET NULL,
    username VARCHAR(30)
        REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE exchanges (
    id SERIAL PRIMARY KEY,
    currency1 TEXT NOT NULL,
    currency2 TEXT NOT NULL,
    rate NUMERIC NOT NULL CHECK (rate >= 0),
    last_update TIMESTAMP NOT NULL
);

CREATE TABLE stocks (
    reference TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    value NUMERIC NOT NULL CHECK (value >= 0),
    last_update TIMESTAMP NOT NULL
);

CREATE TABLE user_exchange(
    username VARCHAR(30)
        REFERENCES users(username) ON DELETE CASCADE,
    exchange_id INTEGER
        REFERENCES exchanges(id) ON DELETE CASCADE,
    PRIMARY KEY (username, exchange_id)
);

CREATE TABLE user_stock(
    username VARCHAR(30)
        REFERENCES users(username) ON DELETE CASCADE,
    stock_ref TEXT
        REFERENCES stocks(reference) ON DELETE CASCADE,
    PRIMARY KEY (username, stock_ref)
);