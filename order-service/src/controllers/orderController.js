const Order = require("../models/order");
const axios = require("axios");
const ShortUniqueId = require("short-unique-id");

exports.createOrder = async (req, res) => {
  try {
    const { user_id, role } = req.user;
    if (role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { version, product_id, quantity, status } = req.body;

    const uid = new ShortUniqueId({
      dictionary: 'number',
      length: 10,
    });

    const order_id = uid.rnd();

    const config = {
      method: "get",
      url: `http://localhost:3002/products/${product_id}`,
      headers: {
        Authorization: `Bearer ${req.token}`,
      },
    };

    const response = await axios.request(config);
    const product = response.data;
    const { vendor_id, stock } = product;

    if (stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const updateConfig = {
      method: "put",
      url: `http://localhost:3002/products/stock/${product_id}`,
      headers: {
        Authorization: `Bearer ${req.token}`,
      },
      data: { quantity, version },
    };

    const updateResponse = await axios.request(updateConfig);

    if (!updateResponse.status == 200) {
      return res
        .status(409)
        .json({ message: "Stock update failed due to concurrency conflict" });
    }

    const order = await Order.create({
      order_id,
      customer_id: user_id,
      vendor_id,
      product_id,
      quantity,
      status,
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getOrderByOrderId = async (req, res) => {
  try {
    const { user_id, role } = req.user;
    const { order_id } = req.params;
    let conditions = { order_id };

    if (role === "customer") {
      conditions.customer_id = user_id;
    } else if (role === "vendor") {
      conditions.vendor_id = user_id;
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const order = await Order.findOne({
      where: conditions,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
