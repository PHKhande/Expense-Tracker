document.getElementById("btnLogin").addEventListener("click", validateFunc);

function validateFunc(e) {
    const loginEmail = document.getElementById("emailId").value;
    const loginPassword = document.getElementById("passwordId").value;
    
    if (loginEmail == "") {
      alert("Email must be filled out");
      return false;
    }

    if (loginPassword == "") {
      alert("Password must be filled out");
      return false;
    }

    else{
        validateLogin(e);
    }
}

async function validateLogin(e){
    try{
        e.preventDefault();
        const loginEmail = document.getElementById("emailId").value;
        const loginPassword = document.getElementById("passwordId").value;
    
        const obj = {
            loginEmail,
            loginPassword
        }
        const newUser = await axios.post('http://localhost:3000/login/user', obj);
        
        if (newUser.status == 404){
            document.body.innerHTML += `<h4> ${newUser.response.data.errorLogin}</h4>`
        }
        else{
            console.log(newUser.data.availableUserDB);
            alert("You are logged in successfully");  
        }
        
    }
    catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4> ${err.response.data.errorLogin}</h4>`
        // document.body.innerHTML += `<h4> Something went wrong </h4>`
        // document.body.innerHTML += `<h4> ${err.response.data.error}</h4>`
    }
}



  
  

