const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { user_id, role } = req.user;
    if (role != "customer")
      return res.status(403).json({ message: "Access denied" });

    const { product_id, quantity, status } = req.body;

    const order = await Order.create({ user_id, product_id, quantity, status });

    res.status(201).json({ message: "success", order: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, productId, quantity, status } = req.body;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.userId = userId;
    order.productId = productId;
    order.quantity = quantity;
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrder = async;
