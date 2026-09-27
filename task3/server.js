require("dotenv").config({ path: "../.env" });

const { Pool } = require("pg");
const express = require("express");

const app = express();
const PORT = 8000;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: process.env.DBP_PASSWORD,
    port: 5432
});

app.get("/api/wee", (req, res) => {
    res.json({ message: "Express is working!" });
});

app.get("/test", (req, res) => {
    res.json({ message: "TEST ROUTE WORKS!" });
});
app.get("/api/students", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM students");

        console.log(result.rows);

        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});
app.get("/api/students/:id", async (req, res) => {
    const id = req.params.id;

    const result = await pool.query(
        "SELECT * FROM students WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json(result.rows[0]);
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});