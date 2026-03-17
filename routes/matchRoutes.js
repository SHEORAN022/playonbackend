const express = require("express");
const router = express.Router();

const matchController = require("../controllers/matchController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");


// Public
router.get("/", matchController.getAllMatches);
router.get("/tournament/:tournamentId", matchController.getMatchesByTournament);
router.get("/:id", matchController.getSingleMatch);


// Admin
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "imageUrl", maxCount: 1 },
    { name: "team1Logo", maxCount: 1 },
    { name: "team2Logo", maxCount: 1 }
  ]),
  matchController.addMatch
);

router.put(
  "/:id",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "imageUrl", maxCount: 1 },
    { name: "team1Logo", maxCount: 1 },
    { name: "team2Logo", maxCount: 1 }
  ]),
  matchController.updateMatch
);

router.delete("/:id", protectAdmin, adminOnly, matchController.deleteMatch);

module.exports = router;