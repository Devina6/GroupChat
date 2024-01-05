const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

exports.userAuthenticate = async(req,res,next) => {
    try{
        const token = req.header("userAuthorization");
        const user = jwt.verify(token,process.env.TOKEN_SECRET);
        let person = await User.findByPk(user.userId)
        req.user = person;
        next();
        }catch(err){
            console.log("User authentication error: "+err);
            return res.json({userSuccess:false})
    }
}