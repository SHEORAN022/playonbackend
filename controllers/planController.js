const Plan = require("../models/Plan");


/* ================================
   GET ALL PLANS (Frontend Use)
================================ */

exports.getPlans = async (req, res) => {
  try {

    const plans = await Plan.find({ status: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: plans.length,
      data: plans
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* ================================
   GET SINGLE PLAN
================================ */

exports.getSinglePlan = async (req, res) => {
  try {

    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    res.json({
      success: true,
      data: plan
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* ================================
   CREATE PLAN
================================ */

exports.createPlan = async (req, res) => {
  try {

    const { title, description, options, features } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    if (!options || options.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Plan options required"
      });
    }

    const plan = await Plan.create({
      title,
      description,
      options,
      features
    });

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ================================
   UPDATE PLAN
================================ */

exports.updatePlan = async (req, res) => {
  try {

    const { title, description, options, features, status } = req.body;

    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    if (title) plan.title = title;
    if (description) plan.description = description;
    if (options) plan.options = options;
    if (features) plan.features = features;
    if (status !== undefined) plan.status = status;

    await plan.save();

    res.json({
      success: true,
      message: "Plan updated successfully",
      data: plan
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ================================
   DELETE PLAN
================================ */

exports.deletePlan = async (req, res) => {
  try {

    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    await plan.deleteOne();

    res.json({
      success: true,
      message: "Plan deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ================================
   TOGGLE PLAN STATUS
================================ */

exports.togglePlanStatus = async (req, res) => {
  try {

    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    plan.status = !plan.status;

    await plan.save();

    res.json({
      success: true,
      message: "Plan status updated",
      data: plan
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};