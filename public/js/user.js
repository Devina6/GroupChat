document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.querySelector('#signupBtn');
    const loginBtn = document.querySelector('#loginBtn');

      if (signupBtn) {
        signupBtn.addEventListener('click', signup);
      }
      if (loginBtn) {
        loginBtn.addEventListener('click', login);
      }
    });

async function signup(e){
    e.preventDefault();
    let obj = {
        firstName:document.getElementById("firstName").value,
        lastName:document.getElementById("lastName").value,
        email:document.getElementById("email").value,
        phone:document.getElementById("phone").value,
        password:document.getElementById("password").value
    };
    try{
        let res = await axios.post('/adduser',obj);
    
        let newdiv = document.createElement("div");
        if(res.data.pass){
        newdiv.className = "alert alert-success";
        window.location.href = "/login";
        }else{
            newdiv.className = "alert alert-danger";
        }
        
        newdiv.role = "alert";
        let child = document.createElement("p");
        child.textContent = `${res.data.result}`;
        newdiv.appendChild(child);
        let warning = document.getElementById("warning")
        warning.appendChild(newdiv);
    }catch(err){
        console.log("Client-side Signup Error: "+err)
    }
}

async function login(e){
    e.preventDefault();
    let obj = {
        email:document.getElementById("email").value,
        password:document.getElementById("password").value
    }
    try{
        let res = await axios.post('/login',obj)
        localStorage.setItem('userToken',res.data.userToken)
        let newdiv = document.createElement("div");
        if (res.data.pass){
            newdiv.className = "alert alert-success";
            window.location.href = "/chat";
        }else{
            newdiv.className = "alert alert-danger"
        }
        
        newdiv.role = "alert";
        let child = document.createElement("p");
        child.textContent = `${res.data.result}`;
        newdiv.appendChild(child);
        let warning = document.getElementById("warning")
        warning.appendChild(newdiv);
    }catch(err){
        console.log("Client-side Login Error: "+err)
    }
}