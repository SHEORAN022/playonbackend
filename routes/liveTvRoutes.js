



const express = require("express");
const router = express.Router();
const tv = require("../controllers/liveTvController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { protectUser } = require("../middleware/auth");

/* ===== ADMIN ===== */

router.post(
  "/admin/add",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  tv.addLiveTV
);

router.put(
  "/admin/update/:id",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  tv.updateLiveTV
);

router.delete("/admin/delete/:id", protectAdmin, adminOnly, tv.deleteLiveTV);
router.patch("/admin/toggle/:id", protectAdmin, adminOnly, tv.toggleLiveTV);

/* ===== USER ===== */

router.get("/all", protectUser, tv.getAllLiveTV);
router.get("/category/:category", tv.getByCategory);
router.patch("/viewer/:id", tv.increaseViewer);
router.get("/:id", protectUser, tv.getSingleTV);

module.exports = router;