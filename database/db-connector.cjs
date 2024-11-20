let mysql = require("mysql");
let dotenv = require("dotenv");
dotenv.config();

// Connection pool from .env credentials
let pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.API_HOST,
  user: process.env.API_USER,
  password: process.env.API_PASSWORD,
  database: process.env.API_DATABASE,
});

module.exports.pool = pool;
module.exports.mysql = mysql; // Hack because mysql is in CJS (agony)
