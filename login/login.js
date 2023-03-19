document.getElementById("btnLogin").addEventListener("click", validateFunc);
const form = document.querySelector('form');

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
        form.reset();
        alert("You are logged in successfully");
        localStorage.setItem('token', newUser.data.token);
        window.location.href = "../expensePage/expensePage.html"; 
        
        
    }
    catch (err) {
        console.log(err);
        if( typeof(err.response.data.error) == 'string'){
            document.body.innerHTML += `<h4> ${err.response.data.error}</h4>`
        }
        else{
            document.body.innerHTML += `<h4> Something went wrong </h4>`
        }
    }
}



  
  

