const express = require("express");

const router = express.Router();
const {
  categoryById,
  newCategory,
  getCategory,
  getAllCategories,
} = require("../controllers/category");

router.post("/category/new", newCategory);
router.get("/category/all", getAllCategories);
router.get("/category/:categoryId", getCategory);

router.param("categoryId", categoryById);

module.exports = router;
