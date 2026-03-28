const express = require("express");
const router = express.Router();

const highlightCategoryController = require("../controllers/highlightCategoryController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const { protectUser } = require("../middleware/auth");
const upload = require("../middleware/upload");


/* ================= USER ROUTES ================= */

// 🔓 Get all highlight categories (LOCK SYSTEM)
router.get(
  "/",
  protectUser,
  highlightCategoryController.getHighlightCategories
);

// 🔓 Get by category (with lock)
router.get(
  "/category/:categoryId",
  protectUser,
  highlightCategoryController.getHighlightCategoryByCategory
);

// 🔓 Get single (no lock check)
router.get(
  "/:id",
  highlightCategoryController.getSingleHighlightCategory
);



/* ================= ADMIN ROUTES ================= */

// ➕ Add highlight category
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  upload.single("image"),
  highlightCategoryController.addHighlightCategory
);

// ✏️ Update highlight category
router.put(
  "/update/:id",
  protectAdmin,
  adminOnly,
  upload.single("image"),
  highlightCategoryController.updateHighlightCategory
);

// ❌ Delete highlight category
router.delete(
  "/delete/:id",
  protectAdmin,
  adminOnly,
  highlightCategoryController.deleteHighlightCategory
);


module.exports = router;