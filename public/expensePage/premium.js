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
        // console.log(getUserInfo.data);
        if(getUserInfo.data.isPremiumMember !== true){
            window.location.href = "../expensePage/expensePage.html"; 
        }

        const getReportInfo = await axios.get('http://3.137.219.239:3000/premium/user/download/all', { headers: {"Authorization" : token} });
        for (let i = 0; i < getReportInfo.data.AllURLs.length; i++){
            reportDetails(getReportInfo.data.AllURLs[i].fileurl);
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
    
        const obj = {
            amount,
            category,
            description
        }
        const lastExpense = await axios.post('http://3.137.219.239:3000/expense/add', obj, { headers: {"Authorization" : token} });
        expenseDetails(lastExpense.data.newExpenseData);
        window.location.href = "premium.html";
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
            window.location.href = "premium.html";
        }
        catch (err) {
            console.log(err);
            document.body.innerHTML += `<h4> Something went wrong</h4>`
        }
        
    }

}

const btnLB = document.getElementById("btnLeaderBoard");
btnLB.addEventListener("click", getLeaderBoardFromDB);



async function getLeaderBoardFromDB(){

    try{
        const getLeaderboard = await axios.get("http://3.137.219.239:3000/premium/allexpenses", { headers: {"Authorization" : token} });
        btnLB.style.display = "none";
        for (let i = 0; i < getLeaderboard.data.allExpenseDataFromDB.length; i++){
            leaderBoardDetails(getLeaderboard.data.allExpenseDataFromDB[i]);
        }
    }
    catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4> Something went wrong</h4>`
    }
    
}

function leaderBoardDetails(obj){
    const parentElem = document.getElementById('leaderBoard');
    const newli = document.createElement('li');
    newli.textContent = obj.name + "-" + obj.totalExpense
    newli.className = "list-group-item";
    parentElem.appendChild(newli);
}


document.getElementById("reportDownload").addEventListener("click", downloadReport);

async function downloadReport(){
    const response = await axios.get(`http://3.137.219.239:3000/premium/user/download`, { headers: {"Authorization" : token} });
    
    if(response.status === 200){
        const a = document.createElement('a');
        a.href = response.data.fileURL;
        a.download = 'myexpense.csv';
        a.click();
        
        reportDetails(response.data.fileURL);

    } else {
        throw new Error(response.data.message)
    }
}

function reportDetails(URL){
    const parenElem = document.getElementById('reportDownloadul');
    const newli = document.createElement('li');
    newli.className = "list-group-item";
    const a = document.createElement('a');
    a.href = URL;
    a.textContent = "Download Report";
    newli.appendChild(a)
    
    parenElem.appendChild(newli);
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