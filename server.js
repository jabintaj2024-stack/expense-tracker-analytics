const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Jabintaj_630",
    database: "expense_tracker"
});

// Connect Database
db.connect((err) => {
    if (err) {
        console.error("Database Connection Failed:");
        console.error(err);
    } else {
        console.log("Connected to MySQL Database");
    }
});

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// CREATE Expense
app.post("/api/expenses", (req, res) => {
    const { title, amount, category, expense_date } = req.body;

    const sql =
        "INSERT INTO expenses (title, amount, category, expense_date) VALUES (?, ?, ?, ?)";

    db.query(
        sql,
        [title, amount, category, expense_date],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to add expense"
                });
            }

            res.json({
                success: true,
                message: "Expense Added Successfully"
            });
        }
    );
});

// READ All Expenses
app.get("/api/expenses", (req, res) => {
    const sql = "SELECT * FROM expenses ORDER BY id DESC";

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch expenses"
            });
        }

        res.json(result);
    });
});

// UPDATE Expense
app.put("/api/expenses/:id", (req, res) => {
    const { id } = req.params;
    const { title, amount, category, expense_date } = req.body;

    const sql =
        "UPDATE expenses SET title=?, amount=?, category=?, expense_date=? WHERE id=?";

    db.query(
        sql,
        [title, amount, category, expense_date, id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update expense"
                });
            }

            res.json({
                success: true,
                message: "Expense Updated Successfully"
            });
        }
    );
});

// DELETE Expense
app.delete("/api/expenses/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM expenses WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Failed to delete expense"
            });
        }

        res.json({
            success: true,
            message: "Expense Deleted Successfully"
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});