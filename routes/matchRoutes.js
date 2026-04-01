const express = require("express");
const router = express.Router();

const matchController = require("../controllers/matchController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* ================= PUBLIC ROUTES ================= */

// Get all matches
router.get("/", matchController.getAllMatches);

// Get matches by tournament
router.get("/tournament/:tournamentId", matchController.getMatchesByTournament);

// Get single match
router.get("/single/:id", matchController.getSingleMatch);


/* ================= ADMIN ROUTES ================= */

// Add match
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },       // ✅ FIXED
    { name: "team1Logo", maxCount: 1 },
    { name: "team2Logo", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  matchController.addMatch
);

// Update match
router.put(
  "/update/:id",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },       // ✅ F
    { name: "team1Logo", maxCount: 1 },
    { name: "team2Logo", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  matchController.updateMatch
);

// Delete match
router.delete(
  "/delete/:id",
  protectAdmin,
  adminOnly,
  matchController.deleteMatch
);

module.exports = router;
