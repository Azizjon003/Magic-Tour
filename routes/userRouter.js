const express = require("express");
const obj = require("../controller/userController");
const auth = require("../controller/authController");
const userRoute = express.Router();

userRoute.route("/signup").post(auth.signUp);
userRoute.route("/signin").post(auth.login);
userRoute.route("/forgotpasword").post(auth.forgotPassword);
userRoute.route("/resetpassword/:token").patch(auth.resetPassword);
// userRoute.route("/forgotpassword").post(auth.forgotpassword);
userRoute.route("/").get(obj.getAllUsers).post(obj.addUser);
userRoute
  .route("/:id")
  .get(obj.getUserId)
  .patch(obj.updateUser)
  .delete(obj.deleteUser);

module.exports = userRoute;
