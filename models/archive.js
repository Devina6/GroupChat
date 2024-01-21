const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Archive = sequelize.define('archive',{
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
    },
    isImage:{
        type : Sequelize.BOOLEAN , 
        defaultValue : false
    },
    UserId:{
        type: Sequelize.INTEGER,
    },
    GroupId:{
        type: Sequelize.INTEGER,
    }
})

module.exports = Archive;
