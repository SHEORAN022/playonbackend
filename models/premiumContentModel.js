const mongoose = require("mongoose");

/* ===============================
   PREMIUM FEATURE SCHEMA
================================*/
const premiumFeatureSchema = new mongoose.Schema(
  {
    icon: {
      type: String, // Flutter icon name
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* ===============================
   PREMIUM CONTENT SCHEMA
================================*/
const premiumContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    imagePath: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      required: true,
    },

    videoUrl: {
      type: String,
      default: null,
      trim: true,
    },

    features: {
      type: [premiumFeatureSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PremiumContent", premiumContentSchema);