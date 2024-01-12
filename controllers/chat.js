const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');
const Group = require('../models/group');
const GroupUser = require('../models/groupUser');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

function generateGroupToken(id){
    return jwt.sign({groupId:id},process.env.GROUP_TOKEN_SECRET)
}
exports.getGroups = async (req,res,next) =>{
    try{
        let userid = req.user.id;
        let user = await User.findByPk(userid, 
            {
                include: [{
                    model: Group,
                    through: GroupUser, 
                }],
            })
        const dbgroups = user.groups;
        let groups=[];
        for(var i=0;i<dbgroups.length;i++){
            let id = generateGroupToken(dbgroups[i].dataValues.id)
            let name = dbgroups[i].dataValues.name
            let group = [id, name]
            groups.push(group);            
        }
        res.json({groups:groups});
    }catch(err){
        console.log("Error in fetching all groups: "+err);
    }
    
}
exports.getChat = (req, res, next) => {
    res.sendFile('chat.html', { root: 'views' });
}
exports.postMessage = async(req,res,next) => {
    let message = req.body.message;
    let userid = req.user.id;
    let groupid = req.group.groupId;
    try{
        const result = await Message.create({
            message:message,
            userId:userid,
            groupId:groupid
        })
        res.json({group:groupid});
    }catch(err){
        console.log("Message storing error: "+err)
    }
}
exports.getAllMessages = async (req,res,next) =>{
    const page = req.query.page;
    const chatPerPage = 5
    let userid = req.user.id;
    let groupid = req.group.id
    try{ 
        const group = await GroupUser.findAll({
            where:{userId:userid,groupId:groupid},
        })
        if(group){
            const { count, rows } = await Message.findAndCountAll({
                where: { groupId: groupid },
                attributes: ['message'],
                include: [{
                        model: User,
                        attributes:['firstName'],
                }],
                offset: (page - 1) * chatPerPage,
                limit: chatPerPage,
                order: [['createdAt', 'DESC']],
            });
            const name = await User.findAll({
                where:{id:userid},
                attributes:['firstName']
            })
            let username = name[0].dataValues.firstName;
            if(rows.length>0){
                res.json({
                    pass:true,
                    messages:rows,
                    username:username,
                    currentPage: parseInt(page),
                    hasPreviousPage:chatPerPage*page < count,
                    previousPage:parseInt(page)+1,
                    lastPage: Math.ceil(count/chatPerPage),
                    result:"messages retrived"
                })
            }else{
                const groupName = await Group.findAll({
                    where:{id:groupid},
                    attributes:['name']
                })
                let name = groupName[0].dataValues.name;
                res.json({pass:true,groupname:name,result:"Send messages in group"})
            }
        }else{
            res.json({pass:false,result:"You must join the group first"})
        }
    }catch(err){
        console.log("getting all messages error: "+err)
    }
}

exports.newGroup = async (req,res,next) => {
    let userid = req.user.id;
    const name = req.body.name
    sequelize.transaction(async(t) => {
        try{
            const groupNew = await Group.create({name:name},{transaction:t})
            const newgroup = await Group.findOne({ where: { name: name },transaction:t});
            const groupUser = await GroupUser.create({
                                                userId: userid,
                                                groupId: newgroup.id,
                                                },{transaction:t});
            res.json({pass:true,newgroup:generateGroupToken(newgroup.id)})
        }catch(err){
            await t.rollback();
            console.log("New Group Creation Error: "+err)
        }
    })   
}