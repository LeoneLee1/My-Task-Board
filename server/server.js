const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "task_board",
});

app.listen(8081, () => {
  console.log("Server Running on http://localhost:8081/api");
});

app.get("/api", (re, res) => {
  return res.json("Hello World");
});

app.get("/api/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/api/tasks/insert", (req, res) => {
  const { name, description, icon, status } = req.body;

  const sql = "INSERT INTO tasks (name, description, icon, status, created_at, updated_at) VALUES (?,?,?,?, NOW(), NOW())";
  const values = [name, description, icon, status];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    return res.status(200).json({
      message: "Successfully insert data",
      taskId: result.insertId,
    });
  });
});

app.get("/api/tasks/show/:id", (req, res) => {
  const itemId = req.params.id;

  const sql = "SELECT * FROM tasks WHERE id = ?";
  const values = itemId;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.length === 0) {
      return res.status(404).json({
        message: "Data not found",
      });
    } else {
      return res.status(200).json({
        message: "Successfully get data",
        data: result[0],
      });
    }
  });
});

app.post("/api/tasks/update/:id", (req, res) => {
  const itemId = req.params.id;
  const { name, description, icon, status } = req.body;

  const sql = "UPDATE tasks SET name = ?, description = ?, icon = ?, status = ?, updated_at = NOW() WHERE id = ?";
  const values = [name, description, icon, status, itemId];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    return res.status(200).json({
      message: "Successfully update data",
      taskId: itemId,
    });
  });
});

app.delete("/api/tasks/delete/:id", (req, res) => {
  const itemId = req.params.id;

  const sql = "DELETE FROM tasks WHERE id = ?";

  const values = itemId;

  db.query(sql, values, (err, result) => {
    if (err)
      return res.status(500).json({
        error: err,
      });

    return res.status(200).json({
      message: "Successfully delete data",
      taskId: itemId,
    });
  });
});
