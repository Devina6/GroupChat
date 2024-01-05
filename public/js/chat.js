let token = localStorage.getItem('token');
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('#sendBtn');

    if (sendBtn) {
        sendBtn.addEventListener('click',sendMessage);
    }
});

async function sendMessage(e){
    e.preventDefault();
    let obj = {
        message:document.getElementById("message").value
    }
    try{
        const result = await axios.post('/chat/sendMessage',obj,{headers:{"userAuthorization":token}})
        console.log(result)
        //displayExpense(result.data.expense);
        //window.location.reload();
       
    }
    catch(err){
        console.log("Client-side message sending error: "+err)
    } 
}