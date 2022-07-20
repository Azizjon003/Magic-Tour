const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const validators = require("validator");
const AppError = require("../utility/appError");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    minlength: 8,
    maxlength: 50,
    unique: true,
    required: true,
    validate: {
      validator: function (val) {
        return validators.isEmail(val);
      },
      message: "Emailni to'g'ri kiriting",
    },
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 80,
    required: true,
    validate: {
      validator: function (val) {
        return validators.isStrongPassword(val);
      },
      message: "Password must be strong password",
    },
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "guide", "team-lead", "admin"],
    default: "user",
  },
  passwordConfirm: {
    type: String,
    minlength: 8,
    maxlength: 80,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Siz bit xil parol kiriting",
    },
    required: true,
  },
  passwordChangeDate: {
    type: Date,
    default: null,
  },
  hashToken: String,
  tokenExpires: Date,
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.modifyiedPasswordAfter = function (jwtExpiresIn) {
  if (this.passwordChangeDate) {
    const pass = this.passwordChangeDate.getTime() / 1000;
    return jwtExpiresIn < pass;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const HashToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.hashToken = HashToken;
  this.tokenExpires = Date.now() + 10 * 60 * 1000;
  console.log(`reset token ${resetToken}`);
  console.log(`hash token ${HashToken}`);
  return resetToken;
};

UserSchema.pre("save", function (next) {
  if (!this.isModified(this.password) || this.IsNew) return next();
  this.passwordChangeDate = Date.now() - 1000;
  next();
});
const User = mongoose.model("Users", UserSchema);

module.exports = User;
