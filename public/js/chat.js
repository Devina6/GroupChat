let token = localStorage.getItem('token');
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('#sendBtn');

    if (sendBtn) {
        sendBtn.addEventListener('click',sendMessage);
    }
});
window.onload = async() => {
    try{
        const result = await axios.get('/chat/allMessage',{headers:{"userAuthorization":token}})
        displayMessages(result);
    }catch(err){
        console.log("all messages getting error: "+err)
    }
}
function displayMessages(result){
    let messages = result.data.messages

    let parent = document.getElementById("chat-display")
    
    for (var i = 0; i < messages.length; i++) {
        let newdiv = document.createElement("div");
        let child = document.createElement("p");
        if(result.data.name===messages[i].user.firstName){
            newdiv.className = "message-yellow d-flex justify-content-end";
            child.textContent = messages[i].message+' : You';
        }else{
            newdiv.className = "message-green d-flex justify-content-start";
            child.textContent = messages[i].user.firstName+' : '+messages[i].message;
        }
        
        const lineBreak = document.createElement('br');
        
        newdiv.appendChild(child);
        parent.appendChild(newdiv);
        parent.appendChild(lineBreak);
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