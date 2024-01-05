const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const sequelize = require('./util/database')
const cors = require('cors');
require('dotenv').config()

const User = require('./models/user');
const Message = require('./models/message');

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');

app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(cors({origin:'*', methods:['GET','POST']}));

app.use('',userRoutes);
app.use('/chat',chatRoutes);

User.hasMany(Message);
Message.belongsTo(User);

async function initiate(){
    try{
        await sequelize
        .sync()//.sync({force:true})
        .then(result => {
            app.listen(process.env.PORT);
        })
    }
        catch(err){ 
            console.log(err);
        }
    }
initiate();
            