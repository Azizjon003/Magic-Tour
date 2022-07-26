const express = require("express");
const obj = require("../controller/tourController");
const TourRouter = express.Router();
const Auth = require("../controller/authController");
// TourRouter.param("id", obj.chekId);

TourRouter.use(
  "/the-best-4-tours",
  (req, res, next) => {
    req.query.sort = "-price";
    req.query.limit = 4;
    next();
  },
  obj.getAllTours
);
TourRouter.route("/stats").get(obj.tourStats);
TourRouter.route("/report").get(obj.tourReportYear);
TourRouter.route("/").get(Auth.protect, obj.getAllTours).post(obj.addTour);
TourRouter.route("/:id")
  .get(obj.getIdTour)
  .patch(obj.updateTour)
  .delete(Auth.protect, Auth.roleTo, obj.deleteTour);

module.exports = TourRouter;
