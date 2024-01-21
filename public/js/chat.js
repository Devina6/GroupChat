const socket = io();
let userToken = localStorage.getItem('userToken');

document.addEventListener('DOMContentLoaded', async() => {
    const sendBtn = document.querySelector('#sendBtn');
    const groupBtn = document.querySelector('#groupBtn')
    if (sendBtn) {
        sendBtn.addEventListener('click',sendMessage);
        }
    if(groupBtn){
        groupBtn.addEventListener('click',newGroup);
    }
    let imageFile = document.getElementById('file');
    let trigger = document.getElementById('triggerfile');
        trigger.addEventListener('click',function () {
            imageFile.click();
        })  
    try {
        let result = await axios.get('/chat/groups', { headers: { "userAuthorization": userToken } });
        let groupParent = document.getElementById("groups");
        
        let group = result.data.groups;
        let buttons =[];
        for (var i = 0; i < group.length; i++) {

            let newBtn = document.createElement("input");
            newBtn.type = 'submit';
            newBtn.className = "btn btn-outline-dark";
    
            let button =[];
            newBtn.setAttribute('data-alphanumeric',`${group[i].id}`);
            newBtn.id = `${group[i].name}`;
            newBtn.value = `${group[i].name}`;
            button.push(group[i].id);
            button.push(newBtn.value)
            button.push(group[i].isAdmin)
            buttons.push(button);
            groupParent.appendChild(newBtn);
            let lineBreak1 = document.createElement('br');
            groupParent.appendChild(lineBreak1);   
        }
        groupButtons(buttons);
      } catch (err) {
        console.log("all groups getting error: " + err);
      }
  });

function groupButtons(buttons){
    const addClickEvent = (button) => {

        let buttonElement = document.getElementById(button[1]);
        if(buttonElement) {
            buttonElement.addEventListener('click', () => groupChats(button));
        } 
    };
    buttons.forEach(addClickEvent);
};
    
async function groupChats(group){
    let parent = document.getElementById("chat-display")
    let page = 1
    let groupToken = group[0]
    localStorage.setItem('groupToken', groupToken)
    try{
        let parent = document.getElementById("chat-display")
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }

        const { data: { messages,username,pass,result, ...pageData } }= await axios.get(`/chat/allMessage?page=${page}`,{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
        if(pass){
            let groupPresent = document.getElementById("groupName");
            
            groupPresent.textContent = group[1];
            if(messages){
                document.getElementById("message").disabled = false;
                document.getElementById("sendBtn").disabled = false;
                let latest = false;
                for(var i=0;i<messages.length;i++){
                    displayMessages(messages[i],username,latest);
                }
                previousData(pageData);
            }else{
                const previousBtn = document.querySelector('#previousBtn');
                previousBtn.disabled = true;
            }
        }else{
            alert(result)
        }

        let sendBtn = document.getElementById("sendBtn")
        sendBtn.disabled = false;
        let messageText = document.getElementById("message");
        messageText.disabled = false;
        let trigger = document.getElementById('triggerfile');
        trigger.disabled = false;
         

        let userList = document.getElementById("users")
        if(group[2]){
            userList.style.visibility = 'visible';
            const result = await axios.get('/chat/users',{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
            let users = result.data.users
            
            let parent = document.getElementById('nonMembers')
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
            for(var j=0;j<users.length;j++){
                let child = document.createElement('li');
                let member ={email:users[j].email,id:users[j].id}
                child.setAttribute('id',users[j].id);
                child.className = "btn btn-primary btn-sm"
                child.textContent = users[j].firstName+" - "+users[j].email;
                parent.append(child);

                child.addEventListener('click',() => addMember(member))
            }
        }else{
            userList.style.visibility = 'hidden';
        }

        socket.emit('group token',groupToken)
    }catch(err){
        console.log("all messages getting error: "+err)
    }
}

async function addMember(member){
    let groupToken = localStorage.getItem('groupToken');
    try{
        let result = await axios.post('/chat/addMember',member,{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
        if(result.data.pass){
            let element = document.getElementById(member.id);
            element.remove();
        }
    }catch(err){
        console.log("Adding member Error: "+err)
    }
}

function previousData({
    currentPage,
    hasPreviousPage,
    previousPage,
    lastPage,
}) {
    const previousBtn = document.querySelector('#previousBtn');
    if (hasPreviousPage) {
        previousBtn.style.visibility = 'visible';
        previousBtn.addEventListener('click',() => previousMessage(previousPage))
    } else {
        previousBtn.style.visibility = 'hidden';
    }
}

async function displayMessages(message,username,latest){
    let parent = document.getElementById("chat-display")
    let newdiv = document.createElement("div");
    let child = document.createElement("p");
    if(username===message.name){
        newdiv.className = "message-yellow d-flex justify-content-end";
        child.textContent = message.message+' : You';
    }else{
        newdiv.className = "message-green d-flex justify-content-start";
        child.textContent = message.name+' : '+message.message;
    }
    const lineBreak = document.createElement('br');
    newdiv.appendChild(child);
    if(latest){
        parent.appendChild(lineBreak);
        parent.appendChild(newdiv);
    }else{
        parent.insertBefore(lineBreak,parent.firstChild);
        parent.insertBefore(newdiv,parent.firstChild);
    }       
        
}    

function messageCollection(){
    
    
    
}
async function sendMessage(e){
    e.preventDefault();
    let groupToken = localStorage.getItem('groupToken');  
    let message = document.getElementById('message').value;
    let image = document.getElementById('file')
    let formData = new FormData();
    if(image.files.length>0){
        formData.append('image',image.files[0])
    }
    formData.append('message',message)
    if(message){
        document.getElementById("message").value = '';
    }
    try{
        const result = await axios.post('/chat/sendMessage',formData,{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
        const msgId = result.data.id;
        socket.emit('chatMessage',(groupToken));
    }catch(err){
        console.log("Client-side message sending error: "+err)
    } 
}
socket.on('receive', async(data)=>{
    try{
        /* for receiving image and displaying image
        const response = await axios.get('/.....',{.....})
        const data = await response.json();
        const image = data.image;
        document.getElementById('displayImage').src = `data:image/jpeg;base64,${image}`;*/

        /*const preview = document.getElementById('preview');
            const file = image.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                  preview.src = e.target.result;
                  preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
              } else {
                preview.style.display = 'none';
              }*/
        let groupToken = localStorage.getItem('groupToken');
        let obj = {
            groupToken:groupToken,
            data:data,
        }
        const newMessage = await axios.post('/chat/latestMessage',obj,{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
        let latestMessage = newMessage.data.messages;
        let latest = true;
        let username = newMessage.data.username;
        displayMessages(latestMessage,latestMessage.name,latest);
            
    }catch(err){
        console.log('latest message error: '+err)
    }
})

async function previousMessage(page){
    let groupToken = localStorage.getItem('groupToken');
    try{
        const { data: { messages,username,groupname,pass,result, ...pageData } }= await axios.get(`/chat/allMessage?page=${page}`,{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
        let latest = false;
        displayMessages(messages,username,latest);
        previousData(pageData);
    }catch(err){
        console.log("all messages getting error: "+err)
    } 
}

async function newGroup(e){
    e.preventDefault();
    let name = document.getElementById("newGroupName").value
    var myModal = document.getElementById('staticBackdrop');
    let obj = {
        name:name
    }
    try{
        const result = await axios.post('/chat/newGroup',obj,{headers:{"userAuthorization":userToken}})
        if(result.data.pass){
            window.location.reload();
        }
    }catch(err){
        console.log("New Group creation error: "+err)
    }
}

