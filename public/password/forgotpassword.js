const btnReset = document.getElementById("btnLogin");
btnReset.addEventListener("click", validateFunc);

function validateFunc(e) {
    const ResetEmail = document.getElementById("emailId").value;
    
    if (ResetEmail == "") {
      alert("Email must be filled out");
      return false;
    }

    else{
        forgotPassword(e);
    }
}

async function forgotPassword(e){

    try{
        e.preventDefault();
        const resetEmail = document.getElementById("emailId").value;
    
        const obj = {
            resetEmail
        }
        const forgotEmail = await axios.post('http://localhost:3000/password/forgotpassword', obj);
        document.body.innerHTML = `<h2> Link has been sent to your email </h2>`;

    }

    catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4> Something went wrong </h4>`;
    }

}