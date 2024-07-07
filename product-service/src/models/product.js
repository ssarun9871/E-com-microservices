const Sequelize = require("sequelize");
const db = require("../database/connection");

const Product = db.define('Product', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
