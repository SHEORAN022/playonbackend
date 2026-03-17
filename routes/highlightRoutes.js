

const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/matchHighlightController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");

/* ============ ADMIN ============ */
router.post("/add", protectAdmin, adminOnly, ctrl.addHighlight);
router.put("/update/:id", protectAdmin, adminOnly, ctrl.updateHighlight);
router.delete("/delete/:id", protectAdmin, adminOnly, ctrl.deleteHighlight);
router.put("/toggle-live/:id", protectAdmin, adminOnly, ctrl.toggleLive);

/* ============ PUBLIC ============ */
router.get("/all", ctrl.getAllHighlights);

router.get("/category/:categoryId", ctrl.getHighlightsByCategory);  // ⭐ moved above

router.get("/:id", ctrl.getSingleHighlight);

router.put("/add-viewer/:id", ctrl.addViewer);

module.exports = router;