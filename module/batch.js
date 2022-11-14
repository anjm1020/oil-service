require("dotenv").config();

const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const S3 = require("../config/objectStorage");
const db = require("../config/db");

const deleteOldFile = async () => {
    const fileIdentifier = dayjs().format("YYYY-MM-DD").subtract(1, 'day') + ".csv";
    const filePath = path.join(__dirname, path.join("csv", fileIdentifier));
    fs.unlink(filePath, (err) => {
        console.error(err);
    });
}

const loadOldDataFile = () => {
    const fileIdentifier = dayjs().format("YYYY-MM-DD").subtract(-1,'day') + ".csv";
    const filePath = path.join(__dirname, path.join("csv", fileIdentifier));
    const fileContent = fs.readFileSync(filePath);
    return fileContent;
}

const rollingDataFile = async () => {
    let key = dayjs().format("YYYY-MM-DD");
    key += "/data.csv";

    // api call 제한으로 csv 파일로 대체
    const fileContent = loadOldDataFile();
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: "text/csv",
    };

    await S3.upload(params, (err, data) => {
        if (err)
            console.error(err);
        else
            console.log(data);
    });
};

const getNewDataFile = () => {
    // api 동기화 x
}

const fetchDataFile = () => {
    const query = `UPDATE stations SET
    price_premium_gasoline = ?,
    price_gasoline = ?,
    price_diesel = ?,
    price_kerosene = ?
    WHERE station_id =?
    `;

    const fileIdentifier = dayjs().format("YYYY-MM-DD") + ".csv";
    const filePath = path.join(__dirname, path.join("csv", fileIdentifier));
    const data = fs.readFileSync(filePath, "utf-8");

    const rows = data.split("\r\n");
    let curr = 4;

    const ID = 0;
    const REGION = 1;
    const PR_GASOLINE = 6;
    const GASOLINE = 7;
    const DIESEL = 8;
    const KEROSENE = 9;

    while (curr < rows.length) {
        const curr_row = rows[curr].split(",");
        if (curr_row[REGION].split(" ")[0] != "서울") {
            break;
        }
        db.query(query,
            [curr_row[PR_GASOLINE], curr_row[GASOLINE], curr_row[DIESEL], curr_row[KEROSENE], curr_row[ID]],
            (err, rows) => {
                if (err)
                    console.error(err);
            });
        curr++;
    }
    console.log("end");
}

const batch = async () => {
    try{
        await rollingDataFile();
        await deleteOldFile();
        await getNewDataFile();
        await fetchDataFile();
    } catch (e) {
        console.error(e);
    }
}

module.exports = batch;
