const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const validators = require("validator");

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
  resetTokenHash: String,
  resetTokenVaqti: Date,
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

const User = mongoose.model("Users", UserSchema);

module.exports = User;
