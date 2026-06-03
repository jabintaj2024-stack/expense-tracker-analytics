const form =
document.getElementById("expenseForm");

const tableBody =
document.getElementById("expenseTable");

const searchInput =
document.getElementById("searchInput");

const filterCategory =
document.getElementById("filterCategory");

let chart;

loadExpenses();

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const expense = {

title:
document.getElementById("title").value,

amount:
document.getElementById("amount").value,

category:
document.getElementById("category").value,

expense_date:
document.getElementById("date").value

};

await fetch("/api/expenses",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(expense)

});

form.reset();

loadExpenses();

});

async function loadExpenses(){

const response =
await fetch("/api/expenses");

const expenses =
await response.json();

renderTable(expenses);

updateDashboard(expenses);

drawChart(expenses);

}

function renderTable(expenses){

tableBody.innerHTML="";

expenses.forEach(expense=>{

tableBody.innerHTML += `

<tr>

<td>${expense.id}</td>

<td>${expense.title}</td>

<td>₹${expense.amount}</td>

<td>${expense.category}</td>

<td>${expense.expense_date.split("T")[0]}</td>

<td>

<button
class="delete-btn"
onclick="deleteExpense(${expense.id})">

Delete

</button>

</td>

</tr>

`;

});

}

function updateDashboard(expenses){

let total = 0;
let highest = 0;

const categoryTotals = {};

expenses.forEach(expense=>{

const amount =
Number(expense.amount);

total += amount;

if(amount > highest){

highest = amount;

}

categoryTotals[expense.category] =
(categoryTotals[expense.category] || 0)
+ amount;

});

let topCategory = "-";
let maxCategory = 0;

for(let category in categoryTotals){

if(categoryTotals[category] > maxCategory){

maxCategory =
categoryTotals[category];

topCategory =
category;

}

}

document.getElementById(
"totalExpense"
).innerText =
"₹" + total;

document.getElementById(
"totalTransactions"
).innerText =
expenses.length;

document.getElementById(
"highestExpense"
).innerText =
"₹" + highest;

document.getElementById(
"topCategory"
).innerText =
topCategory;

}

async function deleteExpense(id){

await fetch(`/api/expenses/${id}`,{

method:"DELETE"

});

loadExpenses();

}

searchInput.addEventListener(
"keyup",
filterExpenses
);

filterCategory.addEventListener(
"change",
filterExpenses
);

async function filterExpenses(){

const response =
await fetch("/api/expenses");

const expenses =
await response.json();

const search =
searchInput.value.toLowerCase();

const category =
filterCategory.value;

const filtered =
expenses.filter(expense=>{

const matchesSearch =

expense.title
.toLowerCase()
.includes(search);

const matchesCategory =

category === ""
||
expense.category === category;

return matchesSearch &&
matchesCategory;

});

renderTable(filtered);

}

function drawChart(expenses){

const categoryTotals = {};

expenses.forEach(expense=>{

categoryTotals[expense.category] =

(categoryTotals[expense.category] || 0)

+

Number(expense.amount);

});

const labels =
Object.keys(categoryTotals);

const values =
Object.values(categoryTotals);

const ctx =
document.getElementById("categoryChart");

if(chart){

chart.destroy();

}

chart = new Chart(ctx,{

type:"pie",

data:{

labels:labels,

datasets:[{

data:values

}]

}

});

}