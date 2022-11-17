const axios = require("axios");
const fs = require("fs");
const Batch = require("./batch");

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
        HDO: "현대오일뱅크",
        SOL: "S-OIL",
        SKE: "SK에너지",
        GSC: "GS칼텍스",
    }

    const list = res.data.RESULT.OIL;
    let data = [];
    for (let i = 0; i < list.length; i++) {
        const curr = list[i];
        data.push({
            "station_id": curr.UNI_ID,
            "brand": brandMap[curr.POLL_DIV_CD] || curr.POLL_DIV_CD,
            "name": curr.OS_NM,
            "price": curr.PRICE,
            "distance": curr.DISTANCE,
        })
    }

    return {type: oilCodeMap[oil_type].name, data};
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
    const data = JSON.parse(res);
    return {data};
}

module.exports = {
    getStationInfoData,
    getAverageCostInfoData,
    getNearStation,
    getYosoStation,
};