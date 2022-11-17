const Station = require("../model/station");
const openData = require("../module/openData");
const db = require("../config/db");

const init = async () => {
    await db();
    const documentsCount = await Station.countDocuments();
    if(documentsCount > 0) {
        console.log("Already Filled");
        return;
    }
    let dataRows = await openData.getStationCostInfoDataFromCsv();
    for (let i = 0; i < dataRows.length; i++) {
        let data = dataRows[i];
        try {
            const station = new Station({
                station_id: data.station_id,
                region: data.region,
                name: data.name,
                address: data.address,
                brand: data.brand,
                isSelf: data.isSelf=="셀프"?true:false,
                price_premium_gasoline: data.price_premium_gasoline,
                price_gasoline: data.price_gasoline,
                price_diesel: data.price_diesel,
                price_kerosene: data.price_kerosene,
            });
            await station.save();
        } catch (err) {
            console.error(err);
        }
    }
    return;
}

module.exports = init;