const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/channelCategoryController");

router.post("/add", addCategory);
router.get("/all", getCategories);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
