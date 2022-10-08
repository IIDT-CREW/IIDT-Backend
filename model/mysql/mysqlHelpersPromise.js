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
  connectionLimit: 2,
  waitForConnections: true,
  queueLimit: 0,
  keepAliveInitialDelay: 10000, // 0 by default.
  enableKeepAlive: true, // false by default.
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
