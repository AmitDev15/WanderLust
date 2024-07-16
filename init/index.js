const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listingModel");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
}

main().catch((err) => console.log(err));

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6675bf9fe671421295a87efd",
  }));
  await Listing.insertMany(initData.data);
  console.log("Database initialized");
};

initDb().catch((err) => console.log(err));
