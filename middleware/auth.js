const jwt = require('jsonwebtoken');
const User = require('../models/user');
const GroupUser = require('../models/groupUser');
require('dotenv').config();

exports.userAuthenticate = async(req,res,next) => {
    try{
        const token = req.header("userAuthorization");
        const user = jwt.verify(token,process.env.USER_TOKEN_SECRET);
        let person = await User.findByPk(user.userId)
        req.user = person;
        next();
        }catch(err){
            console.log("User authentication error: "+err);
            return res.json({userSuccess:false})
    }
}
exports.groupAuthenticate = async(req,res,next) => {
    try{
        let userid = req.user.id
        const token = req.header("groupAuthorization");
        const group = jwt.verify(token,process.env.GROUP_TOKEN_SECRET);
        let Group = await GroupUser.findAll({
            where:{userId:userid,groupId:group.groupId}
        })
        if(Group.length>0){
            req.group = Group[0].dataValues
        }
        next();
    }catch(err){
        console.log("Group Authentication error: "+err);
        return res.json({groupSuccess:false})
    }
}