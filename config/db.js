require("dotenv").config();
const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect(process.env.DB_URI);

    const db = mongoose.connection;

    db.on("error", (error) => console.log("❗ DB Error", error));
    db.once("open", () => console.log("✅ Connected to DB!"));
}
