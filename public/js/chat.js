let userToken = localStorage.getItem('userToken');

document.addEventListener('DOMContentLoaded', async() => {
    try {
        let result = await axios.get('/chat/groups', { headers: { "userAuthorization": userToken } });
        let groupParent = document.getElementById("groups");
        let groups = result.data.groups;
        let buttons =[];
        for (var i = 0; i < groups.length; i++) {
            let newBtn = document.createElement("input");
            newBtn.type = 'submit';
            newBtn.className = "btn btn-outline-dark";
            
            let button =[];
            newBtn.setAttribute('data-alphanumeric',`${groups[i][0]}`);
            newBtn.id = `${groups[i][1]}`;
            newBtn.value = `${groups[i][1]}`;
            button.push(`${groups[i][0]}`);
            button.push(newBtn.value)
            buttons.push(button);
            groupParent.appendChild(newBtn);
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
    try{
        let parent = document.getElementById("chat-display")
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        const { data: { messages,username,groupname,pass, ...pageData } }= await axios.get(`/chat/allMessage?page=${page}`,{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
        if(pass){
            let groupPresent = document.getElementById("groupName");
            groupPresent.textContent = group[1]
            if(messages){
                displayMessages(messages,username);
                let data = Object.assign(pageData, { groupToken:groupToken });
                previousData(data);
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
function previousData({
    currentPage,
    hasPreviousPage,
    previousPage,
    lastPage,
    groupToken
}) {
    const previousBtn = document.querySelector('#previousBtn');
    if (hasPreviousPage) {
        previousBtn.style.visibility = 'visible';
        previousBtn.addEventListener('click',() => previousMessage(previousPage,groupToken))
    } else {
        previousBtn.style.visibility = 'hidden';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('#sendBtn');
    
    if (sendBtn) {
        sendBtn.addEventListener('click',sendMessage);
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
    let obj = {
        message:document.getElementById("message").value
    }
    try{
        const result = await axios.post('/chat/sendMessage',obj,{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
        groupChats(result.data.group)
    }
    catch(err){
        console.log("Client-side message sending error: "+err)
    } 
}
async function previousMessage(page,groupToken){
    try{
        const { data: { messages,username,groupname,pass, ...pageData } }= await axios.get(`/chat/allMessage?page=${page}`,{headers:{"userAuthorization":userToken,"groupAuthorization":groupToken}})
        displayMessages(messages,username);
        let data = Object.assign(pageData, { groupToken:groupToken });
        previousData(data);
    }catch(err){
        console.log("all messages getting error: "+err)
    }
    
    
}