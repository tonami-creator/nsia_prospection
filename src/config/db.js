const mysql = require("mysql2/promise");

// Si tu utilises dotenv en local, garde cette ligne :
require("dotenv").config();

const pool = mysql.createPool(process.env.MYSQL_URL ||{
  host     : process.env.MYSQLHOST,
  user     : process.env.MYSQLUSER,
  password : process.env.MYSQLPASSWORD,
  database : process.env.MYSQLDATABASE,
  port     : process.env.MYSQLPORT
});

module.exports = pool;
