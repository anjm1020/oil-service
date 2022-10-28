const db = require("../config/db");

class Station {
    static insert = (data) => {
        return new Promise((resolve, reject) => {
            const query =
                "INSERT INTO stations values(?,?,?,?,?,?,?,?,?,?)";
            db.query(query,
                [data.station_id, data.region, data.name, data.address, data.brand,
                    data.isSelf == "셀프",
                    data.price_premium_gasoline || null,
                    data.price_gasoline || null,
                    data.price_diesel || null,
                    data.price_kerosene || null,
                ],
                (err) => {
                    if (err) reject(err);
                    else resolve(true)
                });
        });
    };

    static findAll = (param) => {
        return new Promise((resolve, reject) => {
            const {page, size, region, brand, isSelf} = param;
            const start = size * page;
            let query =
                `SELECT * FROM stations 
                 WHERE region LIKE '${region?"서울 "+region:'%'}'
                 AND brand LIKE '${brand?brand:'%'}'
                 AND isSelf LIKE '${isSelf?1:'%'}'
                 LIMIT ${start},${size}`;
            db.query(query, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    };

    static findOneById = (station_id) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM stations WHERE station_id=?"
            db.query(query, [station_id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    };

    static findOneLowestPrice = (param) => {
        const {oil_type, region} = param;
        console.log(param);
        const type_mapper = {
            pg: "price_premium_gasoline",
            g: "price_gasoline",
            d: "price_diesel",
            k: "price_kerosene"
        };
        return new Promise((resolve, reject) => {
            const query = `Select * From (
                           SELECT * FROM stations
                           WHERE region LIKE '${region?"서울 "+region:'%'}'
                           ) S
                           WHERE ${type_mapper[oil_type]} = (
                           SELECT MIN(NULLIF(${type_mapper[oil_type]}, 0))
                           FROM (
                           SELECT * FROM stations
                           WHERE region LIKE '${region?"서울 "+region:'%'}'
                           ) S2
                           )`;
            db.query(query, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    };
}

module.exports = Station;
