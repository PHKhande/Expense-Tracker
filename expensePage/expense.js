window.addEventListener("DOMContentLoaded", async () => {
    try{
        const allExpenses = await axios.get("http://localhost:3000/expense/all");
        for (let i = 0; i < allExpenses.data.allExpenseData.length; i++){
            expenseDetails(allExpenses.data.allExpenseData[i]);
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

function expenseToDB(e){
    e.preventDefault();
}

async function expenseToDB(e) {
    try{
        e.preventDefault();
        const amount = document.getElementById("amountId").value;
        const category = document.getElementById("categoryId").value;
        const description = document.getElementById("descriptionId").value;
    
        const obj = {
            amount,
            category,
            description
        }
        const lastExpense = await axios.post('http://localhost:3000/expense/add', obj);
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

    // var editBtn = document.createElement('button');
    // editBtn.id = 'edtBtn';
    // editBtn.className = 'btn btn-success edit';
    // editBtn.appendChild(document.createTextNode(" Edit Expense "));
    // newli.appendChild(editBtn)

    var delBtn = document.createElement('button');
    delBtn.id = 'DelBtn';
    delBtn.className = 'btn btn-danger delete p-2 float-right';
    delBtn.appendChild(document.createTextNode(" Delete Expense "));
    newli.appendChild(delBtn)

    parentElem.appendChild(newli);

    // editBtn.onclick = async() => {
    //     try{
    //         document.getElementById('expenseAmount').value = obj.expAmt
    //         document.getElementById('expenseCategory').value = obj.category
    //         document.getElementById('expenseDescription').value = obj.desc
        
    //         await axios.delete(`http://localhost:4000/expense/${obj.id}`);
    //         parentElem.removeChild(newli);
    //     }
    //     catch (err) {
    //         console.log(err);
    //         document.body.innerHTML += `<h4> Something went wrong</h4>`
    //     }
    // }

    delBtn.onclick = async() => {
        try{
            await axios.delete(`http://localhost:3000/expense/${obj.id}`);
            parentElem.removeChild(newli);
        }
        catch (err) {
            console.log(err);
            document.body.innerHTML += `<h4> Something went wrong</h4>`
        }
        
    }

}