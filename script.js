const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const form = document.getElementById("transaction-form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const transactionList = document.getElementById("transaction-list");

let transactions = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = Number(amountInput.value.trim());

  if (text === "" || isNaN(amount) || amount === 0) {
    alert("Please enter a valid name and non-zero amount.");
    return;
  }

  const transaction = {
    id: Date.now(),
    text,
    amount,
  };

  transactions.push(transaction);
  addTransactionToDOM(transaction);
  updateSummary();
  saveToLocalStorage();

  textInput.value = "";
  amountInput.value = "";
});

function addTransactionToDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const li = document.createElement("li");
  li.innerHTML = `
    ${transaction.text} 
    <span>${sign}€${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="deleteTransaction(${
      transaction.id
    })">❌</button>
  `;
  transactionList.appendChild(li);
}

function updateSummary() {
  const amounts = transactions.map((t) => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0);
  const incomeTotal = amounts
    .filter((a) => a > 0)
    .reduce((acc, val) => acc + val, 0);
  const expenseTotal = amounts
    .filter((a) => a < 0)
    .reduce((acc, val) => acc + val, 0);

  balance.innerText = `€${total.toFixed(2)}`;
  income.innerText = `+€${incomeTotal.toFixed(2)}`;
  expense.innerText = `-€${Math.abs(expenseTotal).toFixed(2)}`;
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateUI();
  saveToLocalStorage();
}

function updateUI() {
  transactionList.innerHTML = "";
  transactions.forEach(addTransactionToDOM);
  updateSummary();
}

function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("transactions");
  if (saved) {
    transactions = JSON.parse(saved);
    updateUI();
  }
});
