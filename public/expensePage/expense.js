const token = localStorage.getItem('token');
const pagination = document.getElementById('pagination');

const page = 1;

let limit = 3;
const rowNumber = document.getElementById('noOfRows');

rowNumber.addEventListener("change", () => {
    localStorage.setItem('noOfRows', Number(rowNumber.value));
    limit = localStorage.getItem('noOfRows');
  });

window.addEventListener("DOMContentLoaded", async () => {
    try{

        const FirstExpenses = await axios.get(`http://3.137.219.239:3000/expense/all?page=${page}&limit=${limit}`, { headers: {"Authorization" : token} });
        console.log(FirstExpenses)
        for (let i = 0; i < FirstExpenses.data.expenses.length; i++){
            expenseDetails(FirstExpenses.data.expenses[i]);
        }
        showPagination(FirstExpenses.data);

        const getUserInfo = await axios.get("http://3.137.219.239:3000/user/info", { headers: {"Authorization" : token} });
        console.log(getUserInfo.data.isPremiumMember);
        if(getUserInfo.data.isPremiumMember === true){
            window.location.href = "../expensePage/premium.html";
        }
    }
    catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4> Something went wrong</h4>`
    }
})

const form = document.querySelector('form');

document.getElementById("btnAdd").addEventListener("click", validateForm);

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
    
        const obj = {
            amount,
            category,
            description
        }
        const lastExpense = await axios.post('http://3.137.219.239:3000/expense/add', obj, { headers: {"Authorization" : token} });
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
            await axios.delete(`http://3.137.219.239:3000/expense/${obj.id}`, { headers: {"Authorization" : token} });
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
    const response = await axios.get('http://3.137.219.239:3000/purchase/premiummembership', {headers: {"Authorization": token} });
    
    const options = {
        "key" : response.data.key_id,
        "order_id" : response.data.order.id,

        "handler": async function(response){
            console.log(response);
            try{
                await axios.post('http://3.137.219.239:3000/purchase/updatetransactionstatus', { 
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                    status: "SUCCESSFUL"
                }, { headers: {"Authorization": token} } );
    
                alert('You are a Premium User now');
                window.location.href = "premium.html";

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
            await axios.post('http://3.137.219.239:3000/purchase/updatetransactionstatus', { 
                order_id: options.order_id,
                payment_id: response.error.metadata.payment_id,
                status: "FAILED"
            }, { headers: {"Authorization": token} } );

            alert('Something went wrong');

        }
        catch(err){
            console.log(err);
            document.body.innerHTML += `<h4> Something went wrong</h4>`
        }
        
    });
}

function showPagination( {
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}) {

    pagination.innerHTML = '';

    if (hasPreviousPage) {
        const btn1 = document.createElement('button');
        btn1.className = "button border border-info p-2 mx-auto text-info"
        btn1.innerHTML = previousPage;
        btn1.addEventListener('click', () => getExpenses(previousPage));
        pagination.appendChild(btn1);
    }

    const btn2 = document.createElement('button');
    btn2.className = "button border border-info p-2 mx-auto text-info"
    btn2.innerHTML = currentPage;
    btn2.addEventListener('click', () => getExpenses(currentPage));
    pagination.appendChild(btn2);

    
    if (hasNextPage) {
            const btn3 = document.createElement('button');
            btn3.className = "button border border-info p-2 mx-auto text-info"
            btn3.innerHTML = nextPage;
            btn3.addEventListener('click', () => getExpenses(nextPage));
            pagination.appendChild(btn3);
    }

    if(currentPage != lastPage){
        const btn4 = document.createElement('button');
        btn4.className = "button border border-info p-2 mx-auto text-info float-right"
        btn4.innerHTML = "Last Page";
        btn4.addEventListener('click', () => getExpenses(lastPage));
        pagination.appendChild(btn4);
    }
    

}

async function getExpenses(page){
    try{
        const parent = document.getElementById('expenseDetailsUl');
        while (parent.hasChildNodes()){
            parent.removeChild(parent.firstChild)
        }
        const response = await axios.get(`http://3.137.219.239:3000/expense/all?page=${page}&limit=${limit}`, { headers: {"Authorization" : token} });
        
        for (let i = 0; i < response.data.expenses.length; i++){
            expenseDetails(response.data.expenses[i]);
        }
        showPagination(response.data);
    } catch(err) {
        console.log(err);
    }
    
}
