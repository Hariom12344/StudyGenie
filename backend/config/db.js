const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'examace_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection function
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Database connected successfully to', process.env.DB_NAME || 'examace_db');
    connection.release();
    return true;
  } catch (error) {
    console.error('MySQL Database connection failed:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  query: (sql, params) => pool.query(sql, params),
  checkConnection
};
