const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
dotenv.config();

const config = {
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASS ,
  database: process.env.DB_NAME ,
};

const db = mysql.createPool(config);

const testDB = async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Connected to MySQL database");
  } catch (error) {
    console.error("❌ Database connection failed:", error.stack);
    process.exit(1);
  }
};

module.exports = {
  db,
  testDB
};
