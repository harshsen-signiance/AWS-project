const express = require("express");
const cors = require("cors");
const { initDb, getPool } = require("./db");

const app = express();
const corsOptions = {
  origin: 'http://prod-app-frontend-harsh.s3-website-us-east-1.amazonaws.com', // Replace with your ACTUAL S3 bucket URL
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.use(express.json());

const PORT = 8080;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/todos", async (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "task is required" });
  }

  const pool = getPool();
  const result = await pool.query(
    "INSERT INTO todos (task) VALUES ($1) RETURNING *",
    [task]
  );

  res.json(result.rows[0]);
});

app.get("/todos", async (req, res) => {
  const pool = getPool();
  const result = await pool.query("SELECT * FROM todos ORDER BY id DESC");
  res.json(result.rows);
});

app.delete("/todos/:id", async (req, res) => {
  const pool = getPool();
  await pool.query("DELETE FROM todos WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

async function start() {
  await initDb();
  app.listen(PORT, () =>
    console.log(`🚀 Backend listening on port ${PORT}`)
  );
}

start();