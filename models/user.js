const Sequelize = require('sequelize');
const sequelize = require('../services/db');

const user = sequelize.define("user",{
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = user;