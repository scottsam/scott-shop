const Order = require("../models/Order");

exports.addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    if (orderItems && orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: { msgBody: "No order items", Error: true } });
    } else {
      const order = new Order({
        orderItems,
        user: req.user.id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        name: req.user.name,
      });
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: { msgBody: `Paymentmethod missing`, Error: true } });
  }
};
exports.orderById = async (req, res, next, id) => {
  try {
    const order = await Order.findById(id)
      .populate("user", "name email ")
      .exec();

    if (!order)
      return res
        .status(400)
        .json({ message: { msgBody: "No Order Found", Error: true } });
    req.order = order;

    next();
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: { msgBody: "An Error Occured", Error: true } });
  }
};
exports.getOrder_Id = (req, res) => {
  let order = req.order;
  console.log(order);
  return res.json(order);
};

exports.updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = order.save();
    res.json(updatedOrder);
  } else {
    res
      .status(400)
      .json({ message: { msgBody: "Order not found", Error: true } });
  }
};

exports.updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = order.save();
    res.json(updatedOrder);
  } else {
    res.status(400).json({ message: { msgBody: "Order Error", Error: true } });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    console.log(req.profile);
    const orders = await Order.find({ user: req.user.id }).populate(
      "user",
      "_id name email"
    );
    res.json({ orders: orders });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: { msgBody: "Order Error", Error: true } });
  }
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
};
