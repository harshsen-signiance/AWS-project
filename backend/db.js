const mysql = require("mysql2/promise");
const { getSecret } = require("./secrets");

let pool;

async function initDb() {
  if (pool) return pool;

  let creds;

  // Check if we have database credentials in environment variables (for local/docker)
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME) {
    console.log("ℹ️ Using database credentials from environment variables");
    creds = {
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      dbname: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    };
  } else {
    console.log("ℹ️ Fetching database credentials from AWS Secrets Manager");
    try {
      const secret = await getSecret("prod-app/db");
      creds = JSON.parse(secret);
    } catch (err) {
      console.error("❌ Failed to fetch secrets from AWS:", err.message);
      throw new Error("Database configuration missing. Provide ENV vars or AWS secrets.");
    }
  }

  // The AWS secret may store a full connection URL in `host`.
  // Detect this and parse it out so mysql2 gets a plain hostname.
  let dbHost = creds.host;
  let dbUser = creds.username;
  let dbPassword = creds.password;
  let dbName = creds.dbname;
  let dbPort = creds.port || 3306;

  if (dbHost && dbHost.startsWith("mysql://")) {
    try {
      const cleanUrl = dbHost.trim().split(" ")[0];
      const url = new URL(cleanUrl);
      dbHost = url.hostname;
      dbUser = dbUser || url.username;
      dbPassword = dbPassword || url.password;
      dbName = dbName || url.pathname.replace(/^\//, "");
      dbPort = dbPort || url.port || 3306;
      console.log(`ℹ️ Parsed connection URL — host resolved to: ${dbHost}`);
    } catch (parseErr) {
      console.error("Failed to parse connection URL from secret:", parseErr.message);
      throw new Error("Invalid database host/URL in secret.");
    }
  }

  const sslEnabled = process.env.DB_SSL !== "false"; // default true for RDS

  pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    port: Number(dbPort) || 3306,
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Verify connectivity
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log(`✅ Connected to MySQL DB at ${dbHost}`);

  // Auto-create table if it doesn't exist (for local/docker freshness)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      task TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Database tables initialized");

  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error("DB not initialized. Call initDb() first.");
  }
  return pool;
}

module.exports = { initDb, getPool };