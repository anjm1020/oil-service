const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    station_id: String,
    region: String,
    name: String,
    address: String,
    brand : String,
    isSelf : Boolean,
    price_premium_gasoline : Number,
    price_gasoline : Number,
    price_diesel : Number,
    price_kerosene : Number,
});

module.exports = mongoose.model("Station", stationSchema);

