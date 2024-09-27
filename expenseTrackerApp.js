// Expense Tracker Functionality

function handleFormSubmit(event) {
    event.preventDefault();

    const expenseAmount = document.getElementById('expenseAmount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const editIndex = document.getElementById('editIndex').value;

    if (editIndex) {
        expenses[editIndex] = { expenseAmount, description, category };
        document.getElementById('editIndex').value = ''; // Clear edit index
    } else {
        expenses.push({ expenseAmount, description, category });
    }

    localStorage.setItem('expenses', JSON.stringify(expenses));
    clearFormFields();
    displayExpenses();
}

function displayExpenses() {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';

    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    expenses.forEach((expense, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.textContent = `Amount: ${expense.expenseAmount}, Description: ${expense.description}, Category: ${expense.category}`;

        const buttonGroup = document.createElement('div');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Expense';
        deleteButton.className = 'btn btn-danger btn-sm ml-2';
        deleteButton.onclick = () => deleteExpense(index);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit Expense';
        editButton.className = 'btn btn-warning btn-sm';
        editButton.onclick = () => editExpense(index);

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);
        listItem.appendChild(buttonGroup);
        expenseList.appendChild(listItem);
    });
}

function deleteExpense(index) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
}

function editExpense(index) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expense = expenses[index];

    document.getElementById('expenseAmount').value = expense.expenseAmount;
    document.getElementById('description').value = expense.description;
    document.getElementById('category').value = expense.category;
    document.getElementById('editIndex').value = index; // Set the edit index
}

function clearFormFields() {
    document.getElementById('expenseAmount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').selectedIndex = 0; // Reset category dropdown
}

window.onload = displayExpenses;
