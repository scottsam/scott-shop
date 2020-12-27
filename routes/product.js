const express = require("express");

const router = express.Router();
const {
  createProduct,
  productById,
  getSingleProduct,
  updateProduct,
  getAllProducts,
  productByCategory,
  deleteProduct,
  productPhoto,
  createProductReview,
  getTopProducts,
} = require("../controllers/product");
const { authUser, isAdmin } = require("../controllers/user");
const { categoryById } = require("../controllers/category");
const { userById } = require("../controllers/user");

router.post("/product", authUser, isAdmin(), createProduct);
router.get("/products", getAllProducts);

router.get("/product/:productId", getSingleProduct);
router.get("/product-top/", getTopProducts);
router.get("/product/photo/:productId", productPhoto);
router.get("/products/:categoryId", productByCategory);
router.put("/product/:productId", authUser, isAdmin(), updateProduct);

router.delete("/product/:productId", authUser, isAdmin(), deleteProduct);

router.post("/product/:productId/reviews", authUser, createProductReview);

router.param("productId", productById);
router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;
