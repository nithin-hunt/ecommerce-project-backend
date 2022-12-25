const { DataTypes } = require("sequelize");
const { createDB } = require("../config/db");

const Product = createDB.define("products", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: DataTypes.STRING,
  price: DataTypes.DECIMAL,
  content: DataTypes.STRING,
});

module.exports = Product;
