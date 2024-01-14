const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const GroupUser = sequelize.define('groupuser',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
    },
})

module.exports = GroupUser;
