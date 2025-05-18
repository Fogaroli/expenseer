-- Insert data into users table
-- INSERT INTO users (username, password, first_name, last_name, email, image_url, last_logged, is_admin) VALUES
-- ('demonstration', '$2b$12$RmJhXxgx/m690jVv3kG9.uIOaj9VnLA4wzuleaECefslUFI0tP9vG', 'John', 'Doe', 'John.Doe@sampleMail.com', 'https://cdn.pixabay.com/photo/2020/09/19/04/44/man-5583395_1280.jpg', '2025-01-01 12:00:00', FALSE),
-- ('admin', '$2b$12$IM5tCEup4jAt4CKpkyVb/e9Q.ttKlKLvWcmzzayI3PyMqaMQlmbFC', 'Admin', 'Admin', 'fogaroli@gmail.com', 'https://cdn.pixabay.com/photo/2013/07/12/14/48/key-148813_1280.png', '2025-01-01 12:00:00', TRUE);

-- Insert data into budgets table
INSERT INTO budgets (name, type, amount, description, username) VALUES
('Groceries', 1, 600.00, 'Monthly groceries budget', 'demonstration'),
('Entertainment', 1, 300.00, 'Monthly entertainment budget', 'demonstration'),
('Transport', 1, 250.00, 'Monthly transport budget', 'demonstration');
-- ('Vacation', 2, 2000.00, 'Annual vacation expenses', 'demonstration'),
-- ('Special Birthday', 3, 700.00, 'Planning for the special event', 'demonstration'),
-- ('Prepare for College', 4, 6500.00, 'Savings for College', 'demonstration');

-- Insert data into categories table
INSERT INTO categories (name, username) VALUES
('Food', 'demonstration'),
('Leisure', 'demonstration'),
('Commute', 'demonstration'),
('Hotel', 'demonstration'),
('Venue booking', 'demonstration'),
('Monthly Deposit', 'demonstration');

-- Insert data into expenses table
INSERT INTO expenses (name, category_id, amount, description, date, budget_id, username) VALUES
-- September 2024
('Groceries Sep', 1, 50.00, 'Groceries for September', '2024-09-02', 1, 'demonstration'),
('Cinema Sep', 2, 30.00, 'Movie night', '2024-09-03', 2, 'demonstration'),
('Bus Pass Sep', 3, 40.00, 'Monthly bus pass', '2024-09-04', 3, 'demonstration'),
('Lunch Out Sep', 2, 25.00, 'Lunch with friends', '2024-09-06', 2, 'demonstration'),
('Taxi Sep', 3, 15.00, 'Taxi ride', '2024-09-08', 3, 'demonstration'),
('Supermarket Sep', 1, 60.00, 'Weekly groceries', '2024-09-10', 1, 'demonstration'),
('Concert Sep', 2, 45.00, 'Live concert', '2024-09-12', 2, 'demonstration'),
('Train Sep', 3, 20.00, 'Train ticket', '2024-09-14', 3, 'demonstration'),
('Groceries Sep', 1, 55.00, 'Groceries for week', '2024-09-16', 1, 'demonstration'),
('Coffee Sep', 2, 10.00, 'Coffee with friend', '2024-09-18', 2, 'demonstration'),
('Bus Sep', 3, 10.00, 'Bus fare', '2024-09-20', 3, 'demonstration'),
('Groceries Sep', 1, 65.00, 'Groceries for week', '2024-09-22', 1, 'demonstration'),
('Streaming Sep', 2, 12.00, 'Streaming subscription', '2024-09-23', 2, 'demonstration'),
('Taxi Sep', 3, 18.00, 'Taxi ride', '2024-09-25', 3, 'demonstration'),
('Groceries Sep', 1, 70.00, 'Groceries for week', '2024-09-27', 1, 'demonstration'),
('Dinner Sep', 2, 35.00, 'Dinner out', '2024-09-28', 2, 'demonstration'),
('Bus Sep', 3, 10.00, 'Bus fare', '2024-09-29', 3, 'demonstration'),

-- October 2024
('Groceries Oct', 1, 52.00, 'Groceries for October', '2024-10-02', 1, 'demonstration'),
('Cinema Oct', 2, 32.00, 'Movie night', '2024-10-03', 2, 'demonstration'),
('Bus Pass Oct', 3, 42.00, 'Monthly bus pass', '2024-10-04', 3, 'demonstration'),
('Lunch Out Oct', 2, 27.00, 'Lunch with friends', '2024-10-06', 2, 'demonstration'),
('Taxi Oct', 3, 17.00, 'Taxi ride', '2024-10-08', 3, 'demonstration'),
('Supermarket Oct', 1, 62.00, 'Weekly groceries', '2024-10-10', 1, 'demonstration'),
('Concert Oct', 2, 47.00, 'Live concert', '2024-10-12', 2, 'demonstration'),
('Train Oct', 3, 22.00, 'Train ticket', '2024-10-14', 3, 'demonstration'),
('Groceries Oct', 1, 57.00, 'Groceries for week', '2024-10-16', 1, 'demonstration'),
('Coffee Oct', 2, 11.00, 'Coffee with friend', '2024-10-18', 2, 'demonstration'),
('Bus Oct', 3, 12.00, 'Bus fare', '2024-10-20', 3, 'demonstration'),
('Groceries Oct', 1, 67.00, 'Groceries for week', '2024-10-22', 1, 'demonstration'),
('Streaming Oct', 2, 13.00, 'Streaming subscription', '2024-10-23', 2, 'demonstration'),
('Taxi Oct', 3, 19.00, 'Taxi ride', '2024-10-25', 3, 'demonstration'),
('Groceries Oct', 1, 72.00, 'Groceries for week', '2024-10-27', 1, 'demonstration'),
('Dinner Oct', 2, 37.00, 'Dinner out', '2024-10-28', 2, 'demonstration'),
('Bus Oct', 3, 13.00, 'Bus fare', '2024-10-29', 3, 'demonstration'),

-- November 2024
('Groceries Nov', 1, 54.00, 'Groceries for November', '2024-11-02', 1, 'demonstration'),
('Cinema Nov', 2, 34.00, 'Movie night', '2024-11-03', 2, 'demonstration'),
('Bus Pass Nov', 3, 44.00, 'Monthly bus pass', '2024-11-04', 3, 'demonstration'),
('Lunch Out Nov', 2, 29.00, 'Lunch with friends', '2024-11-06', 2, 'demonstration'),
('Taxi Nov', 3, 19.00, 'Taxi ride', '2024-11-08', 3, 'demonstration'),
('Supermarket Nov', 1, 64.00, 'Weekly groceries', '2024-11-10', 1, 'demonstration'),
('Concert Nov', 2, 49.00, 'Live concert', '2024-11-12', 2, 'demonstration'),
('Train Nov', 3, 24.00, 'Train ticket', '2024-11-14', 3, 'demonstration'),
('Groceries Nov', 1, 59.00, 'Groceries for week', '2024-11-16', 1, 'demonstration'),
('Coffee Nov', 2, 12.00, 'Coffee with friend', '2024-11-18', 2, 'demonstration'),
('Bus Nov', 3, 14.00, 'Bus fare', '2024-11-20', 3, 'demonstration'),
('Groceries Nov', 1, 69.00, 'Groceries for week', '2024-11-22', 1, 'demonstration'),
('Streaming Nov', 2, 14.00, 'Streaming subscription', '2024-11-23', 2, 'demonstration'),
('Taxi Nov', 3, 20.00, 'Taxi ride', '2024-11-25', 3, 'demonstration'),
('Groceries Nov', 1, 74.00, 'Groceries for week', '2024-11-27', 1, 'demonstration'),
('Dinner Nov', 2, 39.00, 'Dinner out', '2024-11-28', 2, 'demonstration'),
('Bus Nov', 3, 15.00, 'Bus fare', '2024-11-29', 3, 'demonstration'),

-- December 2024
('Groceries Dec', 1, 56.00, 'Groceries for December', '2024-12-02', 1, 'demonstration'),
('Cinema Dec', 2, 36.00, 'Movie night', '2024-12-03', 2, 'demonstration'),
('Bus Pass Dec', 3, 46.00, 'Monthly bus pass', '2024-12-04', 3, 'demonstration'),
('Lunch Out Dec', 2, 31.00, 'Lunch with friends', '2024-12-06', 2, 'demonstration'),
('Taxi Dec', 3, 21.00, 'Taxi ride', '2024-12-08', 3, 'demonstration'),
('Supermarket Dec', 1, 66.00, 'Weekly groceries', '2024-12-10', 1, 'demonstration'),
('Concert Dec', 2, 51.00, 'Live concert', '2024-12-12', 2, 'demonstration'),
('Train Dec', 3, 26.00, 'Train ticket', '2024-12-14', 3, 'demonstration'),
('Groceries Dec', 1, 61.00, 'Groceries for week', '2024-12-16', 1, 'demonstration'),
('Coffee Dec', 2, 13.00, 'Coffee with friend', '2024-12-18', 2, 'demonstration'),
('Bus Dec', 3, 16.00, 'Bus fare', '2024-12-20', 3, 'demonstration'),
('Groceries Dec', 1, 71.00, 'Groceries for week', '2024-12-22', 1, 'demonstration'),
('Streaming Dec', 2, 15.00, 'Streaming subscription', '2024-12-23', 2, 'demonstration'),
('Taxi Dec', 3, 21.00, 'Taxi ride', '2024-12-25', 3, 'demonstration'),
('Groceries Dec', 1, 76.00, 'Groceries for week', '2024-12-27', 1, 'demonstration'),
('Dinner Dec', 2, 41.00, 'Dinner out', '2024-12-28', 2, 'demonstration'),
('Bus Dec', 3, 17.00, 'Bus fare', '2024-12-29', 3, 'demonstration'),

-- January 2025
('Groceries Jan', 1, 58.00, 'Groceries for January', '2025-01-02', 1, 'demonstration'),
('Cinema Jan', 2, 38.00, 'Movie night', '2025-01-03', 2, 'demonstration'),
('Bus Pass Jan', 3, 48.00, 'Monthly bus pass', '2025-01-04', 3, 'demonstration'),
('Lunch Out Jan', 2, 33.00, 'Lunch with friends', '2025-01-06', 2, 'demonstration'),
('Taxi Jan', 3, 23.00, 'Taxi ride', '2025-01-08', 3, 'demonstration'),
('Supermarket Jan', 1, 68.00, 'Weekly groceries', '2025-01-10', 1, 'demonstration'),
('Concert Jan', 2, 53.00, 'Live concert', '2025-01-12', 2, 'demonstration'),
('Train Jan', 3, 28.00, 'Train ticket', '2025-01-14', 3, 'demonstration'),
('Groceries Jan', 1, 63.00, 'Groceries for week', '2025-01-16', 1, 'demonstration'),
('Coffee Jan', 2, 14.00, 'Coffee with friend', '2025-01-18', 2, 'demonstration'),
('Bus Jan', 3, 18.00, 'Bus fare', '2025-01-20', 3, 'demonstration'),
('Groceries Jan', 1, 73.00, 'Groceries for week', '2025-01-22', 1, 'demonstration'),
('Streaming Jan', 2, 16.00, 'Streaming subscription', '2025-01-23', 2, 'demonstration'),
('Taxi Jan', 3, 23.00, 'Taxi ride', '2025-01-25', 3, 'demonstration'),
('Groceries Jan', 1, 78.00, 'Groceries for week', '2025-01-27', 1, 'demonstration'),
('Dinner Jan', 2, 43.00, 'Dinner out', '2025-01-28', 2, 'demonstration'),
('Bus Jan', 3, 19.00, 'Bus fare', '2025-01-29', 3, 'demonstration'),

-- February 2025
('Groceries Feb', 1, 60.00, 'Groceries for February', '2025-02-02', 1, 'demonstration'),
('Cinema Feb', 2, 40.00, 'Movie night', '2025-02-03', 2, 'demonstration'),
('Bus Pass Feb', 3, 50.00, 'Monthly bus pass', '2025-02-04', 3, 'demonstration'),
('Lunch Out Feb', 2, 35.00, 'Lunch with friends', '2025-02-06', 2, 'demonstration'),
('Taxi Feb', 3, 25.00, 'Taxi ride', '2025-02-08', 3, 'demonstration'),
('Supermarket Feb', 1, 70.00, 'Weekly groceries', '2025-02-10', 1, 'demonstration'),
('Concert Feb', 2, 55.00, 'Live concert', '2025-02-12', 2, 'demonstration'),
('Train Feb', 3, 30.00, 'Train ticket', '2025-02-14', 3, 'demonstration'),
('Groceries Feb', 1, 65.00, 'Groceries for week', '2025-02-16', 1, 'demonstration'),
('Coffee Feb', 2, 15.00, 'Coffee with friend', '2025-02-18', 2, 'demonstration'),
('Bus Feb', 3, 20.00, 'Bus fare', '2025-02-20', 3, 'demonstration'),
('Groceries Feb', 1, 75.00, 'Groceries for week', '2025-02-22', 1, 'demonstration'),
('Streaming Feb', 2, 17.00, 'Streaming subscription', '2025-02-23', 2, 'demonstration'),
('Taxi Feb', 3, 25.00, 'Taxi ride', '2025-02-25', 3, 'demonstration'),
('Groceries Feb', 1, 80.00, 'Groceries for week', '2025-02-27', 1, 'demonstration'),
('Dinner Feb', 2, 45.00, 'Dinner out', '2025-02-28', 2, 'demonstration'),
('Bus Feb', 3, 21.00, 'Bus fare', '2025-02-28', 3, 'demonstration'),

-- March 2025
('Groceries Mar', 1, 62.00, 'Groceries for March', '2025-03-02', 1, 'demonstration'),
('Cinema Mar', 2, 42.00, 'Movie night', '2025-03-03', 2, 'demonstration'),
('Bus Pass Mar', 3, 52.00, 'Monthly bus pass', '2025-03-04', 3, 'demonstration'),
('Lunch Out Mar', 2, 37.00, 'Lunch with friends', '2025-03-06', 2, 'demonstration'),
('Taxi Mar', 3, 27.00, 'Taxi ride', '2025-03-08', 3, 'demonstration'),
('Supermarket Mar', 1, 72.00, 'Weekly groceries', '2025-03-10', 1, 'demonstration'),
('Concert Mar', 2, 57.00, 'Live concert', '2025-03-12', 2, 'demonstration'),
('Train Mar', 3, 32.00, 'Train ticket', '2025-03-14', 3, 'demonstration'),
('Groceries Mar', 1, 67.00, 'Groceries for week', '2025-03-16', 1, 'demonstration'),
('Coffee Mar', 2, 16.00, 'Coffee with friend', '2025-03-18', 2, 'demonstration'),
('Bus Mar', 3, 22.00, 'Bus fare', '2025-03-20', 3, 'demonstration'),
('Groceries Mar', 1, 77.00, 'Groceries for week', '2025-03-22', 1, 'demonstration'),
('Streaming Mar', 2, 18.00, 'Streaming subscription', '2025-03-23', 2, 'demonstration'),
('Taxi Mar', 3, 27.00, 'Taxi ride', '2025-03-25', 3, 'demonstration'),
('Groceries Mar', 1, 82.00, 'Groceries for week', '2025-03-27', 1, 'demonstration'),
('Dinner Mar', 2, 47.00, 'Dinner out', '2025-03-28', 2, 'demonstration'),
('Bus Mar', 3, 23.00, 'Bus fare', '2025-03-29', 3, 'demonstration'),

-- April 2025
('Groceries Apr', 1, 64.00, 'Groceries for April', '2025-04-02', 1, 'demonstration'),
('Cinema Apr', 2, 44.00, 'Movie night', '2025-04-03', 2, 'demonstration'),
('Bus Pass Apr', 3, 54.00, 'Monthly bus pass', '2025-04-04', 3, 'demonstration'),
('Lunch Out Apr', 2, 39.00, 'Lunch with friends', '2025-04-06', 2, 'demonstration'),
('Taxi Apr', 3, 29.00, 'Taxi ride', '2025-04-08', 3, 'demonstration'),
('Supermarket Apr', 1, 74.00, 'Weekly groceries', '2025-04-10', 1, 'demonstration'),
('Concert Apr', 2, 59.00, 'Live concert', '2025-04-12', 2, 'demonstration'),
('Train Apr', 3, 34.00, 'Train ticket', '2025-04-14', 3, 'demonstration'),
('Groceries Apr', 1, 69.00, 'Groceries for week', '2025-04-16', 1, 'demonstration'),
('Coffee Apr', 2, 17.00, 'Coffee with friend', '2025-04-18', 2, 'demonstration'),
('Bus Apr', 3, 24.00, 'Bus fare', '2025-04-20', 3, 'demonstration'),
('Groceries Apr', 1, 79.00, 'Groceries for week', '2025-04-22', 1, 'demonstration'),
('Streaming Apr', 2, 19.00, 'Streaming subscription', '2025-04-23', 2, 'demonstration'),
('Taxi Apr', 3, 29.00, 'Taxi ride', '2025-04-25', 3, 'demonstration'),
('Groceries Apr', 1, 84.00, 'Groceries for week', '2025-04-27', 1, 'demonstration'),
('Dinner Apr', 2, 49.00, 'Dinner out', '2025-04-28', 2, 'demonstration'),
('Bus Apr', 3, 25.00, 'Bus fare', '2025-04-29', 3, 'demonstration'),

-- May 2025
('Groceries May', 1, 66.00, 'Groceries for May', '2025-05-02', 1, 'demonstration'),
('Cinema May', 2, 46.00, 'Movie night', '2025-05-03', 2, 'demonstration'),
('Bus Pass May', 3, 56.00, 'Monthly bus pass', '2025-05-04', 3, 'demonstration'),
('Lunch Out May', 2, 41.00, 'Lunch with friends', '2025-05-06', 2, 'demonstration'),
('Taxi May', 3, 31.00, 'Taxi ride', '2025-05-08', 3, 'demonstration'),
('Supermarket May', 1, 76.00, 'Weekly groceries', '2025-05-10', 1, 'demonstration'),
('Concert May', 2, 61.00, 'Live concert', '2025-05-12', 2, 'demonstration'),
('Train May', 3, 36.00, 'Train ticket', '2025-05-14', 3, 'demonstration'),
('Groceries May', 1, 71.00, 'Groceries for week', '2025-05-16', 1, 'demonstration');
-- ('Coffee May', 2, 18.00, 'Coffee with friend', '2025-05-18', 2, 'demonstration'),
-- ('Bus May', 3, 26.00, 'Bus fare', '2025-05-20', 3, 'demonstration'),
-- ('Groceries May', 1, 81.00, 'Groceries for week', '2025-05-22', 1, 'demonstration'),
-- ('Streaming May', 2, 20.00, 'Streaming subscription', '2025-05-23', 2, 'demonstration'),
-- ('Taxi May', 3, 31.00, 'Taxi ride', '2025-05-25', 3, 'demonstration'),
-- ('Groceries May', 1, 86.00, 'Groceries for week', '2025-05-27', 1, 'demonstration'),
-- ('Dinner May', 2, 51.00, 'Dinner out', '2025-05-28', 2, 'demonstration'),
-- ('Bus May', 3, 27.00, 'Bus fare', '2025-05-29', 3, 'demonstration'),

-- June 2025
-- ('Groceries Jun', 1, 68.00, 'Groceries for June', '2025-06-02', 1, 'demonstration'),
-- ('Cinema Jun', 2, 48.00, 'Movie night', '2025-06-03', 2, 'demonstration'),
-- ('Bus Pass Jun', 3, 58.00, 'Monthly bus pass', '2025-06-04', 3, 'demonstration'),
-- ('Lunch Out Jun', 2, 43.00, 'Lunch with friends', '2025-06-06', 2, 'demonstration'),
-- ('Taxi Jun', 3, 33.00, 'Taxi ride', '2025-06-08', 3, 'demonstration'),
-- ('Supermarket Jun', 1, 78.00, 'Weekly groceries', '2025-06-10', 1, 'demonstration'),
-- ('Concert Jun', 2, 63.00, 'Live concert', '2025-06-12', 2, 'demonstration'),
-- ('Train Jun', 3, 38.00, 'Train ticket', '2025-06-14', 3, 'demonstration'),
-- ('Groceries Jun', 1, 73.00, 'Groceries for week', '2025-06-16', 1, 'demonstration'),
-- ('Coffee Jun', 2, 19.00, 'Coffee with friend', '2025-06-18', 2, 'demonstration'),
-- ('Bus Jun', 3, 28.00, 'Bus fare', '2025-06-20', 3, 'demonstration'),
-- ('Groceries Jun', 1, 83.00, 'Groceries for week', '2025-06-22', 1, 'demonstration'),
-- ('Streaming Jun', 2, 21.00, 'Streaming subscription', '2025-06-23', 2, 'demonstration'),
-- ('Taxi Jun', 3, 33.00, 'Taxi ride', '2025-06-25', 3, 'demonstration'),
-- ('Groceries Jun', 1, 88.00, 'Groceries for week', '2025-06-27', 1, 'demonstration'),
-- ('Dinner Jun', 2, 53.00, 'Dinner out', '2025-06-28', 2, 'demonstration'),
-- ('Bus Jun', 3, 29.00, 'Bus fare', '2025-06-29', 3, 'demonstration'),

-- July 2025
-- ('Groceries Jul', 1, 70.00, 'Groceries for July', '2025-07-02', 1, 'demonstration'),
-- ('Cinema Jul', 2, 50.00, 'Movie night', '2025-07-03', 2, 'demonstration'),
-- ('Bus Pass Jul', 3, 60.00, 'Monthly bus pass', '2025-07-04', 3, 'demonstration'),
-- ('Lunch Out Jul', 2, 45.00, 'Lunch with friends', '2025-07-06', 2, 'demonstration'),
-- ('Taxi Jul', 3, 35.00, 'Taxi ride', '2025-07-08', 3, 'demonstration'),
-- ('Supermarket Jul', 1, 80.00, 'Weekly groceries', '2025-07-10', 1, 'demonstration'),
-- ('Concert Jul', 2, 65.00, 'Live concert', '2025-07-12', 2, 'demonstration'),
-- ('Train Jul', 3, 40.00, 'Train ticket', '2025-07-14', 3, 'demonstration'),
-- ('Groceries Jul', 1, 75.00, 'Groceries for week', '2025-07-16', 1, 'demonstration'),
-- ('Coffee Jul', 2, 20.00, 'Coffee with friend', '2025-07-18', 2, 'demonstration'),
-- ('Bus Jul', 3, 30.00, 'Bus fare', '2025-07-20', 3, 'demonstration'),
-- ('Groceries Jul', 1, 85.00, 'Groceries for week', '2025-07-22', 1, 'demonstration'),
-- ('Streaming Jul', 2, 22.00, 'Streaming subscription', '2025-07-23', 2, 'demonstration'),
-- ('Taxi Jul', 3, 35.00, 'Taxi ride', '2025-07-25', 3, 'demonstration'),
-- ('Groceries Jul', 1, 90.00, 'Groceries for week', '2025-07-27', 1, 'demonstration'),
-- ('Dinner Jul', 2, 55.00, 'Dinner out', '2025-07-28', 2, 'demonstration'),
-- ('Bus Jul', 3, 31.00, 'Bus fare', '2025-07-29', 3, 'demonstration');

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
('demonstration', 1),
('demonstration', 2);

-- Insert data into user_stock table
INSERT INTO user_stock (username, stock_ref) VALUES
('demonstration', 'AAPL'),
('demonstration', 'GOOGL');