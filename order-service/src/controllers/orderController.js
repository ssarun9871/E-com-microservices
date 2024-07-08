const Order = require("../models/order");
const axios = require("axios");
const ShortUniqueId = require("short-unique-id");

exports.createOrder = async (req, res) => {
  try {
    const { user_id, role } = req.user;
    if (role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { product_id, quantity, status } = req.body;

    const unique_order_id = new ShortUniqueId({
      dictionary: "number",
      length: 10,
    });

    const order_id = unique_order_id();
    let vendor_id;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `localhost:3002/products/${product_id}`,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        vendor_id = response.data.vendor_id;
      })
      .catch((error) => {
        console.log(error);
      });

    const order = await Order.create({
      order_id,
      customer_id: user_id,
      vendor_id: vendor_id,
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

    res.status(200).json({ order: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

