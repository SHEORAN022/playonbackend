const express = require("express");
const router = express.Router();

const {
  getPlans,
  getSinglePlan,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus
} = require("../controllers/planController");

// ✅ correct middleware import
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");

// public routes
router.get("/", getPlans);
router.get("/:id", getSinglePlan);

// admin routes
router.post("/create", protectAdmin, adminOnly, createPlan);
router.put("/:id", protectAdmin, adminOnly, updatePlan);
router.delete("/:id", protectAdmin, adminOnly, deletePlan);
router.put("/toggle/:id", protectAdmin, adminOnly, togglePlanStatus);

module.exports = router;