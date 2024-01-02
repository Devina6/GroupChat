document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.querySelector('#signupBtn');
      if (signupBtn) {
        signupBtn.addEventListener('click', signup);
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
        let res = await axios.post('/adduser',obj);
    
        let newdiv = document.createElement("div");
        if(res.data.pass){
            newdiv.className = "alert alert-success";
        }else{
            newdiv.className = "alert alert-danger";
        }
        
        newdiv.role = "alert";
        let child = document.createElement("p");
        child.textContent = `${res.data.result}`;
        newdiv.appendChild(child);
        let warning = document.getElementById("warning")
        warning.appendChild(newdiv);
    }