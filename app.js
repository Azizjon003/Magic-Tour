const express = require("express");
const TourRouter = require("./routes/tourRoute");
const UserRoute = require("./routes/userRouter");
const AppError = require("./utility/appError");
const errController = require("./controller/errorController");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use(express.static(`public`));
// app.use("/api/v1/tours", (req, res, next) => {
//   req.time = Date.now();
//   next();
// });

app.use("/api/v1/tours", TourRouter);
app.use("/api/v1/users", UserRoute);

app.all("*", function (req, res, next) {
  // const err = {
  //   statusCode: 404,
  //   status: "Fail",
  //   message: `bunaqa page yuq ${req.originalUrl}`,
  // };

  next(new AppError(`bunaqa page yuq ${req.originalUrl}`, 404));
  // res.status(404).json({ status: "fail", message: "Page not found" });
});

app.use(errController);
// console.log(process.env);
// app.get("/api/v1/tours", getAllTours);

// app.get("/api/v1/tour/:name", getidTour);

// app.post("/api/v1/tours", addTour);

// app.patch("/api/v1/tours/:id", updateTour);

// app.delete("/api/v1/tours/:id", deleteTour);
module.exports = app;
