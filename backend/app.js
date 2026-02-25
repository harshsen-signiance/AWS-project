const express = require("express");
const { initDb, getPool } = require("./db");

const app = express();
app.use(express.json());

const PORT = 8080;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/todos", async (req, res) => {
  const { task } = req.body;
  const pool = getPool();
  const result = await pool.query(
    "INSERT INTO todos (task) VALUES ($1) RETURNING *",
    [task]
  );
  res.json(result.rows[0]);
});

app.get("/todos", async (req, res) => {
  const pool = getPool();
  const result = await pool.query("SELECT * FROM todos");
  res.json(result.rows);
});

async function start() {
  await initDb();
  app.listen(PORT, () =>
    console.log(`🚀 Backend listening on port ${PORT}`)
  );
}