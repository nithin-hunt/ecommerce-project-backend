const { DataTypes } = require("sequelize");
const { createDB } = require("../config/db");

const Order = createDB.define("orders", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  productID: DataTypes.INTEGER,
  productName: DataTypes.STRING,
  productPrice: DataTypes.DECIMAL,
  buyerID: DataTypes.INTEGER,
  buyerEmail: DataTypes.STRING,
});

module.exports = Order;