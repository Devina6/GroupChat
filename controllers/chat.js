const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');

exports.getChat = (req, res, next) => {
    res.sendFile('chat.html', { root: 'views' });
}
exports.postMessage = async(req,res,next) => {
    let message = req.body.message;
    let id = req.user.id
    try{
        const result = await Message.create({
            message:message,
            userId:id
        })
        res.json({message:result});
    }catch(err){
        console.log("Message storing error: "+err)
    }
}
exports.getAllMessages = async (req,res,next) =>{
    let id = req.user.id;
    try{
        const messages = await Message.findAll({
            attributes:['message'],
            include:[{
                model:User,
                attributes:['firstName']
            }]
        })
        const user = await User.findOne({
            where:{id:id},
            attributes:['firstName']
        });
        res.json({messages:messages,name:user.firstName});
    }catch(err){
        console.log("getting all messages error: "+err)
    }
}