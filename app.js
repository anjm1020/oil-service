const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cron = require("cron");

const init = require("./module/init");
const batch = require("./module/batch");
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

app.listen(process.env.SERVER_PORT, () => {
    console.log("server start");

    init().then(() => console.log("Init Database Complete"));
    cron.job('0 0 0 * * *', () => {
        batch()
            .then(() => console.log("Batch jobs complete\n"))
            .catch(e => console.error(e));
    }).start();
});
