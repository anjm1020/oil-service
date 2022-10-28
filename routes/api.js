const express = require('express');
const router = express.Router();
const Station = require("../model/station");
const OpenData = require("../module/openData");


router.get("/stations", async (req, res) => {
    const query = req.query;
    if (!query.page || !query.size) {
        res.status(400).send({errMsg: "Invalid Request"})
    }
    try {
        const data = await Station.findAll(query);
        res.send({count: data.length, data});
    } catch (e) {
        console.error(e);
    }
});

router.get("/stations/lowest_price", async (req, res) => {
    const {target: oil_type, region} = req.query;
    if (!oil_type) {
        res.status(400).send({errMsg: "Invalid Request"});
    }
    try {
        const data = await Station.findOneLowestPrice({oil_type, region});
        res.send(data[0]);
    } catch (e) {
        console.error(e);
    }
});

router.get("/stations/:stationId", async (req, res) => {
    const {stationId: station_id} = req.params;
    try {
        const data = await Station.findOneById(station_id);
        console.log(data);
        if (data.length == 0) {
            res.status(404).send({errMsg: "Not Found"})
        }
        res.send(data[0]);
    } catch (e) {
        console.error(e);
    }
});

router.get("/stations/nearby", async (req, res) => {
    const {x, y, oilType} = req.params;
    try {

    } catch (e) {
        console.error(e);
    }

});


module.exports = router;
