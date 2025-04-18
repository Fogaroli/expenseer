-- Insert data into users table
INSERT INTO users (username, password, first_name, last_name, email, image_url, last_logged, is_admin) VALUES
('fogaroli', '$2b$12$RmJhXxgx/m690jVv3kG9.uIOaj9VnLA4wzuleaECefslUFI0tP9vG', 'Fogaroli', 'Ribeiro', 'eu@eu.com', 'http://example.com/user1.jpg', '2025-01-01 12:00:00', FALSE),
('admin', '$2b$12$IM5tCEup4jAt4CKpkyVb/e9Q.ttKlKLvWcmzzayI3PyMqaMQlmbFC', 'Admin', 'Superuser', 'admin@example.com', 'http://example.com/user2.jpg', '2025-01-01 12:00:00', TRUE);

-- Insert data into budgets table
INSERT INTO budgets (name, type, amount, description, username) VALUES
('Groceries', 1, 500.00, 'Monthly groceries budget', 'fogaroli'),
('Entertainment', 1, 200.00, 'Monthly entertainment budget', 'admin'),
('Summer Vacation', 2, 1000.00, null, 'fogaroli');

-- Insert data into categories table
INSERT INTO categories (name, username) VALUES
('Food', 'fogaroli'),
('Entertainment', 'fogaroli'),
('Food-admin', 'admin'),
('Entertainment-admin', 'admin');

-- Insert data into expenses table
INSERT INTO expenses (name, category, amount, description, date, budget_id, username) VALUES
('Grocery Store', 1, 100.00, 'Weekly groceries', '2025-03-01', 1,'fogaroli'),
('Movie Tickets', 2, 50.00, 'Movie night', '2025-03-05', 2, 'fogaroli'),
('Picnic', 1, 100.00, 'picnic', '2025-03-01', 1, 'admin'),
('Travel', 2, 50.00, 'travel', '2025-03-05', 2, 'admin');

-- Insert data into exchanges table
INSERT INTO exchanges (currency1, currency2, rate, last_update) VALUES
('USD', 'EUR', 0.85, '2025-03-01 12:00:00'),
('USD', 'GBP', 0.75, '2025-03-01 12:00:00');

-- Insert data into stocks table
INSERT INTO stocks (symbol, value, variation, last_update) VALUES
('AAPL', 150.00, -3.52 ,'2025-03-01 12:00:00'),
('GOOGL', 2800.00, 5.03, '2025-03-01 12:00:00');

-- Insert data into user_exchange table
INSERT INTO user_exchange (username, exchange_id) VALUES
('fogaroli', 1),
('admin', 2);

-- Insert data into user_stock table
INSERT INTO user_stock (username, stock_ref) VALUES
('fogaroli', 'AAPL'),
('admin', 'GOOGL');