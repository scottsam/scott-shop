const express = require("express");

const router = express.Router();
const {
  categoryById,
  newCategory,
  getCategory,
  getAllCategories,
} = require("../controllers/category");

router.post("/category", newCategory);
router.get("/categories", getAllCategories);
router.get("/category/:categoryId", getCategory);

router.param("categoryId", categoryById);

module.exports = router;
