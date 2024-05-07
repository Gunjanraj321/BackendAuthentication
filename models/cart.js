const Sequelize = require('sequelize');
const sequelize = require('../services/db');

const Cart = sequelize.define('Cart',{
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.STRING,
        allowNull:true
    },
    price:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    title:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Cart;