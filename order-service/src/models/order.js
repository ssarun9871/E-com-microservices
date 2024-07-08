const Sequelize = require("sequelize");
const db = require("../database/connection");

const Order = db.define("Order", {
  order_details_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  customer_id:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  vendor_id:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  product_id:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM(
      "pending",
      "cancelled",
      "refunded",
      "completed"
    ),
    defaultValue:"pending",
    allowNull: false,
  },
});

module.exports = Order;
