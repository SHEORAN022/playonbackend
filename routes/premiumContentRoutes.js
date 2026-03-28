const express = require("express");
const router = express.Router();

const premiumCtrl = require("../controllers/premiumContentController");

// 🔐 middlewares
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const { protectUser } = require("../middleware/auth");

const upload = require("../middleware/upload");

/* ===============================
   USER ROUTES (LOCK SYSTEM ENABLED)
================================ */

// 🔥 Get all premium content (LOCK / UNLOCK)
router.get("/", protectUser, premiumCtrl.getAllPremiumContent);

// 🔥 Category wise (LOCK WORKING)
router.get(
  "/category/:categoryId",
  protectUser,
  premiumCtrl.getPremiumContentByCategory
);

// 🔥 Single (LOCK CHECK INCLUDED)
router.get(
  "/:id",
  protectUser,
  premiumCtrl.getPremiumContentById
);


/* ===============================
   ADMIN ROUTES
================================ */

// ➕ Add premium content
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  premiumCtrl.addPremiumContent
);

// ✏️ Update premium content
router.put(
  "/update/:id",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  premiumCtrl.updatePremiumContent
);

// ❌ Delete premium content
router.delete(
  "/delete/:id",
  protectAdmin,
  adminOnly,
  premiumCtrl.deletePremiumContent
);

module.exports = router;