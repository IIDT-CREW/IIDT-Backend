require('dotenv').config();
/**
 * MySQL helper functions
 */
const mysql = require('mysql2/promise');

/* Step 1, create DB Pool */
const pool = mysql.createPool({
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
});

module.exports = {
  // properties
  mysql: mysql,
  pool: pool,
  // methods
  // doConnect: doConnect,
  // doRelease: doRelease,
  // doCommit: doCommit,
};
