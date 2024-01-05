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
    const page = req.query.page;
    const chatPerPage = 5
    let id = req.user.id;
    try{
        const {count,rows} = await Message.findAndCountAll({
            attributes:['message'],
            include:[{
                model:User,
                attributes:['firstName']
            }],
            offset:(page-1)*chatPerPage,
            limit:chatPerPage,
            order: [ [ 'createdAt', 'DESC' ]]
        })
        const user = await User.findOne({
            where:{id:id},
            attributes:['firstName']
        });
        
        res.json({
            messages:rows,
            name:user.firstName,
            currentPage: parseInt(page),
            hasPreviousPage:chatPerPage*page < count,
            previousPage:parseInt(page)+1,
            lastPage: Math.ceil(count/chatPerPage)
        });
    }catch(err){
        console.log("getting all messages error: "+err)
    }
}