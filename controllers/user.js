const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Group = require('../models/group');
const GroupUser = require('../models/groupUser')
const jwt = require('jsonwebtoken');

exports.gethomePage = (request, response, next) => {
    response.sendFile('home.html', { root: 'views' });
}
exports.geterrorPage = (request,response,next) =>{
    response.sendFile('404.html',{root:'views'});
}
exports.getsignup = (request,response,next)=>{
    response.sendFile('signup.html',{root:'views'})
}
exports.postsignup = async(req,res,next) => {
    const { firstName, lastName, email, phone, password } = req.body;
    try{
        let userExist = await User.findAll({where:{email:email,phone:phone}})
        if(userExist.length>0){
            res.json({result: "Error : This USER already EXISTS",pass:false});
        }else{
            const salt = 10; 
            bcrypt.hash(password,salt,async(err,hash) => {
                if(err){
                    console.log(err)
                }else{
                    let user = await User.create({
                            firstName:firstName,
                            lastName:lastName,
                            email:email,
                            phone:phone,
                            password:hash
                    })
                    const defaultGroup = await Group.findOne({ where: { name: 'Common' } });
                    const groupUser = await GroupUser.create({
                        userId: user.id,
                        groupId: defaultGroup.id,
                    });
                    res.json({result:"Successfully Registered!",pass:true})
                }
            })
        }
    }catch(err){
        console.log("User Signup Error",err)
    }
}
exports.getlogin = (request,response,next)=>{
    response.sendFile('login.html',{root:'views'})
}
function generateUserToken(id){
    return jwt.sign({userId:id},process.env.USER_TOKEN_SECRET)
}

exports.postlogin = async(req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        let user = await User.findAll({where:{email:email}})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result) => {
                if(err){
                    return res.json({result:"Something went wrong",pass:false})
                }if(result){
                    return res.json({result:"Successfully Logged-in",pass:true,userToken:generateUserToken(user[0].id)})
                }else{
                    return res.json({result:"Please enter the correct details", pass:false})
                }
            })
        }else{
            res.json({result:"User not Registered, Please Signup", pass:false})
        }
    }catch(err){
        console.log("User Login Error "+err)
    }
}