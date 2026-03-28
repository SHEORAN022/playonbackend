const express = require("express");
const router = express.Router();

const tournamentController = require("../controllers/tournamentController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const { protectUser } = require("../middleware/auth");
const upload = require("../middleware/upload");


/* ================= USER ROUTES ================= */

// 🔓 Get all active tournaments
router.get("/", protectUser, tournamentController.getAllTournaments);

// 🔓 Get tournaments by category
router.get("/category/:categoryId", tournamentController.getTournamentsByCategory);

// 🔐 Get single tournament (LOCK SYSTEM)
// router.get("/:id", protectUser, tournamentController.getSingleTournament);
router.get("/:id", tournamentController.getSingleTournament);



/* ================= ADMIN ROUTES ================= */

// ➕ Add tournament
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  upload.single("image"),
  tournamentController.addTournament
);

// ✏️ Update tournament
router.put(
  "/update/:id",
  protectAdmin,
  adminOnly,
  upload.single("image"),
  tournamentController.updateTournament
);

// ❌ Delete tournament
router.delete(
  "/delete/:id",
  protectAdmin,
  adminOnly,
  tournamentController.deleteTournament
);

// 🔥 Toggle Premium
router.patch(
  "/premium/:id",
  protectAdmin,
  adminOnly,
  tournamentController.togglePremium
);

module.exports = router;