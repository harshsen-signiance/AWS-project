const { Pool } = require("pg");
const { getSecret } = require("./secrets");

let pool;

async function initDb() {
  if (pool) return pool;

  const secret = await getSecret("prod-app/db");
  const creds = JSON.parse(secret);

  pool = new Pool({
    host: creds.host,
    user: creds.username,
    password: creds.password,
    database: creds.dbname,
    port: 5432,
    ssl: false,
  });

  await pool.query("SELECT 1");
  console.log("✅ Connected to RDS");

  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error("DB not initialized. Call initDb() first.");
  }
  return pool;
}

module.exports = { initDb, getPool };