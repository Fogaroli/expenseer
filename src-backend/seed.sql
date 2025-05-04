-- Insert data into users table
INSERT INTO users (username, password, first_name, last_name, email, image_url, last_logged, is_admin) VALUES
('fogaroli', '$2b$12$RmJhXxgx/m690jVv3kG9.uIOaj9VnLA4wzuleaECefslUFI0tP9vG', 'Fogaroli', 'Ribeiro', 'eu@eu.com', 'http://example.com/user1.jpg', '2025-01-01 12:00:00', FALSE),
('admin', '$2b$12$IM5tCEup4jAt4CKpkyVb/e9Q.ttKlKLvWcmzzayI3PyMqaMQlmbFC', 'Admin', 'Superuser', 'admin@example.com', 'http://example.com/user2.jpg', '2025-01-01 12:00:00', TRUE);

-- Insert data into budgets table
INSERT INTO budgets (name, type, amount, description, username) VALUES
('Groceries', 1, 500.00, 'Monthly groceries budget', 'fogaroli'),
('Entertainment', 1, 200.00, 'Monthly entertainment budget', 'fogaroli'),
('Summer Vacation', 2, 1000.00, null, 'fogaroli');

-- Insert data into categories table
INSERT INTO categories (name, username) VALUES
('Food', 'fogaroli'),
('Entertainment', 'fogaroli'),
('Food-admin', 'admin'),
('Entertainment-admin', 'admin');

-- Insert data into expenses table
INSERT INTO expenses (name, category_id, amount, description, date, budget_id, username) VALUES
('Grocery Store', 1, 100.00, 'Weekly groceries', '2025-03-01', 1,'fogaroli'),
('Movie Tickets', 2, 50.00, 'Movie night', '2025-03-05', 2, 'fogaroli'),
('Picnic', 1, 100.00, 'picnic', '2025-03-01', 1, 'admin'),
('Travel', 2, 50.00, 'travel', '2025-03-05', 2, 'admin'),
('Coffee Shop', 1, 5.00, 'Morning coffee', '2025-03-02', 1, 'fogaroli'),
('Lunch', 1, 15.00, 'Lunch with colleagues', '2025-03-02', 1, 'fogaroli'),
('Concert Tickets', 2, 120.00, 'Live concert', '2025-03-03', 2, 'fogaroli'),
('Books', 1, 30.00, 'Books for study', '2025-03-04', 1, 'fogaroli'),
('Gym Membership', 2, 50.00, 'Monthly gym fee', '2025-03-05', 2, 'fogaroli'),
('Dinner', 1, 40.00, 'Dinner with family', '2025-03-06', 1, 'fogaroli'),
('Streaming Service', 2, 15.00, 'Monthly subscription', '2025-03-07', 2, 'fogaroli'),
('Taxi', 1, 20.00, 'Ride to airport', '2025-03-08', 1, 'fogaroli'),
('Gift', 2, 60.00, 'Birthday gift', '2025-03-09', 2, 'fogaroli'),
('Groceries', 1, 120.00, 'Weekly groceries', '2025-03-10', 1, 'fogaroli'),
('Coffee Shop', 1, 6.00, 'Afternoon coffee', '2025-03-11', 1, 'fogaroli'),
('Lunch', 1, 18.00, 'Lunch with friends', '2025-03-12', 1, 'fogaroli'),
('Movie Tickets', 2, 25.00, 'Cinema night', '2025-03-13', 2, 'fogaroli'),
('Snacks', 1, 10.00, 'Snacks for trip', '2025-03-14', 1, 'fogaroli'),
('Car Wash', 2, 20.00, 'Car cleaning', '2025-03-15', 2, 'fogaroli'),
('Dinner', 1, 50.00, 'Dinner with friends', '2025-03-16', 1, 'fogaroli'),
('Streaming Service', 2, 15.00, 'Monthly subscription', '2025-03-17', 2, 'fogaroli'),
('Taxi', 1, 25.00, 'Ride to meeting', '2025-03-18', 1, 'fogaroli'),
('Gift', 2, 70.00, 'Anniversary gift', '2025-03-19', 2, 'fogaroli'),
('Groceries', 1, 130.00, 'Weekly groceries', '2025-03-20', 1, 'fogaroli'),
('Coffee Shop', 1, 7.00, 'Morning coffee', '2025-03-21', 1, 'fogaroli'),
('Lunch', 1, 20.00, 'Lunch with team', '2025-03-22', 1, 'fogaroli'),
('Concert Tickets', 2, 150.00, 'Music festival', '2025-03-23', 2, 'fogaroli'),
('Books', 1, 35.00, 'Books for leisure', '2025-03-24', 1, 'fogaroli'),
('Gym Membership', 2, 50.00, 'Monthly gym fee', '2025-03-25', 2, 'fogaroli'),
('Dinner', 1, 60.00, 'Dinner with colleagues', '2025-03-26', 1, 'fogaroli'),
('Streaming Service', 2, 15.00, 'Monthly subscription', '2025-03-27', 2, 'fogaroli'),
('Taxi', 1, 30.00, 'Ride to event', '2025-03-28', 1, 'fogaroli'),
('Gift', 2, 80.00, 'Wedding gift', '2025-03-29', 2, 'fogaroli'),
('Groceries', 1, 140.00, 'Weekly groceries', '2025-03-30', 1, 'fogaroli'),
('Coffee Shop', 1, 8.00, 'Afternoon coffee', '2025-03-31', 1, 'fogaroli'),
('Lunch', 1, 22.00, 'Lunch with family', '2025-04-01', 1, 'fogaroli'),
('Movie Tickets', 2, 30.00, 'Cinema night', '2025-04-02', 2, 'fogaroli'),
('Snacks', 1, 12.00, 'Snacks for work', '2025-04-03', 1, 'fogaroli'),
('Car Wash', 2, 25.00, 'Car cleaning', '2025-04-04', 2, 'fogaroli'),
('Dinner', 1, 70.00, 'Dinner with friends', '2025-04-05', 1, 'fogaroli'),
('Streaming Service', 2, 15.00, 'Monthly subscription', '2025-04-06', 2, 'fogaroli'),
('Taxi', 1, 35.00, 'Ride to airport', '2025-04-07', 1, 'fogaroli'),
('Gift', 2, 90.00, 'Birthday gift', '2025-04-08', 2, 'fogaroli'),
('Groceries', 1, 150.00, 'Weekly groceries', '2025-04-09', 1, 'fogaroli'),
('Coffee Shop', 1, 9.00, 'Morning coffee', '2025-04-10', 1, 'fogaroli'),
('Lunch', 1, 25.00, 'Lunch with colleagues', '2025-04-11', 1, 'fogaroli'),
('Concert Tickets', 2, 200.00, 'Live concert', '2025-04-12', 2, 'fogaroli'),
('Books', 1, 40.00, 'Books for study', '2025-04-13', 1, 'fogaroli'),
('Gym Membership', 2, 50.00, 'Monthly gym fee', '2025-04-14', 2, 'fogaroli'),
('Dinner', 1, 80.00, 'Dinner with family', '2025-04-15', 1, 'fogaroli');

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