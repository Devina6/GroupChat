const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Message = sequelize.define('message',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Message;
