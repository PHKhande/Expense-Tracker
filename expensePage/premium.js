
window.addEventListener("DOMContentLoaded", async () => {
    try{
        const token = localStorage.getItem('token');

        const allExpenses = await axios.get("http://localhost:3000/expense/all", { headers: {"Authorization" : token} });
        for (let i = 0; i < allExpenses.data.allExpenseData.length; i++){
            expenseDetails(allExpenses.data.allExpenseData[i]);
        }

        const getUserInfo = await axios.get("http://localhost:3000/user/info", { headers: {"Authorization" : token} });
        console.log(getUserInfo.data.isPremiumMember);
        if(getUserInfo.data.isPremiumMember !== true){
            window.location.href = "../expensePage/expensePage.html"; 
        }

        const getLeaderboard = await axios.get("http://localhost:3000/premium/allexpenses", { headers: {"Authorization" : token} });
        console.log(getLeaderboard)
        for (let i = 0; i < getLeaderboard.data.allExpenseDataFromDB.length; i++){
            leaderBoardDetails(getLeaderboard.data.allExpenseDataFromDB[i]);
        }

    }
    catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4> Something went wrong</h4>`
    }
})


document.getElementById("btnAdd").addEventListener("click", validateForm);
const form = document.querySelector('form');


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
    const parentElem = document.getElementById('expenseDetailsUl');
    const newli = document.createElement('li');
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

function leaderBoardDetails(arr){
    const parentElem = document.getElementById('leaderBoard');
    const newli = document.createElement('li');
    newli.textContent = arr[0] + "-" + arr[1]
    newli.className = "list-group-item";
    parentElem.appendChild(newli);
}