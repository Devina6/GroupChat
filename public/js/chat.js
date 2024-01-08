let token = localStorage.getItem('token');
//previousBtn.setAttribute('disabled', 'disabled');
//previousBtn.removeAttribute('disabled');

const intervalId = setInterval(async() => {
    let parent = document.getElementById("chat-display")
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    let page = 1
    try{
        const { data: { messages,name, ...pageData } }= await axios.get(`/chat/allMessage?page=${page}`,{headers:{"userAuthorization":token}})
        const previous = false;
        displayMessages(messages,name,previous);
        previousData(pageData);
    }catch(err){
        console.log("all messages getting error: "+err)
    }
} ,90000);

window.onload = async() => {
    let parent = document.getElementById("chat-display")
    let page = 1
    try{
        const { data: { messages,name, ...pageData } }= await axios.get(`/chat/allMessage?page=${page}`,{headers:{"userAuthorization":token}})
        const previous = false;
        displayMessages(messages,name,previous);
        previousData(pageData);
    }catch(err){
        console.log("all messages getting error: "+err)
    }
}
function previousData({
    currentPage,
    hasPreviousPage,
    previousPage,
    lastPage
}) {
    const previousBtn = document.querySelector('#previousBtn');
    if (hasPreviousPage) {
        previousBtn.disabled = false;
        previousBtn.addEventListener('click',() => previousMessage(previousPage))
    } else {
        previousBtn.disabled = true;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('#sendBtn');
    
    if (sendBtn) {
        sendBtn.addEventListener('click',sendMessage);
    }
    if (previousBtn) {
        previousBtn.addEventListener('click',previousMessage);
    }
});

async function displayMessages(messages,name,previous){
    let parent = document.getElementById("chat-display")
    
    if(previous){
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
    }else{
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
   
    
}

async function sendMessage(e){
    e.preventDefault();
    let obj = {
        message:document.getElementById("message").value
    }
    try{
        const result = await axios.post('/chat/sendMessage',obj,{headers:{"userAuthorization":token}})
        window.location.reload();
       
    }
    catch(err){
        console.log("Client-side message sending error: "+err)
    } 
}
async function previousMessage(page){
    try{
        const { data: { messages,name, ...pageData } }= await axios.get(`/chat/allMessage?page=${page}`,{headers:{"userAuthorization":token}})
        const previous = true;
        displayMessages(messages,name,previous);
        previousData(pageData);
    }catch(err){
        console.log("all messages getting error: "+err)
    }
    
    
}