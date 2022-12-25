const {sequelize, Sequelize} = require('sequelize');

const createDB = new Sequelize('TEST-DB', 'user', 'pass', {
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

const userModel = require('../models/userModel');
const orderModel = require('../models/orderModels');

orderModel.belongsTo(userModel, {foreignKey: "buyerId"});
userModel.hasMany(orderModel, {foreignKey: "id"});

module.exports = { createDB, connectDB};