require('dotenv').config();
const Station = require('../model/station');
const db = require('../config/db');

db();

const station = new Station({
        region: "String",
        name: "String",
        address: "String",
        brand: "String",
        isSelf: false,
        price_premium_gasoline: 123,
        price_gasoline: 123,
        price_diesel: 123,
        price_kerosene: 123,
    }
);
let id;
const save = async () =>
    await station.save()
        .then(res => {
            console.log("===RES===\n" + res);
            id = res.id;
        })
        .catch(err => {
            console.error(err);
        });

const find = async () =>
    await Station.find()
        .then(stations => {
            console.log("===STATIONS===");
            console.log(stations);
        });

const remove = async () =>
    await Station.remove({id: id})
        .then(res => {
            console.log("DELETE");
            console.log(res);
        }).catch(err => {
        console.error(err);
    });
