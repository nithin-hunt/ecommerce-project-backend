const {Sequelize} = require('sequelize');

const createDB = new Sequelize('TEST', 'user', 'pass', {
    dialect: 'sqlite',
    host: './config/db.sqlite',
});

const connectDB = () => {
    createDB.sync().then( () => {
        console.log('Connected to DB...');
    })
    .catch((e) => {
        console.log('DB connection failed', e);
    })
};

module.exports = { createDB, connectDB};

const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

orderModel.belongsTo(userModel, { foreignKey: "buyerID" });
userModel.hasMany(orderModel, { foreignKey: "id" });

