const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ["Ads Free", "Ads Free + Content Free"]
    },

    description: String,

    options: [optionSchema],

    features: [String],

    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);