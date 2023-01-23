const mysql = require('mysql2')
require('dotenv').config();

const pool = mysql.createPool({
    host: 'database',
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
})

module.exports = pool.promise()