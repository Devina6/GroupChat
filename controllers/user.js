const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

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
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
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
                    res.json({result:"Successfully Registered!",pass:true})
                }
            })
        }
    }catch(err){
        console.log("User Signup Error",err)
    }
}