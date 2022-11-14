const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationSchema = new mongoose.Schema({
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

