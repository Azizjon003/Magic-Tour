const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

process.on("uncaughtException", (err) => {
  console.log("Error name  " + err.name, "Error message" + err.message);
  process.exit(1);
});
const app = require("./app");

const mongoose = require("mongoose");
const db = process.env.DATABASE.replace("<password>", process.env.PASSWORD);

mongoose.connect(db, {}).then(() => {
  console.log("connect");
});

// console.log(testTour);
const PORT = process.env.PORT || 1600;
const URL = process.env.SERVER_URL;
app.listen(PORT, URL, () => {
  console.log(`server ishga tushdi  port:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Error name  " + err.name, "Error message" + err.message);
  process.exit(1);
});
