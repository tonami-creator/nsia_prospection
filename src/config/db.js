const mysql = require("mysql2/promise");
require("dotenv").config();

// La magie est ici : si MYSQL_URL existe, il prend tout. Sinon, il prend les variables séparées.
const pool = mysql.createPool(process.env.MYSQL_URL || {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

module.exports = pool;