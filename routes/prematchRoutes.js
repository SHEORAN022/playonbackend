const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// 🔐 middlewares
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const { protectUser } = require("../middleware/auth");

// controllers
const {
  createPrematch,
  getAllPrematch,
  getSinglePrematch,
  updatePrematch,
  deletePrematch,
  toggleLive,
  getMatchesByCategory
} = require("../controllers/prematchController");

/* upload fields */
const cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "team1Logo", maxCount: 1 },
  { name: "team2Logo", maxCount: 1 },
  { name: "video", maxCount: 1 }
]);

/* ================= USER ROUTES (LOCK SYSTEM) ================= */

// 🔥 GET ALL (lock/unlock working)
router.get("/all", protectUser, getAllPrematch);

// 🔥 CATEGORY FILTER (lock working)
router.get("/category/:categoryId", protectUser, getMatchesByCategory);

// 🔓 SINGLE (no lock check needed)
router.get("/:id", getSinglePrematch);


/* ================= ADMIN ROUTES ================= */

// ➕ create
router.post("/create", protectAdmin, adminOnly, cpUpload, createPrematch);

// ✏️ update
router.put("/update/:id", protectAdmin, adminOnly, cpUpload, updatePrematch);

// ❌ delete
router.delete("/delete/:id", protectAdmin, adminOnly, deletePrematch);

// 🔴 toggle live
router.put("/live/:id", protectAdmin, adminOnly, toggleLive);

module.exports = router;