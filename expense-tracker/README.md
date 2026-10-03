# Expense Tracker

A full-stack web application for managing personal expenses.
The application allows users to add, view, edit, delete, and filter expenses, while also providing summary information and a category-based donut chart.

## Features

* Add a new expense
* View all expenses in a table
* Edit an existing expense
* Delete an expense
* Filter expenses by category
* Display total amount of expenses
* Display the number of expenses
* Display the highest expense
* Display expenses by category using a donut chart
* Display the percentage of each category in the chart legend
* Loading spinner while fetching data
* Success and error alerts
* Frontend and backend validation

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap 
* Chart.js 

### Backend

* Node.js
* PostgreSQL



## Requirements

Before running the project, make sure you have:

* Node.js installed
* PostgreSQL installed and running
* A PostgreSQL database created for the project

## Database Setup

Create a PostgreSQL database and an `expenses` table with the required columns:

```sql
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL
);
```

## Running the Backend

Inside the `backend` folder, run:

```bash
node server.js
```

The backend API runs on:

```text
http://localhost:8001
```

## API Endpoints

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/expenses`     | Get all expenses  |
| GET    | `/api/expenses/:id` | Get one expense   |
| POST   | `/api/expenses`     | Add a new expense |
| PUT    | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

## Validation

The application performs validation on both the frontend and backend.

### Frontend validation includes:

* Required fields
* Valid numeric amount
* Amount must be greater than zero
* Valid expense category
* Date cannot be in the future

### Backend validation includes:

* Required fields
* Amount must be greater than zero
* Category must be one of the allowed categories
* Checking whether the requested expense exists before updating or deleting it

The allowed categories are:

```text
Food
Transport
Bills
Entertainment
Other
```

## How the Application Works

The frontend communicates with the Express backend using the JavaScript `fetch()` API.

The backend receives the requests, validates the data, communicates with PostgreSQL, and returns the appropriate response.

After adding, editing, or deleting an expense, the frontend fetches the updated data and refreshes:

* The expenses table
* Summary cards
* Donut chart
* Category percentages

## Summary and Chart

The dashboard displays:

* Total amount of all expenses
* Number of expenses
* Highest expense

The donut chart groups expenses by category and calculates each category's percentage based on the total expense amount.

For example:

```text
Category Percentage =
Category Total / Total Expenses × 100
```

Github repository link : https://github.com/raneem108/js-proj.git


Demo video link : https://drive.google.com/file/d/1HEHjq_ijKm7sYa9OP6zi2C6zqtVOHave/view?usp=sharing  

