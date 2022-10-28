require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) return console.error(err);

    let createTableStation = `CREATE TABLE IF NOT EXISTS stations(
    station_id VARCHAR(30) PRIMARY KEY,
    region VARCHAR(50),
    name VARCHAR(50),
    address VARCHAR(128),
    brand VARCHAR(20),
    isSelf BOOLEAN,
    price_premium_gasoline INT,
    price_gasoline INT,
    price_diesel INT,
    price_kerosene INT
    )DEFAULT CHARSET=utf8;`;

    connection.query(createTableStation, (err, res) => {
        if(err) throw err;
    })
});

module.exports = connection;

