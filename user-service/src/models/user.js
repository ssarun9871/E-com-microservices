const Sequelize = require("sequelize");
const db = require("../database/connection");

const User = db.define("User", {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role: {
    type: Sequelize.ENUM("customer", "vendor"),
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;
