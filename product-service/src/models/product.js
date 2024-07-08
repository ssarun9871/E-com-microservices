const Sequelize = require("sequelize");
const db = require("../database/connection");

const Product = db.define('Product', {
  product_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vendor_id:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  name: {
      type: Sequelize.STRING,
      allowNull: false
  },
  price: {
      type: Sequelize.FLOAT,
      allowNull: false
  },
  stock: {
      type: Sequelize.INTEGER,
      allowNull: false
  }
});

module.exports = Product;
