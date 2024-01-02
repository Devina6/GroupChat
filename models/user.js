const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    firstName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    lastName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    phone:{
        type:Sequelize.BIGINT(10),
        unique:true,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
    
})

module.exports = User;
