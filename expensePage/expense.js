
window.addEventListener("DOMContentLoaded", async () => {
    try{
        const token = localStorage.getItem('token');

        const allExpenses = await axios.get("http://localhost:3000/expense/all", { headers: {"Authorization" : token} });
        for (let i = 0; i < allExpenses.data.allExpenseData.length; i++){
            expenseDetails(allExpenses.data.allExpenseData[i]);
        }

        const getUserInfo = await axios.get("http://localhost:3000/user/info", { headers: {"Authorization" : token} });
        console.log(getUserInfo.data.isPremiumMember);
        if(getUserInfo.data.isPremiumMember == true){
            const premiumButton = document.getElementById("btnPremium");
            premiumButton.style.display = "none";
        }
    }
    catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4> Something went wrong</h4>`
    }
})


document.getElementById("btnAdd").addEventListener("click", validateForm);

const form = document.querySelector('form');

document.getElementById("btnPremium").addEventListener("click", rzrPremium);

function validateForm(e) {
    var amount = document.getElementById("amountId").value;
    var category = document.getElementById("categoryId").value;
    var description = document.getElementById("descriptionId").value;

    if (amount == "") {
      alert("Enter Amount");
      return false;
    }
    
    if (category == "") {
      alert("Select a category from dropdown");
      return false;
    }

    if (description == "") {
      alert("Description for your expenses");
      return false;
    }

    else{
        expenseToDB(e);
        form.reset();
    }
}

async function expenseToDB(e) {
    try{
        e.preventDefault();
        const amount = document.getElementById("amountId").value;
        const category = document.getElementById("categoryId").value;
        const description = document.getElementById("descriptionId").value;
        const token = localStorage.getItem('token');
    
        const obj = {
            amount,
            category,
            description
        }
        const lastExpense = await axios.post('http://localhost:3000/expense/add', obj, { headers: {"Authorization" : token} });
        expenseDetails(lastExpense.data.newExpenseData);
    }
    catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4> Something went wrong</h4>`
    }
}

function expenseDetails(obj){
    var parentElem = document.getElementById('expenseDetailsUl');
    var newli = document.createElement('li');
    newli.textContent = obj.amountDB + "-" + obj.categoryDB + "-" + obj.descriptionDB;
    newli.className = "list-group-item";

    var delBtn = document.createElement('button');
    delBtn.id = 'DelBtn';
    delBtn.className = 'btn btn-danger delete p-2 float-right';
    delBtn.appendChild(document.createTextNode(" Delete Expense "));
    newli.appendChild(delBtn)

    parentElem.appendChild(newli);
    delBtn.onclick = async() => {
        try{
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/expense/${obj.id}`, { headers: {"Authorization" : token} });
            parentElem.removeChild(newli);
        }
        catch (err) {
            console.log(err);
            document.body.innerHTML += `<h4> Something went wrong</h4>`
        }
        
    }

}

async function rzrPremium(e){
    e.preventDefault();
    const token = localStorage.getItem("token");
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', {headers: {"Authorization": token} });
    
    const options = {
        "key" : response.data.key_id,
        "order_id" : response.data.order.id,

        "handler": async function(response){
            console.log(response);
            try{
                await axios.post('http://localhost:3000/purchase/updatetransactionstatus', { 
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                    status: "SUCCESSFUL"
                }, { headers: {"Authorization": token} } );
    
                alert('You are a Premium User now');
                location.reload();

            }
            catch(err){
                console.log(err);
                document.body.innerHTML += `<h4> Something went wrong</h4>`
            }

        }
    };

    const rzpFront = new Razorpay(options);
    rzpFront.open();

    rzpFront.on('payment.failed', async (response) => {
        try{
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus', { 
                order_id: options.order_id,
                payment_id: response.error.metadata.payment_id,
                status: "FAILED"
            }, { headers: {"Authorization": token} } );

            alert('Something went wrong');
            location.reload();

        }
        catch(err){
            console.log(err);
            document.body.innerHTML += `<h4> Something went wrong</h4>`
        }
        
    });
}