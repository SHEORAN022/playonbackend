const express = require("express");
const router = express.Router();

const tournamentController = require("../controllers/tournamentController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");


/* ================= PUBLIC ROUTES ================= */

// Get all tournaments
router.get("/", tournamentController.getAllTournaments);

// Get tournaments by category
router.get("/category/:categoryId", tournamentController.getTournamentsByCategory);

// Get single tournament
router.get("/:id", tournamentController.getSingleTournament);



/* ================= ADMIN ROUTES ================= */

// Add tournament
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  upload.single("image"),
  tournamentController.addTournament
);

// Update tournament
router.put(
  "/update/:id",
  protectAdmin,
  adminOnly,
  upload.single("image"),
  tournamentController.updateTournament
);

// Delete tournament
router.delete(
  "/delete/:id",
  protectAdmin,
  adminOnly,
  tournamentController.deleteTournament
);

module.exports = router;