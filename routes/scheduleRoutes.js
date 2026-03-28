const express = require("express");
const router = express.Router();

const scheduleCtrl = require("../controllers/scheduleController");

// 🔐 middlewares
const { protectAdmin } = require("../middleware/authMiddleware");
const { protectUser } = require("../middleware/auth");

const upload = require("../middleware/upload");


/* ================= USER ROUTES (LOCK ENABLED) ================= */

// 🔓 Get all schedules (LOCK / UNLOCK working)
router.get(
  "/all",
  protectUser,
  scheduleCtrl.getSchedule
);

// 🔓 Category wise (LOCK working)
router.get(
  "/category/:categoryId",
  protectUser,
  scheduleCtrl.getScheduleByCategory
);

// 🔓 Single schedule (no lock check)
router.get(
  "/single/:id",
  scheduleCtrl.getSingleSchedule
);



/* ================= ADMIN ROUTES ================= */

// ➕ Add schedule
router.post(
  "/add",
  protectAdmin,
  upload.any(),
  scheduleCtrl.addSchedule
);

// ✏️ Update schedule
router.put(
  "/update/:id",
  protectAdmin,
  upload.any(),
  scheduleCtrl.updateSchedule
);

// ❌ Delete schedule
router.delete(
  "/delete/:id",
  protectAdmin,
  scheduleCtrl.deleteSchedule
);
router.put(
  "/toggle-live",
  protectAdmin,
  scheduleCtrl.toggleLive
);




module.exports = router;