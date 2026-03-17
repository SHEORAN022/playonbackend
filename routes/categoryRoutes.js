const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* ADMIN */
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  categoryController.addCategory
);

router.put(
  "/update/:id",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  categoryController.updateCategory
);

router.delete("/delete/:id", protectAdmin, adminOnly, categoryController.deleteCategory);

/* PUBLIC */
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getSingleCategory);

module.exports = router;