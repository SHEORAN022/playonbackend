

const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});


/* ================= CREATE ORDER ================= */
exports.createOrder = async (req, res) => {
  try {
    const { planId, optionId } = req.body;

    if (!planId || !optionId) {
      return res.status(400).json({
        success: false,
        message: "planId and optionId required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid planId"
      });
    }

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    const option = plan.options.id(optionId);

    if (!option) {
      return res.status(404).json({
        success: false,
        message: "Plan option not found"
      });
    }

    // Razorpay order create
    const order = await razorpay.orders.create({
      amount: option.price * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    // Create pending subscription
    await Subscription.create({
      user: req.user.id,
      plan: plan._id,
      optionId: option._id,
      duration: option.duration,
      orderId: order.id,
      amount: option.price,
      status: "pending"
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: option.price,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= VERIFY PAYMENT ================= */
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment data"
      });
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // Activate subscription
    const subscription = await Subscription.findOneAndUpdate(
      { orderId, status: "pending" },
      { $set: { status: "active", paymentId } },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found or already processed"
      });
    }

    if (!subscription.duration) {
      return res.status(500).json({
        success: false,
        message: "Subscription duration missing"
      });
    }

    // Set start & expiry
    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + subscription.duration * 24 * 60 * 60 * 1000
    );

    subscription.startDate = startDate;
    subscription.endDate = endDate;

    await subscription.save();

    res.json({
      success: true,
      message: "Payment successful & subscription activated"
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= MY SUBSCRIPTION ================= */
exports.mySubscription = async (req, res) => {
  try {

    const sub = await Subscription.findOne({
      user: req.user.id,
      status: "active"
    })
      .sort({ createdAt: -1 })
      .populate("plan");

    if (!sub) {
      return res.json({
        active: false,
        message: "No active subscription"
      });
    }

    // Expiry check
    if (sub.endDate && sub.endDate < new Date()) {
      sub.status = "expired";
      await sub.save();

      return res.json({
        active: false,
        message: "Subscription expired"
      });
    }

    res.json({
      success: true,
      active: true,
      subscription: sub
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};