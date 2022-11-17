const chromium = require("chrome-aws-lambda");
const AWS = require('aws-sdk');
const xlsx = require('xlsx');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const Station = require('../model/station');

const ROOT = __filename;
const TMP = path.join(path.join(ROOT, '..'), 'tmp');

const updateData = async () => {
    const browser = await chromium.puppeteer.launch({
        executablePath: await chromium.executablePath,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: true,
    });

    const page = await browser.newPage();


    const client = await page.target().createCDPSession()
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: TMP,
    });

    await page.goto(process.env.DATA_URL);
    const selector = '#priceInfoVO > div > div.mgt_5.t_left.mgb_30 > table > tbody > tr > td.fir.nobd_l.t_right > a:nth-child(1)';
    await (await page.$(selector)).click();
    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    await page.click('a');

    while (!fs.existsSync(TMP)) {
    }
    console.log("DIR CHECK OK")

    let flag = true;
    let files;
    while ((files = fs.readdirSync(TMP)).length == 0 || flag) {
        for (let file of files) {
            if (file.endsWith('xls')) flag = false;
        }
    }
    console.log("FILE CHECK OK")
    const filename = files[0].toString();
    const xlsFile = await xlsx.readFile(path.join(TMP, filename));
    let newFilename = filename.split('.')[0].split('-')[0].split(')')[1] + ".csv";
    await xlsx.writeFile(xlsFile, path.join(TMP, newFilename), {bookType: "csv"});
    await browser.close();
    console.log("RETURNED Filename : " + newFilename);
    return {csvName: newFilename, xlsName: filename};
}

const uploadData = async (newFilename) => {
    AWS.config.update({
        region: process.env.S3_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_ACCESS_SECRET
    });

    const filePath = path.join(TMP, newFilename);
    const data = fs.readFileSync(filePath, "utf-8");

    const S3 = new AWS.S3();
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: newFilename,
        Body: data,
        ContentType: "text/csv",
    };

    await S3.upload(params, (err, data) => {
        if (err)
            console.error(err);
    });
}

const sleep = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

const updateDatabase = async (data) => {
    try {
        await Station.updateOne({station_id: data.station_id},
            {
                price_premium_gasoline: data.price_premium_gasoline,
                price_gasoline: data.price_gasoline,
                price_diesel: data.price_diesel,
                price_kerosene: data.price_kerosene,
            });
    } catch (e) {
        console.error(e);
    }
};

const fetchToDatabase = async (filename) => {
    const filePath = path.join(TMP, filename);
    const xlsFile = await xlsx.readFile(filePath);
    const sheet = xlsFile.Sheets["현재 판매가격(주유소)"];
    let curr = 5;

    const ID = 'A';
    const REGION = 'B';
    const PR_GASOLINE = 'G';
    const GASOLINE = 'H';
    const DIESEL = 'I';
    const KEROSENE = 'J';

    while (true) {
        let station_id = sheet[ID + curr].w;
        let region = sheet[REGION + curr].w
        let price_premium_gasoline = sheet[PR_GASOLINE + curr].w;
        let price_gasoline = sheet[GASOLINE + curr].w;
        let price_diesel = sheet[DIESEL + curr].w;
        let price_kerosene = sheet[KEROSENE + curr].w;
        if (region.toString().split(" ")[0] != "서울") break;
        await updateDatabase({
            station_id,
            region,
            price_premium_gasoline,
            price_gasoline,
            price_diesel,
            price_kerosene
        });
        curr++;
    }

    fs.rmSync(TMP, {recursive: true, force: true});
};

const run = async () => {
    console.log("UPDATE DATA START");
    const {csvName, xlsName} = await updateData();
    console.log("UPLOAD S3 START");
    await uploadData(csvName);
    console.log("UPDATE DB START");
    await fetchToDatabase(xlsName);
}

module.exports = {run, updateData};
