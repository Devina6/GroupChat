const express = require('express');
const{createServer} = require('http');
const {Server} = require('socket.io')

const app = express();
const server = createServer(app);
const io = new Server(server);

const bodyParser = require('body-parser');
const sequelize = require('./util/database')
const cors = require('cors');
require('dotenv').config()

const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const GroupUser = require('./models/groupUser');

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');

io.on('connection',socket => {
    console.log('a user connected',socket.id);

    socket.on('chatMessage', (data) => {
        io.emit('receive',data);
    });

    
    /*socket.on('disconnect',()=>{
        console.log('user disconnected');
    })*/
})



app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(cors({origin:'*', methods:['GET','POST']}));

app.use('',userRoutes);
app.use('/chat',chatRoutes);

User.hasMany(Message);
Message.belongsTo(User);
User.belongsToMany(Group, { through: GroupUser, foreignKey: 'userId',as:'groups' });
Group.belongsToMany(User, { through: GroupUser, foreignKey: 'groupId',as:'members' });
Group.hasMany(Message);
Message.belongsTo(Group)

async function initiate(){
    try{
        await sequelize
        .sync()
        //.sync({force:true})
        .then(result => {
            server.listen(process.env.PORT,()=>{
                console.log('server running at '+process.env.WEBSITE);
            });
        })
    }catch(err){ 
            console.log(err);
        }
    }
initiate();
            