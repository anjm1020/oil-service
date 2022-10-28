require("dotenv").config({path: "../.env"});
const Station = require("../model/station");
const openData = require("../module/openData");

let dataRows = openData.getStationCostInfoDataFromCsv();
for (let i = 0; i < dataRows.length; i++) {
    let data = dataRows[i];
    Station.insert(data).then(() => console.log(data + '\n'))
        .catch(e => console.error(e));
}

console.log("======INIT DATABASE======");