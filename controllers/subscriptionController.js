const Subscription = require("../models/Subscription");
const User = require("../models/User");


/* ================= MY SUBSCRIPTION (USER) ================= */
exports.mySubscription = async (req, res) => {
  try {

    const sub = await Subscription.findOne({
      user: req.user.id,
      status: "active"
    }).populate("plan");

    if (!sub) {
      return res.json({
        active: false,
        message: "No active subscription"
      });
    }

    // expiry check
    if (sub.endDate && sub.endDate < new Date()) {
      sub.status = "expired";
      await sub.save();

      return res.json({
        active: false,
        message: "Subscription expired"
      });
    }

    res.json({
      active: true,
      subscription: sub
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= ALL SUBSCRIPTIONS (ADMIN) ================= */
exports.allSubscriptions = async (req, res) => {
  try {

    const subs = await Subscription.find()
      .populate({
        path: "user",
        select: "-password" // password hide
      })
      .populate("plan")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: subs.length,
      subscriptions: subs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= SINGLE SUBSCRIPTION DETAILS ================= */
exports.subscriptionDetails = async (req, res) => {
  try {

    const sub = await Subscription.findById(req.params.id)
      .populate({
        path: "user",
        select: "-password"
      })
      .populate("plan");

    if (!sub) {
      return res.status(404).json({
        message: "Subscription not found"
      });
    }

    res.json({
      success: true,
      subscription: sub
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= DELETE SUBSCRIPTION (ADMIN) ================= */
exports.deleteSubscription = async (req, res) => {
  try {

    const sub = await Subscription.findById(req.params.id);

    if (!sub) {
      return res.status(404).json({
        message: "Subscription not found"
      });
    }

    await sub.deleteOne();

    res.json({
      success: true,
      message: "Subscription deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= ADMIN DASHBOARD ================= */
exports.adminDashboard = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalSubscriptions = await Subscription.countDocuments();

    const activeSubscriptions = await Subscription.countDocuments({
      status: "active"
    });

    const expiredSubscriptions = await Subscription.countDocuments({
      status: "expired"
    });

    const revenue = await Subscription.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      totalRevenue: revenue[0]?.total || 0
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ================= CREATE SUBSCRIPTION ================= */
exports.createSubscription = async (req, res) => {
  try {

    const { planId, amount, orderId, paymentId, duration } = req.body;

    // check existing active subscription
    const existing = await Subscription.findOne({
      user: req.user.id,
      status: "active"
    });

    if (existing) {
      return res.status(400).json({
        message: "User already has an active subscription"
      });
    }

    const startDate = new Date();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    const subscription = await Subscription.create({
      user: req.user.id,
      plan: planId,
      orderId,
      paymentId,
      amount,
      status: "active",
      startDate,
      endDate
    });

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      subscription
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};