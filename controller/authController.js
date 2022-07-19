const User = require("../models/userModel");
const catchError = require("../utility/catch");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const appError = require("../utility/appError");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const signUp = catchError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo,
    passwordChangeDate: req.body.passwordChangeDate,
    role: req.body.role,
  });

  const token = createToken(newUser._id);

  res.status(200).json({
    status: "success",
    data: newUser,
    token: token,
  });
});

const login = catchError(async (req, res, next) => {
  const { email, password } = { ...req.body };
  if (!email || !password) {
    return next(new appError("email yoki parol kiritilishi shart", 404));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new appError("bunaqa user yo'q", 404));
  }

  const tekshirHashga = async (oddiyPassword, hashPassword) => {
    const tekshir = await bcrypt.compare(oddiyPassword, hashPassword);
    return tekshir;
  };

  if (!(await tekshirHashga(password, user.password))) {
    return next(
      new appError(
        "Sizning parol yoki loginingiz xato! Iltimos qayta urinib kuring!",
        401
      )
    );
  }
  const token = createToken(user.id);

  res.status(200).json({
    status: "success",
    token: token,
  });
});

const protect = catchError(async (req, res, next) => {
  // 1) Token bor yuqligini headerdan tekshirish
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2 tokenni tekshirish

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decode);

  //   3 User bor yuqligini db dan tekshirish
  const currentUser = await User.findById(decode.id);

  if (!currentUser) {
    return next(new appError("User not found", 401));
  }

  // 4) parol almashganini tekshirish

  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new appError("User password has been changed. Please log in again", 401)
    );
  }

  next();
});

module.exports = {
  signUp,
  login,
  protect,
};
