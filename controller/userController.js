const User = require("../models/userModel");

const catchError = require("../utility/catch");
const getAllUsers = async (req, res) => {
  try {
    // basic filter
    // 1-u
    // const filter =

    const data = await User.find();
    res.status(200).json({
      results: data.length,
      status: "success",
      data: data,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

const addUser = async (req, res) => {
  try {
    const data = await User.create(req.body);

    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (err) {
    res.status("404").json({
      status: "fail",
      message: err.message,
    });
  }
};

const getUserId = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);

    res.status(200).json({ status: "OK", data: data });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json({
      status: "success",
      data: data,
    });
  } catch (err) {
    res.status("404").json({ status: "fail", message: err.message });
  }
};

const deleteUser = catchError(async (req, res, next) => {
  const data = await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "OK",
    message: "Uchirildi",
  });
});

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getUserId,
};
