const { Pool } = require("pg");
const { getDbSecret } = require("./secrets");

let pool;

async function initDb() {
  const secret = await getDbSecret();

  pool = new Pool({
    host: secret.host,
    user: secret.username,
    password: secret.password,
    database: secret.dbname,
    port: secret.port,
    ssl: { rejectUnauthorized: false },
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      task TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE
    );
  `);

  console.log("✅ Connected to database");
}

function getPool() {
  if (!pool) throw new Error("DB not initialized");
  return pool;
}

module.exports = { initDb, getPool };