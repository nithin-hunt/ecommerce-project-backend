const {Sequelize} = require('sequelize');

//* Instantiates sequelize with the name of database, username, password and configuration options
const createDB = new Sequelize('TEST', 'user', 'pass', {
    dialect: 'sqlite',
    host: './config/db.sqlite',
});

//* Connects the ExpressJS app to DB
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

// Association to link userModel to orderModel
orderModel.belongsTo(userModel, { foreignKey: "buyerID" });
userModel.hasMany(orderModel, { foreignKey: "id" });

