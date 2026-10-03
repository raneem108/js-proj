
C

CREATE TABLE expenses (
    id int generated always as identity PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL
);
INSERT INTO expenses (title, amount, category, date)
VALUES
('Chicken Sandwich', 5.75, 'Food', '2026-09-11'),
('Fuel', 22.00, 'Transport', '2026-09-12'),
('Water Bill', 12.50, 'Bills', '2026-09-13'),
('Cinema', 9.00, 'Entertainment', '2026-09-14'),
('University Supplies', 14.25, 'Other', '2026-09-16'),
('Family Dinner', 32.50, 'Food', '2026-09-19'),
('Ride App', 6.75, 'Transport', '2026-09-19'),
('Electricity Bill', 41.80, 'Bills', '2026-09-22'),
('Game Purchase', 15.99, 'Entertainment', '2026-09-22'),
('Skincare Products', 27.50, 'Other', '2026-09-25'),
('Breakfast', 6.25, 'Food', '2026-09-25'),
('Bus Fare', 1.50, 'Transport', '2026-09-25'),
('Mobile Internet', 18.00, 'Bills', '2026-09-28'),
('Concert', 25.00, 'Entertainment', '2026-09-29'),
('Notebook Set', 8.50, 'Other', '2026-09-30'),
('Pizza', 13.75, 'Food', '2026-10-1'),
('Car Wash', 8.00, 'Transport', '2026-10-1'),
('Internet Subscription', 23.00, 'Bills', '2026-10-2'),
('Bowling', 12.00, 'Entertainment', '2026-10-3'),
('Phone Charger', 11.25, 'Other', '2026-10-3');