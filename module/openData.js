require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getStationInfoData = async () => {
    const URL = process.env.API_STATION_URL;
    const config = {
        params: {
            page: 1,
            perPage: 500,
            serviceKey: process.env.API_DATA_KEY,
        }
    };
    const res = await axios.get(URL, config);
    return {data: res.data.data, count: res.data.totalCount};
}

const getAverageCostInfoData = async () => {
    const URL = process.env.API_AVERAGE_COST_URL;
    console.log(URL);
    const config = {
        params: {
            code: process.env.API_OIL_KEY,
            out: "json",
            sido: "01"
        }
    };
    const res = await axios.get(URL, config);
    return {data: res.data.RESULT.OIL};
}

const getStationCostInfoDataFromCsv = () => {
    const FNAME = process.env.CSV_NAME_STATION_COST;
    const csvPath = path.join(__dirname, 'csv', FNAME + ".csv");
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

console.log(getStationCostInfoDataFromCsv());
const getNearStation = async (params) => {
    const {x, y, oil_type, sort} = params;
    const URL = process.env.API_NEAR_STATION_URL;
    const oilCodeMap = {
        pg: {code: "B034", name: "고급휘발유"},
        g: {code: "B027", name: "휘발유"},
        d: {code: "D047", name: "경유"},
        k: {code: "C004", name: "등유"}
    };
    const config = {
        params: {
            code: process.env.API_OIL_KEY,
            out: "json",
            x,
            y,
            radius: 5000,
            prodcd: oilCodeMap[oil_type].code,
            sort,
        }
    };
    const res = await axios.get(URL, config);

    const brandMap = {
        HDO : "현대오일뱅크",
        SOL : "S-OIL",
        SKE : "SK에너지",
        GSC : "GS칼텍스",
    }

    const list = res.data.RESULT.OIL;
    let data = [];
    for (let i = 0; i < list.length; i++) {
        const curr = list[i];
        data.push({
            "station_id" : curr.UNI_ID,
            "brand": brandMap[curr.POLL_DIV_CD] || curr.POLL_DIV_CD,
            "name" : curr.OS_NM,
            "price" : curr.PRICE,
            "distance" : curr.DISTANCE,
        })
    }

    return {type:oilCodeMap[oil_type].name, data};
}

const getYosoStation = async () => {
    const URL = process.env.API_YOSO_STATION_URL;
    const config = {
        params: {
            code: process.env.API_OIL_KEY,
            out: "json",
            area: "01"
        }
    };
    const res = await axios.get(URL, config);
    console.log(res);
    const data = JSON.parse(res);
    console.log(data);
    return {data};
}

module.exports = {
    getStationInfoData,
    getAverageCostInfoData,
    getStationCostInfoDataFromCsv,
    getNearStation,
    getYosoStation,
};