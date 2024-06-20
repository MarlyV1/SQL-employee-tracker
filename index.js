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
            choices: ["Jane Smith", "Tom Allen", "Paul Parker", "Horacio Cane"]
        }
    ])
    .then((data) => {
        console.log(`Added ${data.firstName} ${data.lastName} to the database`)
    })

    async function newEmployee() {
        const { firstName, lastName, role, manager } = data.name;
        const role_id = parseInt(roleID(role));
        const client = pool.connect();
        const employeeData = await client.query(`insert into employee(firstName, lastName, role_id, manager_id) values($1, $2, $3, $4)`, [firstName, lastName, role_id, manager_id])

    }
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

//Returns the role ID based on the role
function roleID(role) {
    const roleID = '';

    switch(role) {
        case 'Sales Lead':
             roleID = 1
            break;
        case 'Salesperson':
            roleID = 2
            break;
        case 'Lead Engineer':
            roleID = 3
            break;
        case 'Software Engineer':
            roleID = 4
            break;
        case 'Account Manager':
            roleID = 5
            break;
        case 'Accountant':
            roleID = 6
            break;
        case 'Legal Team Lead':
            roleID = 7
            break;
        case 'Lawyer':
            roleID = 8;
    }
    return roleID;
}

//Returns the manager ID based on the manager name
function managerID(manager) {
    const managerID = '';
    switch(manager) {
        case 'Jane Smith':
            managerID = 1
            break;
        case 'Tom Allen':
            managerID = 3
            break;
        case 'Paul Parker':
            managerID = 5
            break;
        case 'Horacio Cane':
            managerID = 7
            break;
    }
    return managerID;
}
// userOptions();
addDepartment();