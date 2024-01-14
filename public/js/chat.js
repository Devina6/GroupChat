let userToken = localStorage.getItem('userToken');

document.addEventListener('DOMContentLoaded', async() => {
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
/*const intervalId = setInterval(async() => {
    
} ,1000);*/

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
        let sendBtn = document.getElementById("sendBtn")
        let messageText = document.getElementById("message")
        sendBtn.disabled = false;
        messageText.disabled = false;
        let parent = document.getElementById("chat-display")
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
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
        const { data: { messages,username,pass,result, ...pageData } }= await axios.get(`/chat/allMessage?page=${page}`,{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
        if(pass){
            let groupPresent = document.getElementById("groupName");
            groupPresent.textContent = group[1];
            if(messages){
                document.getElementById("message").disabled = false;
                document.getElementById("sendBtn").disabled = false;
                displayMessages(messages,username);
                previousData(pageData);
            }else{
                const previousBtn = document.querySelector('#previousBtn');
                previousBtn.disabled = true;
            }
        }else{
            alert(result)
        }
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
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('#sendBtn');
    const groupBtn = document.querySelector('#groupBtn')
    if (sendBtn) {
        sendBtn.addEventListener('click',sendMessage);
    }
    if(groupBtn){
        groupBtn.addEventListener('click',newGroup);
    }
});

async function displayMessages(messages,name,previous){
    let parent = document.getElementById("chat-display")
    
    for (var i = 0; i<messages.length; i++) {
        let newdiv = document.createElement("div");
        let child = document.createElement("p");
        if(name===messages[i].user.firstName){
            newdiv.className = "message-yellow d-flex justify-content-end";
            child.textContent = messages[i].message+' : You';
        }else{
            newdiv.className = "message-green d-flex justify-content-start";
            child.textContent = messages[i].user.firstName+' : '+messages[i].message;
        }
        const lineBreak = document.createElement('br');
                
        newdiv.appendChild(child);
        parent.insertBefore(lineBreak,parent.firstChild);
        parent.insertBefore(newdiv,parent.firstChild);
    }    
}    

async function sendMessage(e){
    e.preventDefault();
    let groupToken = localStorage.getItem('groupToken');
    let obj = {
        message:document.getElementById("message").value
    }
    try{
        const result = await axios.post('/chat/sendMessage',obj,{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
        groupChats(result.data.group)
    }catch(err){
        console.log("Client-side message sending error: "+err)
    } 
}
async function previousMessage(page){
    let groupToken = localStorage.getItem('groupToken');
    try{
        const { data: { messages,username,groupname,pass,result, ...pageData } }= await axios.get(`/chat/allMessage?page=${page}`,{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
        displayMessages(messages,username);
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