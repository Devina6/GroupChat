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