const mysql = require("mysql2/promise");
require("dotenv").config();

// Si RAILWAY fournit une URL complète, on l'utilise
if (process.env.MYSQL_URL) {
  module.exports = mysql.createPool(process.env.MYSQL_URL);
} else {
  // Sinon on utilise les variables séparées
  module.exports = mysql.createPool({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPASSWORD,
    database : process.env.MYSQLDATABASE,
    port     : process.env.MYSQLPORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}
