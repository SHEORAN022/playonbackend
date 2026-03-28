const mongoose = require("mongoose");

/* ===============================
   FEATURE SCHEMA
================================*/
const premiumFeatureSchema = new mongoose.Schema(
  {
    icon: {
      type: String, // e.g. "lock", "star", etc
      required: true,
      trim: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

/* ===============================
   MAIN SCHEMA
================================*/
const premiumContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    imagePath: {
      type: String,
      required: true,
      trim: true
    },

    // 🔥 FIX: ObjectId instead of String
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    discount: {
      type: Number,
      required: true,
      min: 0
    },

    videoUrl: {
      type: String,
      default: null,
      trim: true
    },

    /* 🔐 LOCK SYSTEM */
    isPremium: {
      type: Boolean,
      default: true
    },

    requiredPlan: {
      type: String,
      enum: ["Ads Free", "Ads Free + Content Free", null],
      default: null
    },

    /* 🧾 FEATURES */
    features: {
      type: [premiumFeatureSchema],
      default: []
    },

    /* 🔥 STATUS CONTROL (optional but useful) */
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("PremiumContent", premiumContentSchema);