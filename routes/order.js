const express = require("express");

const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrders,
  orderById,
  updateOrderToDelivered,
  updateOrderToPaid,
  getOrder_Id,
} = require("../controllers/order");
const { authUser, authorized, isAdmin } = require("../controllers/user");

const { userById } = require("../controllers/user");

router.post("/order", authUser, addOrderItems);
router.get("/order/:orderId", authUser, getOrder_Id);

router.get("/order/:orderId/pay", updateOrderToPaid);

router.get(
  "/order/:orderId/deliver",
  authUser,
  isAdmin(),
  updateOrderToDelivered
);
router.get("/order/myorders/:userId", authUser, getMyOrders);

router.get("/orders", getOrders);

router.param("orderId", orderById);
router.param("userId", userById);

module.exports = router;
