const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const db='mongodb+srv://jawadshah:Gcp12345@helping-hands-cluster.aobnoad.mongodb.net/doctor-appointment'
const client = mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log("Error: ", error);

    return error;
  });

module.exports = client;
