const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getStationInfoData = async () => {
    const URL = "https://api.odcloud.kr/api/15098386/v1/uddi:eb2dd0b5-0cb9-4e99-b0a5-971648aece86";
    const config = {
        params: {
            page: 1,
            perPage: 500,
            serviceKey: "d/ZfrEObMBCElwxZURE104AzE7YyD5NVehQcE3OUfjzrqBUJHkngUv8r185rUfgOpIokHyJ31MxBg5Wo2IQMUw=="
        }
    };
    const res = await axios.get(URL, config);
    return {data: res.data.data, count: res.data.totalCount};
}

const getAverageCostInfoData = () => {
    const FNAME = "average.csv";
    const csvPath = path.join(__dirname, 'csv', FNAME);
    const data = fs.readFileSync(csvPath, "utf-8");

    const TODAY = 2;
    const rows = data.split("\r\n");
    const row = rows[TODAY].split(",");

    console.log(rows[0].split(",")[0]);

    return {
        average_price_premium_gasoline: row[1],
        average_price_gasoline: row[2],
        average_price_diesel: row[3],
        average_price_kerosene: row[4],
    };
}

const getStationCostInfoData = () => {
    const FNAME = "individual.csv";
    const csvPath = path.join(__dirname, 'csv', FNAME);
    const data = fs.readFileSync(csvPath, "utf-8");

    const rows = data.split("\r\n");
    let curr = 4;

    const ID = 0;
    const REGION = 1;
    const NAME = 2;
    const ADDRESS = 3;
    const BRAND = 4;
    const SELF = 5;
    const PR_GASOLINE = 6;
    const GASOLINE = 7;
    const DIESEL = 8;
    const KEROSENE = 9;

    let res = [];
    while (curr < rows.length) {
        const curr_row = rows[curr].split(",");
        if (curr_row[REGION].split(" ")[0] != "서울") {
            break;
        }
        res.push({
            station_id: curr_row[ID],
            region: curr_row[REGION],
            name: curr_row[NAME],
            address: curr_row[ADDRESS],
            brand: curr_row[BRAND],
            isSelf: curr_row[SELF],
            price_premium_gasoline: curr_row[PR_GASOLINE],
            price_gasoline: curr_row[GASOLINE],
            price_diesel: curr_row[DIESEL],
            price_kerosene: curr_row[KEROSENE],
        });
        curr++;
    }

    return res;
}

module.exports = {
    getStationInfoData,
    getAverageCostInfoData,
    getStationCostInfoData,
};