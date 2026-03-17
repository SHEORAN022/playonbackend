const express = require("express");
const router = express.Router();

const scheduleCtrl = require("../controllers/scheduleController");
const { protectAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");


/* ================= ADMIN ROUTES ================= */

// add schedule (with images)
router.post(
  "/add",
  protectAdmin,
  upload.any(),
  scheduleCtrl.addSchedule
);

// update schedule
router.put(
  "/update/:id",
  protectAdmin,
  upload.any(),
  scheduleCtrl.updateSchedule
);

// delete schedule
router.delete(
  "/delete/:id",
  protectAdmin,
  scheduleCtrl.deleteSchedule
);


/* ================= PUBLIC ROUTES ================= */

// get all schedules
router.get("/all", scheduleCtrl.getSchedule);

// get schedules by category
router.get("/category/:categoryId", scheduleCtrl.getScheduleByCategory);

// get single schedule
router.get("/single/:id", scheduleCtrl.getSingleSchedule);


module.exports = router;