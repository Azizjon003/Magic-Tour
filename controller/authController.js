const User = require("../models/userModel");

const catchError = require("../utility/catch");

const { promisify } = require("util");

const bcrypt = require("bcryptjs");

const appError = require("../utility/appError");

const jwt = require("jsonwebtoken");

const AppError = require("../utility/appError");

const mail = require("../utility/email");

const crypto = require("crypto");

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

  if (currentUser.modifyiedPasswordAfter(decode.iat)) {
    return next(
      new appError("User password has been changed. Please log in again", 401)
    );
  }
  console.log(currentUser);
  req.user = currentUser;
  next();
});

const roleTo = catchError(async (req, res, next) => {
  const roles = ["lead-guide", "admin"];
  console.log(req.user);
  if (!roles.includes(req.user.role)) {
    return next(new AppError("Sizning maqomingiz to'g'ri kelmaydi", 401));
  }

  next();
});

const forgotPassword = catchError(async (req, res, next) => {
  // 1 user bor yo'qligni tekshirish
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("email user not found", 404));
  }

  // 2 password uchun token yaratish
  //sylktzhggivvtjue
  const token = await user.createPasswordResetToken();

  user.save({ validateBeforeSave: false });
  // 3  emailga jo'natish passwordni

  await mail({
    email: user.email,
    subject: "Password reset token",
    message:
      "you are reset paswordLink is" +
      `    
      <a>${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/resetPassword/${token}.This link expires 10 minutes after it was sent.</a>`,
  });
  res.status(200).json({
    status: "success",
    message: "Token sent to email",
  });
});
const resetPassword = catchError(async (req, res, next) => {
  // 1 tokenni heshlab bazada bor yo'qligini tekshiramiz
  const token = req.params.token;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    hashToken: tokenHash,
    tokenExpires: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new AppError("reset token not or expires in", 400));
  }
  console.log(user);

  // 2 passwordni yangilash
  console.log(req.body);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.hashToken = undefined;
  user.tokenExpires = undefined;

  await user.save();

  const tokenNew = createToken(user._id);

  res.status(200).json({
    status: "success",
    token: tokenNew,
  });
});

const updatePassword = catchError(async (req, res, next) => {
  //  0  userning malumotlarini bazadan olamiz
  const user = await User.findById(req.params.id);
  // 1 parolni olamiz va uni shifrlaymiz

  if (!user) {
    return next(new AppError("This is user not found", 401));
  }

  // 2 parolni userning paroli bilan tekshirib ko'ramiz
  const userpass = req.body.currentPassword;
  const tekshir = async (passUser, passCollection) => {
    const tekshir = bcrypt.compare(passUser, passCollection);
    return tekshir;
  };

  if (!tekshir(userpass, user.password)) {
    return next(new AppError("This is password not confirm", 400));
  }

  // 3  yangi parolni o'rnatamiz va unga token beramiz

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  const tokenNew = createToken(user._id);

  res.status(200).json({
    status: "success",
    token: tokenNew,
  });
});
module.exports = {
  signUp,
  login,
  protect,
  roleTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
