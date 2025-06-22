const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'grading_system',
  port: process.env.DB_PORT || 3306
};

const db = mysql.createPool(config);

const testDB = async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Connected to MySQL database");
    
    // Check grades table structure
    try {
      const [columns] = await db.query('DESCRIBE grades');
      console.log("📋 Grades table structure:");
      columns.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type})`);
      });
    } catch (tableError) {
      console.log("⚠️ Could not check grades table structure:", tableError.message);
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.stack);
    console.log("Please make sure MySQL is running and the database 'grading_system' exists");
    process.exit(1);
  }
};

module.exports = {
  db,
  testDB
};
