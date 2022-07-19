// /* eslint-disable */
// const tour5 = {
//   id: 5,
//   name: 'The Sports Lover',
//   startLocation: 'California, USA',
//   nextStartDate: 'July 2021',
//   duration: 14,
//   maxGroupSize: 8,
//   difficulty: 'difficult',
//   avgRating: 4.7,
//   numReviews: 23,
//   regPrice: 2997,
//   shortDescription:
//     'Surfing, skating, parajumping, rock climbing and more, all in one tour',
//   longDescription:
//     'Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\nVoluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur!'
// };

const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});
const mongoose = require("mongoose");
const tours = require("./../../models/tourModel");
const fs = require("fs");

const db =
  "mongodb+srv://azizjon:azizjon2003@magictour.t8uky.mongodb.net/MagicTourA?retryWrites=true&w=majority";
console.log(db);
mongoose
  .connect(db)
  .then(() => {
    console.log("Connect");
  })
  .catch((err) => console.log(err.message));

const data = JSON.parse(
  fs.readFileSync(`./dev-data/data/tours-simple.json`, "utf-8")
);

const addData = async () => {
  try {
    const add = await tours.create(data);
    console.log("ishladi");
  } catch (err) {
    console.log(err.message);
  }
};

const deleteData = async () => {
  try {
    const add = await tours.deleteMany(data);
    console.log("albubasfals");
  } catch (err) {
    console.log(err.message);
  }
};
addData();
