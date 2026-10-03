require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const allowedCategories = [
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Other"
];

const app = express();
const PORT = 8001;


app.use(cors());
app.use(express.json());


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});


app.get("/", (req, res) => {
    res.json({ message: "Expense Tracker API is working!" });
});
app.get("/api/expenses", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                title,
                amount::numeric AS amount,
                category,
                TO_CHAR(date, 'YYYY-MM-DD') AS date
             FROM expenses
             ORDER BY id asc`
        );

        const expenses = result.rows.map(expense => ({
            ...expense,
            amount: Number(expense.amount)
        }));

        res.json(expenses);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch expenses"
        });
    }
});

app.get("/api/expenses/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const result = await pool.query(
            `SELECT
                id,
                title,
                amount::numeric AS amount,
                category,
                TO_CHAR(date, 'YYYY-MM-DD') AS date
             FROM expenses
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        const expense = {
            ...result.rows[0],
            amount: Number(result.rows[0].amount)
        };

        res.json(expense);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch expense"
        });
    }
});

app.post("/api/expenses", async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        
        if (!title || !amount || !category || !date) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                error: "Amount must be greater than 0"
            });
        }

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                error: "Invalid category"
            });
        }

        const result = await pool.query(
            `INSERT INTO expenses (title, amount, category, date)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [title, amount, category, date]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create expense"
        });
    }
});

app.put("/api/expenses/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, amount, category, date } = req.body;

        
        if (!title || !amount || !category || !date) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                error: "Amount must be greater than 0"
            });
        }

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                error: "Invalid category"
            });
        }

        const result = await pool.query(
            `UPDATE expenses
             SET title = $1,
                 amount = $2,
                 category = $3,
                 date = $4
             WHERE id = $5
             RETURNING *`,
            [title, amount, category, date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update expense"
        });
    }
});
app.delete("/api/expenses/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const result = await pool.query(
            "DELETE FROM expenses WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted successfully",
            expense: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete expense"
        });
    }
});

app.listen(PORT);