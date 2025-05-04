-- Insert data into users table
INSERT INTO users (username, password, first_name, last_name, email, image_url, last_logged, is_admin) VALUES
('fogaroli', '$2b$12$RmJhXxgx/m690jVv3kG9.uIOaj9VnLA4wzuleaECefslUFI0tP9vG', 'Fogaroli', 'Ribeiro', 'eu@eu.com', 'http://example.com/user1.jpg', '2025-01-01 12:00:00', FALSE),
('admin', '$2b$12$IM5tCEup4jAt4CKpkyVb/e9Q.ttKlKLvWcmzzayI3PyMqaMQlmbFC', 'Admin', 'Superuser', 'admin@example.com', 'http://example.com/user2.jpg', '2025-01-01 12:00:00', TRUE);

-- Insert data into budgets table
INSERT INTO budgets (name, type, amount, description, username) VALUES
('Groceries', 1, 600.00, 'Monthly groceries budget', 'fogaroli'),
('Entertainment', 1, 300.00, 'Monthly entertainment budget', 'fogaroli'),
('Transport', 1, 250.00, 'Monthly transport budget', 'fogaroli');

-- Insert data into categories table
INSERT INTO categories (name, username) VALUES
('Food', 'fogaroli'),
('Leisure', 'fogaroli'),
('Commute', 'fogaroli');

-- Insert data into expenses table
INSERT INTO expenses (name, category_id, amount, description, date, budget_id, username) VALUES
-- September 2024
('Groceries Sep', 1, 50.00, 'Groceries for September', '2024-09-02', 1, 'fogaroli'),
('Cinema Sep', 2, 30.00, 'Movie night', '2024-09-03', 2, 'fogaroli'),
('Bus Pass Sep', 3, 40.00, 'Monthly bus pass', '2024-09-04', 3, 'fogaroli'),
('Lunch Out Sep', 2, 25.00, 'Lunch with friends', '2024-09-06', 2, 'fogaroli'),
('Taxi Sep', 3, 15.00, 'Taxi ride', '2024-09-08', 3, 'fogaroli'),
('Supermarket Sep', 1, 60.00, 'Weekly groceries', '2024-09-10', 1, 'fogaroli'),
('Concert Sep', 2, 45.00, 'Live concert', '2024-09-12', 2, 'fogaroli'),
('Train Sep', 3, 20.00, 'Train ticket', '2024-09-14', 3, 'fogaroli'),
('Groceries Sep', 1, 55.00, 'Groceries for week', '2024-09-16', 1, 'fogaroli'),
('Coffee Sep', 2, 10.00, 'Coffee with friend', '2024-09-18', 2, 'fogaroli'),
('Bus Sep', 3, 10.00, 'Bus fare', '2024-09-20', 3, 'fogaroli'),
('Groceries Sep', 1, 65.00, 'Groceries for week', '2024-09-22', 1, 'fogaroli'),
('Streaming Sep', 2, 12.00, 'Streaming subscription', '2024-09-23', 2, 'fogaroli'),
('Taxi Sep', 3, 18.00, 'Taxi ride', '2024-09-25', 3, 'fogaroli'),
('Groceries Sep', 1, 70.00, 'Groceries for week', '2024-09-27', 1, 'fogaroli'),
('Dinner Sep', 2, 35.00, 'Dinner out', '2024-09-28', 2, 'fogaroli'),
('Bus Sep', 3, 10.00, 'Bus fare', '2024-09-29', 3, 'fogaroli'),

-- October 2024
('Groceries Oct', 1, 52.00, 'Groceries for October', '2024-10-02', 1, 'fogaroli'),
('Cinema Oct', 2, 32.00, 'Movie night', '2024-10-03', 2, 'fogaroli'),
('Bus Pass Oct', 3, 42.00, 'Monthly bus pass', '2024-10-04', 3, 'fogaroli'),
('Lunch Out Oct', 2, 27.00, 'Lunch with friends', '2024-10-06', 2, 'fogaroli'),
('Taxi Oct', 3, 17.00, 'Taxi ride', '2024-10-08', 3, 'fogaroli'),
('Supermarket Oct', 1, 62.00, 'Weekly groceries', '2024-10-10', 1, 'fogaroli'),
('Concert Oct', 2, 47.00, 'Live concert', '2024-10-12', 2, 'fogaroli'),
('Train Oct', 3, 22.00, 'Train ticket', '2024-10-14', 3, 'fogaroli'),
('Groceries Oct', 1, 57.00, 'Groceries for week', '2024-10-16', 1, 'fogaroli'),
('Coffee Oct', 2, 11.00, 'Coffee with friend', '2024-10-18', 2, 'fogaroli'),
('Bus Oct', 3, 12.00, 'Bus fare', '2024-10-20', 3, 'fogaroli'),
('Groceries Oct', 1, 67.00, 'Groceries for week', '2024-10-22', 1, 'fogaroli'),
('Streaming Oct', 2, 13.00, 'Streaming subscription', '2024-10-23', 2, 'fogaroli'),
('Taxi Oct', 3, 19.00, 'Taxi ride', '2024-10-25', 3, 'fogaroli'),
('Groceries Oct', 1, 72.00, 'Groceries for week', '2024-10-27', 1, 'fogaroli'),
('Dinner Oct', 2, 37.00, 'Dinner out', '2024-10-28', 2, 'fogaroli'),
('Bus Oct', 3, 13.00, 'Bus fare', '2024-10-29', 3, 'fogaroli'),

-- November 2024
('Groceries Nov', 1, 54.00, 'Groceries for November', '2024-11-02', 1, 'fogaroli'),
('Cinema Nov', 2, 34.00, 'Movie night', '2024-11-03', 2, 'fogaroli'),
('Bus Pass Nov', 3, 44.00, 'Monthly bus pass', '2024-11-04', 3, 'fogaroli'),
('Lunch Out Nov', 2, 29.00, 'Lunch with friends', '2024-11-06', 2, 'fogaroli'),
('Taxi Nov', 3, 19.00, 'Taxi ride', '2024-11-08', 3, 'fogaroli'),
('Supermarket Nov', 1, 64.00, 'Weekly groceries', '2024-11-10', 1, 'fogaroli'),
('Concert Nov', 2, 49.00, 'Live concert', '2024-11-12', 2, 'fogaroli'),
('Train Nov', 3, 24.00, 'Train ticket', '2024-11-14', 3, 'fogaroli'),
('Groceries Nov', 1, 59.00, 'Groceries for week', '2024-11-16', 1, 'fogaroli'),
('Coffee Nov', 2, 12.00, 'Coffee with friend', '2024-11-18', 2, 'fogaroli'),
('Bus Nov', 3, 14.00, 'Bus fare', '2024-11-20', 3, 'fogaroli'),
('Groceries Nov', 1, 69.00, 'Groceries for week', '2024-11-22', 1, 'fogaroli'),
('Streaming Nov', 2, 14.00, 'Streaming subscription', '2024-11-23', 2, 'fogaroli'),
('Taxi Nov', 3, 20.00, 'Taxi ride', '2024-11-25', 3, 'fogaroli'),
('Groceries Nov', 1, 74.00, 'Groceries for week', '2024-11-27', 1, 'fogaroli'),
('Dinner Nov', 2, 39.00, 'Dinner out', '2024-11-28', 2, 'fogaroli'),
('Bus Nov', 3, 15.00, 'Bus fare', '2024-11-29', 3, 'fogaroli'),

-- December 2024
('Groceries Dec', 1, 56.00, 'Groceries for December', '2024-12-02', 1, 'fogaroli'),
('Cinema Dec', 2, 36.00, 'Movie night', '2024-12-03', 2, 'fogaroli'),
('Bus Pass Dec', 3, 46.00, 'Monthly bus pass', '2024-12-04', 3, 'fogaroli'),
('Lunch Out Dec', 2, 31.00, 'Lunch with friends', '2024-12-06', 2, 'fogaroli'),
('Taxi Dec', 3, 21.00, 'Taxi ride', '2024-12-08', 3, 'fogaroli'),
('Supermarket Dec', 1, 66.00, 'Weekly groceries', '2024-12-10', 1, 'fogaroli'),
('Concert Dec', 2, 51.00, 'Live concert', '2024-12-12', 2, 'fogaroli'),
('Train Dec', 3, 26.00, 'Train ticket', '2024-12-14', 3, 'fogaroli'),
('Groceries Dec', 1, 61.00, 'Groceries for week', '2024-12-16', 1, 'fogaroli'),
('Coffee Dec', 2, 13.00, 'Coffee with friend', '2024-12-18', 2, 'fogaroli'),
('Bus Dec', 3, 16.00, 'Bus fare', '2024-12-20', 3, 'fogaroli'),
('Groceries Dec', 1, 71.00, 'Groceries for week', '2024-12-22', 1, 'fogaroli'),
('Streaming Dec', 2, 15.00, 'Streaming subscription', '2024-12-23', 2, 'fogaroli'),
('Taxi Dec', 3, 21.00, 'Taxi ride', '2024-12-25', 3, 'fogaroli'),
('Groceries Dec', 1, 76.00, 'Groceries for week', '2024-12-27', 1, 'fogaroli'),
('Dinner Dec', 2, 41.00, 'Dinner out', '2024-12-28', 2, 'fogaroli'),
('Bus Dec', 3, 17.00, 'Bus fare', '2024-12-29', 3, 'fogaroli'),

-- January 2025
('Groceries Jan', 1, 58.00, 'Groceries for January', '2025-01-02', 1, 'fogaroli'),
('Cinema Jan', 2, 38.00, 'Movie night', '2025-01-03', 2, 'fogaroli'),
('Bus Pass Jan', 3, 48.00, 'Monthly bus pass', '2025-01-04', 3, 'fogaroli'),
('Lunch Out Jan', 2, 33.00, 'Lunch with friends', '2025-01-06', 2, 'fogaroli'),
('Taxi Jan', 3, 23.00, 'Taxi ride', '2025-01-08', 3, 'fogaroli'),
('Supermarket Jan', 1, 68.00, 'Weekly groceries', '2025-01-10', 1, 'fogaroli'),
('Concert Jan', 2, 53.00, 'Live concert', '2025-01-12', 2, 'fogaroli'),
('Train Jan', 3, 28.00, 'Train ticket', '2025-01-14', 3, 'fogaroli'),
('Groceries Jan', 1, 63.00, 'Groceries for week', '2025-01-16', 1, 'fogaroli'),
('Coffee Jan', 2, 14.00, 'Coffee with friend', '2025-01-18', 2, 'fogaroli'),
('Bus Jan', 3, 18.00, 'Bus fare', '2025-01-20', 3, 'fogaroli'),
('Groceries Jan', 1, 73.00, 'Groceries for week', '2025-01-22', 1, 'fogaroli'),
('Streaming Jan', 2, 16.00, 'Streaming subscription', '2025-01-23', 2, 'fogaroli'),
('Taxi Jan', 3, 23.00, 'Taxi ride', '2025-01-25', 3, 'fogaroli'),
('Groceries Jan', 1, 78.00, 'Groceries for week', '2025-01-27', 1, 'fogaroli'),
('Dinner Jan', 2, 43.00, 'Dinner out', '2025-01-28', 2, 'fogaroli'),
('Bus Jan', 3, 19.00, 'Bus fare', '2025-01-29', 3, 'fogaroli'),

-- February 2025
('Groceries Feb', 1, 60.00, 'Groceries for February', '2025-02-02', 1, 'fogaroli'),
('Cinema Feb', 2, 40.00, 'Movie night', '2025-02-03', 2, 'fogaroli'),
('Bus Pass Feb', 3, 50.00, 'Monthly bus pass', '2025-02-04', 3, 'fogaroli'),
('Lunch Out Feb', 2, 35.00, 'Lunch with friends', '2025-02-06', 2, 'fogaroli'),
('Taxi Feb', 3, 25.00, 'Taxi ride', '2025-02-08', 3, 'fogaroli'),
('Supermarket Feb', 1, 70.00, 'Weekly groceries', '2025-02-10', 1, 'fogaroli'),
('Concert Feb', 2, 55.00, 'Live concert', '2025-02-12', 2, 'fogaroli'),
('Train Feb', 3, 30.00, 'Train ticket', '2025-02-14', 3, 'fogaroli'),
('Groceries Feb', 1, 65.00, 'Groceries for week', '2025-02-16', 1, 'fogaroli'),
('Coffee Feb', 2, 15.00, 'Coffee with friend', '2025-02-18', 2, 'fogaroli'),
('Bus Feb', 3, 20.00, 'Bus fare', '2025-02-20', 3, 'fogaroli'),
('Groceries Feb', 1, 75.00, 'Groceries for week', '2025-02-22', 1, 'fogaroli'),
('Streaming Feb', 2, 17.00, 'Streaming subscription', '2025-02-23', 2, 'fogaroli'),
('Taxi Feb', 3, 25.00, 'Taxi ride', '2025-02-25', 3, 'fogaroli'),
('Groceries Feb', 1, 80.00, 'Groceries for week', '2025-02-27', 1, 'fogaroli'),
('Dinner Feb', 2, 45.00, 'Dinner out', '2025-02-28', 2, 'fogaroli'),
('Bus Feb', 3, 21.00, 'Bus fare', '2025-02-28', 3, 'fogaroli'),

-- March 2025
('Groceries Mar', 1, 62.00, 'Groceries for March', '2025-03-02', 1, 'fogaroli'),
('Cinema Mar', 2, 42.00, 'Movie night', '2025-03-03', 2, 'fogaroli'),
('Bus Pass Mar', 3, 52.00, 'Monthly bus pass', '2025-03-04', 3, 'fogaroli'),
('Lunch Out Mar', 2, 37.00, 'Lunch with friends', '2025-03-06', 2, 'fogaroli'),
('Taxi Mar', 3, 27.00, 'Taxi ride', '2025-03-08', 3, 'fogaroli'),
('Supermarket Mar', 1, 72.00, 'Weekly groceries', '2025-03-10', 1, 'fogaroli'),
('Concert Mar', 2, 57.00, 'Live concert', '2025-03-12', 2, 'fogaroli'),
('Train Mar', 3, 32.00, 'Train ticket', '2025-03-14', 3, 'fogaroli'),
('Groceries Mar', 1, 67.00, 'Groceries for week', '2025-03-16', 1, 'fogaroli'),
('Coffee Mar', 2, 16.00, 'Coffee with friend', '2025-03-18', 2, 'fogaroli'),
('Bus Mar', 3, 22.00, 'Bus fare', '2025-03-20', 3, 'fogaroli'),
('Groceries Mar', 1, 77.00, 'Groceries for week', '2025-03-22', 1, 'fogaroli'),
('Streaming Mar', 2, 18.00, 'Streaming subscription', '2025-03-23', 2, 'fogaroli'),
('Taxi Mar', 3, 27.00, 'Taxi ride', '2025-03-25', 3, 'fogaroli'),
('Groceries Mar', 1, 82.00, 'Groceries for week', '2025-03-27', 1, 'fogaroli'),
('Dinner Mar', 2, 47.00, 'Dinner out', '2025-03-28', 2, 'fogaroli'),
('Bus Mar', 3, 23.00, 'Bus fare', '2025-03-29', 3, 'fogaroli'),

-- April 2025
('Groceries Apr', 1, 64.00, 'Groceries for April', '2025-04-02', 1, 'fogaroli'),
('Cinema Apr', 2, 44.00, 'Movie night', '2025-04-03', 2, 'fogaroli'),
('Bus Pass Apr', 3, 54.00, 'Monthly bus pass', '2025-04-04', 3, 'fogaroli'),
('Lunch Out Apr', 2, 39.00, 'Lunch with friends', '2025-04-06', 2, 'fogaroli'),
('Taxi Apr', 3, 29.00, 'Taxi ride', '2025-04-08', 3, 'fogaroli'),
('Supermarket Apr', 1, 74.00, 'Weekly groceries', '2025-04-10', 1, 'fogaroli'),
('Concert Apr', 2, 59.00, 'Live concert', '2025-04-12', 2, 'fogaroli'),
('Train Apr', 3, 34.00, 'Train ticket', '2025-04-14', 3, 'fogaroli'),
('Groceries Apr', 1, 69.00, 'Groceries for week', '2025-04-16', 1, 'fogaroli'),
('Coffee Apr', 2, 17.00, 'Coffee with friend', '2025-04-18', 2, 'fogaroli'),
('Bus Apr', 3, 24.00, 'Bus fare', '2025-04-20', 3, 'fogaroli'),
('Groceries Apr', 1, 79.00, 'Groceries for week', '2025-04-22', 1, 'fogaroli'),
('Streaming Apr', 2, 19.00, 'Streaming subscription', '2025-04-23', 2, 'fogaroli'),
('Taxi Apr', 3, 29.00, 'Taxi ride', '2025-04-25', 3, 'fogaroli'),
('Groceries Apr', 1, 84.00, 'Groceries for week', '2025-04-27', 1, 'fogaroli'),
('Dinner Apr', 2, 49.00, 'Dinner out', '2025-04-28', 2, 'fogaroli'),
('Bus Apr', 3, 25.00, 'Bus fare', '2025-04-29', 3, 'fogaroli'),

-- May 2025
('Groceries May', 1, 66.00, 'Groceries for May', '2025-05-02', 1, 'fogaroli'),
('Cinema May', 2, 46.00, 'Movie night', '2025-05-03', 2, 'fogaroli'),
('Bus Pass May', 3, 56.00, 'Monthly bus pass', '2025-05-04', 3, 'fogaroli'),
('Lunch Out May', 2, 41.00, 'Lunch with friends', '2025-05-06', 2, 'fogaroli');
-- ('Taxi May', 3, 31.00, 'Taxi ride', '2025-05-08', 3, 'fogaroli'),
-- ('Supermarket May', 1, 76.00, 'Weekly groceries', '2025-05-10', 1, 'fogaroli'),
-- ('Concert May', 2, 61.00, 'Live concert', '2025-05-12', 2, 'fogaroli'),
-- ('Train May', 3, 36.00, 'Train ticket', '2025-05-14', 3, 'fogaroli'),
-- ('Groceries May', 1, 71.00, 'Groceries for week', '2025-05-16', 1, 'fogaroli'),
-- ('Coffee May', 2, 18.00, 'Coffee with friend', '2025-05-18', 2, 'fogaroli'),
-- ('Bus May', 3, 26.00, 'Bus fare', '2025-05-20', 3, 'fogaroli'),
-- ('Groceries May', 1, 81.00, 'Groceries for week', '2025-05-22', 1, 'fogaroli'),
-- ('Streaming May', 2, 20.00, 'Streaming subscription', '2025-05-23', 2, 'fogaroli'),
-- ('Taxi May', 3, 31.00, 'Taxi ride', '2025-05-25', 3, 'fogaroli'),
-- ('Groceries May', 1, 86.00, 'Groceries for week', '2025-05-27', 1, 'fogaroli'),
-- ('Dinner May', 2, 51.00, 'Dinner out', '2025-05-28', 2, 'fogaroli'),
-- ('Bus May', 3, 27.00, 'Bus fare', '2025-05-29', 3, 'fogaroli'),

-- June 2025
-- ('Groceries Jun', 1, 68.00, 'Groceries for June', '2025-06-02', 1, 'fogaroli'),
-- ('Cinema Jun', 2, 48.00, 'Movie night', '2025-06-03', 2, 'fogaroli'),
-- ('Bus Pass Jun', 3, 58.00, 'Monthly bus pass', '2025-06-04', 3, 'fogaroli'),
-- ('Lunch Out Jun', 2, 43.00, 'Lunch with friends', '2025-06-06', 2, 'fogaroli'),
-- ('Taxi Jun', 3, 33.00, 'Taxi ride', '2025-06-08', 3, 'fogaroli'),
-- ('Supermarket Jun', 1, 78.00, 'Weekly groceries', '2025-06-10', 1, 'fogaroli'),
-- ('Concert Jun', 2, 63.00, 'Live concert', '2025-06-12', 2, 'fogaroli'),
-- ('Train Jun', 3, 38.00, 'Train ticket', '2025-06-14', 3, 'fogaroli'),
-- ('Groceries Jun', 1, 73.00, 'Groceries for week', '2025-06-16', 1, 'fogaroli'),
-- ('Coffee Jun', 2, 19.00, 'Coffee with friend', '2025-06-18', 2, 'fogaroli'),
-- ('Bus Jun', 3, 28.00, 'Bus fare', '2025-06-20', 3, 'fogaroli'),
-- ('Groceries Jun', 1, 83.00, 'Groceries for week', '2025-06-22', 1, 'fogaroli'),
-- ('Streaming Jun', 2, 21.00, 'Streaming subscription', '2025-06-23', 2, 'fogaroli'),
-- ('Taxi Jun', 3, 33.00, 'Taxi ride', '2025-06-25', 3, 'fogaroli'),
-- ('Groceries Jun', 1, 88.00, 'Groceries for week', '2025-06-27', 1, 'fogaroli'),
-- ('Dinner Jun', 2, 53.00, 'Dinner out', '2025-06-28', 2, 'fogaroli'),
-- ('Bus Jun', 3, 29.00, 'Bus fare', '2025-06-29', 3, 'fogaroli'),

-- July 2025
-- ('Groceries Jul', 1, 70.00, 'Groceries for July', '2025-07-02', 1, 'fogaroli'),
-- ('Cinema Jul', 2, 50.00, 'Movie night', '2025-07-03', 2, 'fogaroli'),
-- ('Bus Pass Jul', 3, 60.00, 'Monthly bus pass', '2025-07-04', 3, 'fogaroli'),
-- ('Lunch Out Jul', 2, 45.00, 'Lunch with friends', '2025-07-06', 2, 'fogaroli'),
-- ('Taxi Jul', 3, 35.00, 'Taxi ride', '2025-07-08', 3, 'fogaroli'),
-- ('Supermarket Jul', 1, 80.00, 'Weekly groceries', '2025-07-10', 1, 'fogaroli'),
-- ('Concert Jul', 2, 65.00, 'Live concert', '2025-07-12', 2, 'fogaroli'),
-- ('Train Jul', 3, 40.00, 'Train ticket', '2025-07-14', 3, 'fogaroli'),
-- ('Groceries Jul', 1, 75.00, 'Groceries for week', '2025-07-16', 1, 'fogaroli'),
-- ('Coffee Jul', 2, 20.00, 'Coffee with friend', '2025-07-18', 2, 'fogaroli'),
-- ('Bus Jul', 3, 30.00, 'Bus fare', '2025-07-20', 3, 'fogaroli'),
-- ('Groceries Jul', 1, 85.00, 'Groceries for week', '2025-07-22', 1, 'fogaroli'),
-- ('Streaming Jul', 2, 22.00, 'Streaming subscription', '2025-07-23', 2, 'fogaroli'),
-- ('Taxi Jul', 3, 35.00, 'Taxi ride', '2025-07-25', 3, 'fogaroli'),
-- ('Groceries Jul', 1, 90.00, 'Groceries for week', '2025-07-27', 1, 'fogaroli'),
-- ('Dinner Jul', 2, 55.00, 'Dinner out', '2025-07-28', 2, 'fogaroli'),
-- ('Bus Jul', 3, 31.00, 'Bus fare', '2025-07-29', 3, 'fogaroli');

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
('fogaroli', 2),
('admin', 2);

-- Insert data into user_stock table
INSERT INTO user_stock (username, stock_ref) VALUES
('fogaroli', 'AAPL'),
('fogaroli', 'GOOGL'),
('admin', 'GOOGL');