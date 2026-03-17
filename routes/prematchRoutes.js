const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createPrematch,
  getAllPrematch,
  getSinglePrematch,
  updatePrematch,
  deletePrematch,
  toggleLive,
  getMatchesByCategory
} = require("../controllers/prematchController");

const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");

/* upload fields */
const cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "team1Logo", maxCount: 1 },
  { name: "team2Logo", maxCount: 1 },
  { name: "video", maxCount: 1 } // ✅ ADD THIS
]);

// admin create
router.post("/create", protectAdmin, adminOnly, cpUpload, createPrematch);

// get all
router.get("/all", getAllPrematch);

// category wise matches
router.get("/category/:categoryId", getMatchesByCategory);

// single
router.get("/:id", getSinglePrematch);

// update
router.put("/update/:id", protectAdmin, adminOnly, cpUpload, updatePrematch);

// delete
router.delete("/delete/:id", protectAdmin, adminOnly, deletePrematch);

// live toggle
router.put("/live/:id", protectAdmin, adminOnly, toggleLive);

module.exports = router;