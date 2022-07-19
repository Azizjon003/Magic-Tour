const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name reuiqred"],
      minlength: [10, "10 elemnt kiriting"],
      maxlength: [40, "40 tadan elemnt kiriting"],
    },
    duration: {
      type: Number,
      required: true,
      min: [1, "past qiymat kiritdingiz"],
      max: [100, "BUndan ko'p qiymat kiritmang "],
    },
    maxGroupSize: {
      type: Number,
      default: 5,
      validate: {
        validator: function (val) {
          if (val > 0 && Number.isInteger(val)) return true;
          else return false;
        },
        message: "Natural son kiriting",
      },
    },

    difficulty: {
      type: String,
      required: true,
      default: "easy",
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Siz xato ma'lumot kiritdingiz",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 5,
    },
    ratingsQuantity: Number,
    price: {
      type: Number,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    imageCover: {
      type: String,
      default: "images/userdefault.jpg",
    },
    images: {
      type: Array,
      body: String,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("hafta").get(function () {
  return this.duration / 7;
});
tourSchema.pre("save", function (next) {
  this.name = this.name + " azizjon";
  this.date = Date.now();
  next();
});
tourSchema.post("save", function (doc, next) {
  console.log(doc.date - Date.now());
  next();
});
// tourSchema.pre("find", function (next) {}); // tourSchema.pre("find", function (next) {});
const Tours = mongoose.model("Tours", tourSchema);

module.exports = Tours;
