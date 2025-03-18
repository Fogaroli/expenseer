-- Insert data into users table
INSERT INTO users (username, password, first_name, last_name, email, image_url) VALUES
('john_doe', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZvZ2Fyb2xpMiIsImlhdCI6MTc0MjMyMzgxNH0.1xejUuFb8jNOOiWOLYn7gq-jsefXzqZXFZIcfASCn9s', 'John', 'Doe', 'john@example.com', 'http://example.com/john.jpg'),
('jane_smith', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZvZ2Fyb2xpMiIsImlhdCI6MTc0MjMyMzgxNH0.1xejUuFb8jNOOiWOLYn7gq-jsefXzqZXFZIcfASCn9s', 'Jane', 'Smith', 'jane@example.com', 'http://example.com/jane.jpg');

-- Insert data into budgets table
INSERT INTO budgets (name, type, amount, description, username) VALUES
('Groceries', 1, 500.00, 'Monthly groceries budget', 'john_doe'),
('Entertainment', 1, 200.00, 'Monthly entertainment budget', 'jane_smith'),
('Summer Vacation', 2, 1000.00, 'Summer vacation budget', 'john_doe');

-- Insert data into categories table
INSERT INTO categories (name) VALUES
('Food'),
('Entertainment');

-- Insert data into expenses table
INSERT INTO expenses (name, category, amount, description, date, budget_id) VALUES
('Grocery Store', 1, 100.00, 'Weekly groceries', '2025-03-01', 1),
('Movie Tickets', 2, 50.00, 'Movie night', '2025-03-05', 2);

-- Insert data into exchanges table
INSERT INTO exchanges (currency1, currency2, rate, last_update) VALUES
('USD', 'EUR', 0.85, '2025-03-01 12:00:00'),
('USD', 'GBP', 0.75, '2025-03-01 12:00:00');

-- Insert data into stocks table
INSERT INTO stocks (reference, description, value, last_update) VALUES
('AAPL', 'Apple Inc.', 150.00, '2025-03-01 12:00:00'),
('GOOGL', 'Alphabet Inc.', 2800.00, '2025-03-01 12:00:00');

-- Insert data into user_exchange table
INSERT INTO user_exchange (username, exchange_id) VALUES
('john_doe', 1),
('jane_smith', 2);

-- Insert data into user_stock table
INSERT INTO user_stock (username, stock_ref) VALUES
('john_doe', 'AAPL'),
('jane_smith', 'GOOGL');