const expenseForm = document.getElementById('expenseForm');
const expensesTableBody = document.getElementById('expensesTableBody');
const totalAmount = document.getElementById('totalAmount');
const expenseCount = document.getElementById('expenseCount');
const highestExpense = document.getElementById('highestExpense');
const loadingSpinner = document.getElementById('loadingSpinner');

const API_URL = 'http://localhost:8001/api/expenses';

async function fetchExpenses() {
    loadingSpinner.style.display = 'block';

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const expenses = await response.json();
        return expenses;

    } catch (error) {
        console.error('Error fetching expenses:', error);
        showAlert(`Error loading expenses: ${error.message}`);
        return [];

    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function renderExpenses(expensesList) {
    expensesTableBody.innerHTML = '';

    for (const expense of expensesList) {

        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = expense.id;
        row.appendChild(idCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = expense.title;
        row.appendChild(titleCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = expense.amount.toFixed(2);
        row.appendChild(amountCell);

        const categoryCell = document.createElement('td');

        const categoryBadge = document.createElement('span');
        categoryBadge.textContent = expense.category;
        categoryBadge.classList.add('badge');

        const categoryColors = {
             Food: 'bg-success',
             Transport: 'bg-info',
             Bills: 'bg-warning',
            Entertainment: 'bg-primary',
            Other: 'bg-secondary'
        };

        categoryBadge.classList.add(categoryColors[expense.category]);

        categoryCell.appendChild(categoryBadge);
        row.appendChild(categoryCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(expense.date).toLocaleDateString();
        row.appendChild(dateCell);

        const actionsCell = document.createElement('td');

        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('btn', 'btn-dark');
        editBtn.dataset.id = expense.id;

        editBtn.addEventListener('click', () => {
            document.getElementById('editExpenseId').value = expense.id;
            document.getElementById('editTitle').value = expense.title;
            document.getElementById('editAmount').value = expense.amount;
            document.getElementById('editCategory').value = expense.category;
            document.getElementById('editDate').value =
                new Date(expense.date).toISOString().split('T')[0];
        });

        editBtn.setAttribute('data-bs-toggle', 'modal');
        editBtn.setAttribute('data-bs-target', '#editexpensemodal');

       
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.classList.add('ms-2');
        deleteBtn.dataset.id = expense.id;

        deleteBtn.addEventListener('click', async () => {

            const expenseId = deleteBtn.dataset.id;

            if (!confirm('Are you sure you want to delete this expense?')) {
                return;
            }

            try {
                const response = await fetch(`${API_URL}/${expenseId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }

                const updatedExpenses = await fetchExpenses();

                renderExpenses(updatedExpenses);
                updateSummary(updatedExpenses);

                const categoryTotals = calculateCategoryTotals(updatedExpenses);
                updateDonutChart(categoryTotals);

                showAlert('Expense deleted successfully.', 'success');

            } catch (error) {
                console.error('Error deleting expense:', error);
                showAlert(`Error deleting expense: ${error.message}`);
            }
        });

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);

        row.appendChild(actionsCell);
        expensesTableBody.appendChild(row);
    }
}

function updateSummary(expensesList) {

    const total = expensesList.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);

    const count = expensesList.length;

    const highest = expensesList.length > 0
        ? Math.max(...expensesList.map(expense => expense.amount))
        : 0;

    totalAmount.textContent = total.toFixed(2);
    expenseCount.textContent = count;
    highestExpense.textContent = highest.toFixed(2);
}


const categoryColors = {
    Food: '#35844b',
    Transport: '#357e87',
    Bills: '#f3ef6c',
    Entertainment: '#271c9c',
    Other: '#55464c'
};  

const ctx = document.getElementById('donutChart').getContext('2d');
const donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [categoryColors.Food, categoryColors.Transport, categoryColors.Bills, categoryColors.Entertainment, categoryColors.Other],
            borderWidth: 1
        }]  
    }

})

document.addEventListener('DOMContentLoaded', async () => {

    const expenses = await fetchExpenses();
    const categoryTotals = calculateCategoryTotals(expenses);

    renderExpenses(expenses);
    updateSummary(expenses);
    updateDonutChart(categoryTotals);
});



expenseForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const title = document.getElementById('title').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (!title || isNaN(amount) || !category || !date) {
        showAlert('Please fill in all fields correctly.');
        return;
    }

    if (amount <= 0) {
        showAlert('Amount must be greater than 0.');
        return;
    }

    if (!['Food', 'Transport', 'Bills', 'Entertainment', 'Other'].includes(category)) {
        showAlert('Invalid category selected.');
        return;
    }

    if (new Date(date) > new Date()) {
        showAlert('Date cannot be in the future.');
        return;
    }

    if (confirm('Are you sure you want to add this expense?')) {

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    amount,
                    category,
                    date
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            expenseForm.reset();

            const updatedExpenses = await fetchExpenses();

            renderExpenses(updatedExpenses);
            updateSummary(updatedExpenses);

            const categoryTotals = calculateCategoryTotals(updatedExpenses);
            updateDonutChart(categoryTotals);

            showAlert('Expense added successfully.', 'success');

        } catch (error) {
            console.error('Error adding expense:', error);
            showAlert(`Error adding expense: ${error.message}`);
        }
    }
});



const editExpenseForm = document.getElementById('editExpenseForm');

editExpenseForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const id = document.getElementById('editExpenseId').value;
    const title = document.getElementById('editTitle').value.trim();
    const amount = parseFloat(document.getElementById('editAmount').value);
    const category = document.getElementById('editCategory').value;
    const date = document.getElementById('editDate').value;

    if (!title || isNaN(amount) || amount <= 0 || !category || !date) {
        showAlert('Please enter valid values in all fields.');
        return;
    }

    if (new Date(date) > new Date()) {
        showAlert('Date cannot be in the future.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                amount,
                category,
                date
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || 'Failed to update expense.'
            );
        }

        const updatedExpenses = await fetchExpenses();

        renderExpenses(updatedExpenses);
        updateSummary(updatedExpenses);

        const categoryTotals = calculateCategoryTotals(updatedExpenses);
        updateDonutChart(categoryTotals);

        const modalElement = document.getElementById('editexpensemodal');
        const modal = bootstrap.Modal.getInstance(modalElement);

        modal.hide();

        showAlert('Expense updated successfully.', 'success');

    } catch (error) {
        console.error('Error updating expense:', error);
        showAlert(`Error updating expense: ${error.message}`);
    }
});



const filterCategorySelect = document.getElementById('filterCategory');

filterCategorySelect.addEventListener('change', async () => {

    const selectedCategory = filterCategorySelect.value;

    const expenses = await fetchExpenses();

    const filteredExpenses = selectedCategory
        ? expenses.filter(expense => expense.category === selectedCategory)
        : expenses;

    renderExpenses(filteredExpenses);
});

function calculateCategoryTotals(expensesList) {
    const totals = {
    Food: 0,
    Transport: 0,
    Bills: 0,
    Entertainment: 0,
    Other: 0
};


    for (const expense of expensesList) {
        if (totals.hasOwnProperty(expense.category)) {
            totals[expense.category] += expense.amount;
        }
    }

    return totals;
}


        
    

    




function calculateCategoryPercentages(categoryTotals) {
    const total = Object.values(categoryTotals).reduce((sum, amount) => {
        return sum + amount;
    }, 0);

    const percentages = {};

    for (const category in categoryTotals) {
        percentages[category] = total > 0
            ? (categoryTotals[category] / total) * 100
            : 0;
    }

    return percentages;
}


function updateDonutChart(categoryTotals) {
    const percentages = calculateCategoryPercentages(categoryTotals);

    donutChart.data.labels = Object.keys(categoryTotals).map(category => {
        return `${category} (${percentages[category].toFixed(1)}%)`;
    });

    donutChart.data.datasets[0].data = Object.values(categoryTotals);

    donutChart.update();
}


function showAlert(message, type = 'danger') {

    const alertElement = document.getElementById('myAlert');
    const alertMessage = document.getElementById('alertMessage');
    const closeBtn = alertElement.querySelector('.btn-close');

    alertMessage.textContent = message;

    alertElement.classList.remove('alert-danger', 'alert-success');
    alertElement.classList.add(`alert-${type}`);

    alertElement.style.display = 'block';

    closeBtn.onclick = () => {
        alertElement.style.display = 'none';
    };
}