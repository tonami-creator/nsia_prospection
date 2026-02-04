const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.mysql.railway.internal,
  user: process.env.root,
  password: process.env.JhdENBsSEVjAYcsaVsnpVYFaEhTUOTqq,
  database: process.env.railway,
});

module.exports = db;



