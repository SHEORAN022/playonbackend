const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true
  },

  optionId: {
    type: mongoose.Schema.Types.ObjectId
  },

  duration: {
    type: Number
  },

  orderId: String,
  paymentId: String,

  amount: Number,

  status: {
    type: String,
    enum: ["pending", "active", "failed", "expired"],
    default: "pending"
  },

  startDate: Date,
  endDate: Date

}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);