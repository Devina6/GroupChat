const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const sequelize = require('./util/database')

require('dotenv').config()

const User = require('./models/user')
const userRoutes = require('./routes/user')

app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json());
app.use(express.static('public'))

app.use('',userRoutes)


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
            