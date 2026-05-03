const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // Change to your MySQL username
  password: 'Parents@123',         // Change to your MySQL password
  database: 'drought_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

module.exports = db;
