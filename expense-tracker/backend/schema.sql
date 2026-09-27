CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL
);


INSERT INTO expenses (title, amount, category, date)
VALUES
('Lunch', 4.50, 'Food', '2026-09-27'),
('Taxi', 3.00, 'Transport', '2026-09-26'),
('Netflix', 8.00, 'Entertainment', '2026-09-25');