const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');
const Group = require('../models/group');
const GroupUser = require('../models/groupUser');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

function s3Client(){
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const region = process.env.S3_REGION
  
    const s3client = new S3Client({
        credentials:{
          accessKeyId,
          secretAccessKey
        },
        region
      });
      return s3client;
}
function generateGroupToken(id){
    return jwt.sign({groupId:id},process.env.GROUP_TOKEN_SECRET)
}

exports.getGroups = async (req,res,next) =>{
    try{
        let userid = req.user.id;
        let user = await User.findByPk(userid,{
            include: [{
                model: Group,
                through: {
                    model: GroupUser,
                    attributes:['isAdmin'],
                },
                as:'groups'
            }],
        })
        const userGroups = user.groups || [];
let groups = [];

for (let i = 0; i < userGroups.length; i++) {
    let group = userGroups[i].dataValues;
    let id = generateGroupToken(group.id);
    let name = group.name;
    let isAdmin = group.groupuser ? group.groupuser.isAdmin : false; 

    groups.push({
        id,
        name,
        isAdmin,
    });
}

res.json({ groups });
    }catch(err){
        console.log("Error in fetching all groups: "+err);
    }
    
}
exports.getChat = (req, res, next) => {
    res.sendFile('chat.html', { root: 'views' });
}
exports.postMessage = async(req,res,next) => {
    let userid = req.user.id;
    let groupid = req.group;
    let message = req.body.message;
    let image = req.file;
    /*if(req.file){
        const imageBuffer = req.file.buffer;
        const filename = await uploadToS3(imageBuffer,req.file.originalname,req.file.mimetype);
        if(filename){
            try{
                const msgresult = await Message.create({
                    message:message,
                    userId:userid,
                    groupId:groupid,
                    isImage:false
                })
                const imgresult = await Message.create({
                    message:filename,
                    userId:userid,
                    groupId:groupid,
                    isImage:true
                })
                let group=[]
                group.push(generateGroupToken(groupid))
                res.json({group:group,id:msgresult.id});
            }catch(err){
                console.log("Message and image storing error: "+err)
            }
        }else{
            console.log('image upload error')
        } 
    }else*/{
        try{
            const result = await Message.create({
                message:message,
                userId:userid,
                groupId:groupid
            })
            let group=[]
            group.push(generateGroupToken(groupid))
            res.json({group:group,id:result.id});
        }catch(err){
            console.log("Message storing error: "+err)
        }
    }  
}

async function uploadToS3(data,filename,content){
    const Bucket = process.env.S3_BUCKET
    let client = s3Client();
    const command = new PutObjectCommand({
        Bucket,
        Key:filename,
        Body:data,
        ContentType:content,
        ACL:'public-read'
      })
    try{
      const s3response = await client.send(command)
      return filename;
    }
    catch(err){
      console.log('upload to s3 bucket error',err)
    }
  }

async function downloadFromS3(filename){
    let client = s3Client();
    const Bucket = process.env.S3_BUCKET
    const command = new GetObjectCommand({
        Bucket,
        key:filename
    })
    try{
        const s3response = await client.getObject(command)
        const file = Buffer.from(s3response.Body).toString('base64');
        return file;
      }
      catch(err){
        console.log('download from s3 bucket error',err)
      }
}

exports.newMember = async(req,res,next) =>{
    let member = req.body;
    let groupid = req.group;
    try{
        const user = await User.findOne({
            where: { email: member.email }
        });
        
        const group = await Group.findByPk(groupid);
        
        if (user && group) {
            const newMember = await GroupUser.create({
                userId: user.id,
                groupId: group.id,
                isAdmin: false 
            });
        }
            res.json({ message: 'User added as a non-admin member to the group successfully', pass: true});
    }catch(err){
        console.log("New Member add error: "+err)
    }
}
exports.getAllMessages = async (req,res,next) =>{
    const page = req.query.page;
    const chatPerPage = 5
    let user = req.user;
    let groupid = req.group
    try{ 
        const group = await GroupUser.findAll({
            where:{userId:user.id,groupId:groupid},
        })
        if(group){
            const { count, rows } = await Message.findAndCountAll({
                where: { groupId: groupid },
                attributes: ['message',
                    [sequelize.literal('`User`.`firstName`'), 'name'],
                ],
                include: [{
                        model: User,
                        attributes:[],
                }],
                offset: (page - 1) * chatPerPage,
                limit: chatPerPage,
                order: [['createdAt', 'DESC']],
                raw:true
            });
            let username = user.firstName;
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
                const group = await Group.findByPk(groupid,{attributes:['name']})
                res.json({pass:true,groupname:group.name,result:"Send messages in group"})
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
            const groupuser = await GroupUser.create({
                userId: userid,
                groupId: groupNew.id,
                isAdmin: true
            },{transaction:t});
            //await t.commit();
            res.json({pass:true,newgroup:generateGroupToken(groupNew.id)})
        }catch(err){
            await t.rollback();
            console.log("New Group Creation Error: "+err)
        }
    })   
}
exports.userList = async(req,res,next) => {
    let userid = req.user.id;
    let groupid = req.group;
    try{
        const users = await GroupUser.findAll({
            attributes:['userId'],
            where:{
                groupId:groupid
            },
            raw:true
        })
        const notUsers = await User.findAll({
            attributes:['firstName','email','id'],
            where:{
                id:{
                    [Op.notIn]:users.map(user => user.userId)
                }
            },
            raw:true
        })
        res.json({users:notUsers})
    }catch(err){
        console.log("Getting users error: "+err)
    }
}

exports.latestMessage = async(req,res,next) =>{
    let user = req.user;
    let groupid = req.group;
    const group1 = jwt.verify(req.body.groupToken,process.env.GROUP_TOKEN_SECRET);
    const group2 = jwt.verify(req.body.data,process.env.GROUP_TOKEN_SECRET);
    if(group1.groupId===group2.groupId){
        try{
            const latest = await Message.findOne({
                where: { groupId: groupid },
                attributes: ['message',
                    [sequelize.literal('`User`.`firstName`'), 'name'],
                ],
                include: [{
                        model: User,
                        attributes:[],
                }],
                order: [['createdAt', 'DESC']],
            raw:true
            })
            
            let username = user.firstName;
            if(latest) {
                res.json({
                    pass:true,
                    messages:latest,
                    username:username,
                    result:"message retrived"
                })
            }
        }catch(err){
            console.log('latest message error: '+err)
        }
    }else{
        console.log('user group different')
    }
    
}