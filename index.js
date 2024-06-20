require('dotenv').config();
const inquirer = require('inquirer');
const { Pool } = require('pg');

//Connects to the employees database
const pool = new Pool(
    {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: 'employees_db'
    },
    console.log('Connected to employees_db database')
)

function userOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "listOptions",
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "Add Role", "View All Departments", "Add Department", "Quit"]
        }
    ])
        .then((data) => {
            console.log(data);

            data = data.choices;

            if (data === "View All Employees") {

            } else if (data === "Add Employees") {

            } else if (data === "Update Employee Role") {
                updateEmployeeRole();
            } else if (data === "Add Role") {
                addRole();
            } else if (data === "View All Departments") {

            } else if (data === "Add Department") {
                addDepartment();
            }
            return;
        })

}



function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What is the name of the department?"
        }
    ])
    .then((data) => {
       
        async function department() {
            try {
                const department = data.department;
                const client = await pool.connect();
                const departmentData = await client.query(`insert into department(name) values ($1)`, [department])
                console.log(departmentData);
                console.log(`Added ${department} to the database`)
            } catch (error) {
                console.log(error.message);
            }
        }
        department();
    })
};

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: ["Sales Lead", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer", "Customer Service"]
        },
        {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: ["Jane Smith", "Tom Allen", "Paul Parker", "Horacio Caner"]
        }
    ])
        .then((data) => {
            console.log(`Added ${data.firstName} ${data.lastName} to the database`)
        })
};

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "role",
            message: "What is the name of the role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department",
            message: "Which department does the role belong to?",
            choices: ["Engineering", "Finance", "Legal", "Sales", "Service"]
        }
    ])
        .then((data) => {
            console.log(`Added ${role} to the database`)
        })
};

function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: "list",
            name: 'employee',
            message: "Which employee's role do you want to update?",
            choices: ["John Doe", "Jane Smith", "Thalia Brown", "Tom Allen", "Michelle Johnson", "Paul Parker", "Alex Woods", "Horacio Cane"]
        },
        {
            type: "list",
            name: "role",
            message: "Which role do you want to assign the selected employee?",
            choices: ["Sales Lead", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer", "Customer Service"]
        }
    ])
        .then((data) => {
            console.log("Updated employee's role")
        })
}

// userOptions();
addDepartment();