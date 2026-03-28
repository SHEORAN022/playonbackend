

// const express = require("express");
// const router = express.Router();

// const ctrl = require("../controllers/matchHighlightController");
// const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");

// /* ============ ADMIN ============ */
// router.post("/add", protectAdmin, adminOnly, ctrl.addHighlight);
// router.put("/update/:id", protectAdmin, adminOnly, ctrl.updateHighlight);
// router.delete("/delete/:id", protectAdmin, adminOnly, ctrl.deleteHighlight);
// router.put("/toggle-live/:id", protectAdmin, adminOnly, ctrl.toggleLive);

// /* ============ PUBLIC ============ */
// router.get("/all", ctrl.getAllHighlights);

// router.get("/category/:categoryId", ctrl.getHighlightsByCategory);  // ⭐ moved above

// router.get("/:id", ctrl.getSingleHighlight);

// router.put("/add-viewer/:id", ctrl.addViewer);

// module.exports = router;




const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/matchHighlightController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* ================= ADMIN ================= */

// 🔥 ADD HIGHLIGHT (IMAGE + VIDEO UPLOAD)
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "team1Logo", maxCount: 1 },
    { name: "team2Logo", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
    { name: "video", maxCount: 1 } // optional
  ]),
  ctrl.addHighlight
);

// 🔥 UPDATE HIGHLIGHT (OPTIONAL FILE UPDATE)
router.put(
  "/update/:id",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "team1Logo", maxCount: 1 },
    { name: "team2Logo", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  ctrl.updateHighlight
);

// DELETE
router.delete(
  "/delete/:id",
  protectAdmin,
  adminOnly,
  ctrl.deleteHighlight
);

// TOGGLE LIVE
router.put(
  "/toggle-live/:id",
  protectAdmin,
  adminOnly,
  ctrl.toggleLive
);


/* ================= PUBLIC ================= */

// ALL
router.get("/all", ctrl.getAllHighlights);

// CATEGORY BASED
router.get("/category/:categoryId", ctrl.getHighlightsByCategory);

// SINGLE
router.get("/:id", ctrl.getSingleHighlight);

// ADD VIEWER
router.put("/add-viewer/:id", ctrl.addViewer);


module.exports = router;