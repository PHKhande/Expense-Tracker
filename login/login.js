document.getElementById("buttonSubmit").addEventListener("click", validateForm);

function validateForm(e) {
    var name = document.getElementById("nameId").value;
    var email = document.getElementById("emailId").value;
    var password = document.getElementById("passwordId").value;

    if (name == "") {
      alert("Name must be filled out");
      return false;
    }
    
    if (email == "") {
      alert("Email must be filled out");
      return false;
    }

    if (password == "") {
      alert("Password must be filled out");
      return false;
    }

    else{
        signupFunc(e);
    }
}

function signupFunc(e){
    try{
        e.preventDefault();
        const name = document.getElementById("nameId").value;
        const email = document.getElementById("emailId").value;
        const password = document.getElementById("passwordId").value;
    
        const obj = {
            name,
            email,
            password
        }
        // const lastExpense = await axios.post('http://localhost:4000/expense/add', obj);
        // console.log(typeof(lastExpense.data.newUserData), lastExpense.data)
        console.log(obj);
        
    }
    catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4> Something went wrong</h4>`
    }
}



  
  

