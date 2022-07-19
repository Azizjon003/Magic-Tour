const Tours = require("../models/tourModel");

const FeatureAPI = require("../utility/feature");

const catchFunct = require("../utility/catch");
const getAllTours = catchFunct(async (req, res) => {
  const query = new FeatureAPI(req.query, Tours)
    .filter()
    .field()
    .sorting()
    .pagination();
 
  const tours = await query.databaseQuery;
  // next();
  res
    .status(200)
    .json({ status: "success", result: tours.length, data: tours });
});

const addTour = catchFunct(async (req, res) => {
  const data = req.body;

  const obj = await Tours.create(data);
  res.status(201).json({ status: "success", data: obj });
  // const newTourv = new Tour(data)
  // await newTourv.save()
});

const updateTour = catchFunct(async (req, res) => {
  const tour = await Tours.findByIdAndUpdate(req, params.id, req.body, {
    new: true,
    validate: true,
  });

  if (!tour) {
    throw new Error("bunaqa Id lik ma'lumot yuq");
  }

  res.status(200).json({ status: "success", data: tour });
});

const getIdTour = catchFunct(async (req, res) => {
  const obj = await Tours.findById(req.params.id);

  if (!obj) {
    throw new Error("bunaqa Id lik ma'lumot yuq");
  }
  res.status(200).json({ status: "success", data: obj });
});

const deleteTour = catchFunct(async (req, res) => {
  const obj = await Tours.findByIdByAndDelete(req.params.id);
  res.status(200).json({ status: "success", data: obj });
});

const tourStats = catchFunct(async (req, res) => {
  const data = await Tours.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    // {
    //   $group: {
    //     _id: { $toUpper: "$difficulty" },
    //     numberTours: { $sum: 1 },
    //     ortachaPrice: { $avg: "$price" },
    //     engarzon: { $min: "$price" },
    //     engQimat: { $max: "$price" },
    //     urtachaReyting: { $avg: "$ratingsAverage" },
    //   },
    // },
    // { $sort: { urtachaReyting: 1 } },
    // { $project: { _id: 0 } },
  ]);

  res.status(200).json({ status: "success", resultd: data.length, data: data });
});

const tourReportYear = catchFunct(async (req, res) => {
  const data = await Tours.aggregate([
    {
      $unwind: "$startDates",
    },
    // {
    //   $match: {
    //     startDates: {
    //       $gte: new Date(`${req.params.year}-01-01`),
    //       $lte: new Date(`${req.params.year}-12-31`),
    //     },
    //   },
    // },
    {
      $group: {
        _id: { $month: "$startDates" },
        turlarSoni: { $sum: 1 },
        TourNomi: { $push: "$name" },
      },
    },
    {
      $addFields: { qaysiOy: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      sort: { turlarSoni: -1 },
    },
  ]);
  res.status(200).json({ status: "succes", result: data.length, data: data });
});

module.exports = {
  getAllTours,
  addTour,
  updateTour,
  getIdTour,
  deleteTour,
  tourStats,
  tourReportYear,
};
