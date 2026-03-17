



const router = require("express").Router();

const highlightCategoryController = require("../controllers/highlightCategoryController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");


/* ================= ADMIN ================= */

// Add highlight category
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  highlightCategoryController.addHighlightCategory
);
// Get highlight categories by category id
router.get(
  "/category/:categoryId",
  highlightCategoryController.getHighlightCategoryByCategory
);

// Update highlight category
router.put(
  "/update/:id",
  protectAdmin,
  adminOnly,
  upload.single("image"), 
  highlightCategoryController.updateHighlightCategory
);

// Delete highlight category
router.delete(
  "/delete/:id",
  protectAdmin,
  adminOnly,
  highlightCategoryController.deleteHighlightCategory
);


/* ================= PUBLIC ================= */

// Get all highlight categories
router.get(
  "/",
  highlightCategoryController.getHighlightCategories
);

// Get single highlight category
router.get(
  "/:id",
  highlightCategoryController.getSingleHighlightCategory
);


module.exports = router;