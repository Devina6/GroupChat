const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    }
})
const createDefaultGroup = async () => {
  const defaultGroup = await Group.findOne({ where: { name: 'Common' } });
  
  if (!defaultGroup) {
    await Group.create({
      name: 'Common',
    });
  }
};

createDefaultGroup();

module.exports = Group;
