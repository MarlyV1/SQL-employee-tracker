require('dotenv').config();
const inquirer = require('inquirer');
const { Pool } = require('pg');
// const array = [];

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
            choices: ["John Doe", "Thalia Brown", "Michelle Johnson", "Alex Woods"]
        }
    ])
    .then((data) => {
        
        async function newEmployee() {
            try {
                const { firstName, lastName, manager, role } = data;
                const role_id = roleID(role);
                const manager_id = managerID(manager);
                const client = await pool.connect();
                const employeeData = await client.query(`insert into employee(first_name, last_name, role_id, manager_id) values($1, $2, $3, $4)`, [firstName, lastName, role_id, manager_id])
                console.log(employeeData);
                console.log(`Added ${firstName} ${lastName} to the database`)
            } catch (error) {
                console.log(error.message);
            }
        }
        newEmployee();
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
        async function newRole() {
           try {
                const { role, salary, department } = data;
                const department_id = departmentID(department);
                const client = await pool.connect();
                const roleData = await client.query(`insert into role (role, salary, department_id) values($1, $2, $3)`, [role, salary, department_id])
                console.log(roleData);
                console.log(`Added ${role} to the database`)
            } catch (error) {
                console.log(error.message);
            }
        }
        newRole();
    })
};

async function allEmployees() {
    try {
        
    } catch (error) {
        
    }
    const array = [];
    const client = await pool.connect();
    const updatedData = await client.query(`select first_name||' '||last_name as employee_name, id from employee;`);

    const rows = updatedData.rows
    

    rows.forEach((e) => {
        array.push(e.employee_name);
    })
    return array;
}

//Prompts the user to update a role
 async function updateRolePrompt() {
    
    const allEmployeeNames = [];
    const allRoles = [];
    const client = await pool.connect();
    const employeeData = (await client.query(`select first_name||' '||last_name as employee_name, id from employee;`)).rows;
    const rolesData = (await client.query(`select * from role;`)).rows;
    // const rows = employeeData.rows

    employeeData.forEach((data) => {
        allEmployeeNames.push(data.employee_name);
    })     
     rolesData.forEach((data) => {
        allRoles.push(data.role);
     })
    inquirer.prompt([
        {
            type: "list",
            name: 'employee',
            message: "Which employee's role do you want to update?",
            choices: allEmployeeNames
        },
        {
            type: "list",
            name: "role",
            message: "Which role do you want to assign the selected employee?",
            choices: allRoles
        }
    ])
    .then((data) => {
        updateRole(data, employeeData);
        console.log(`Updated ${data.employee}'s role to ${data.role}`);
    });
}

//Updates the role of an employee
async function updateRole(data, rows) {
    try {
        const { employee, role } = data;
        let role_id = await roleID(role);
        let id = '';

        // console.log(rows)
        rows.forEach((e) => {
            if(e.employee_name === employee){
                console.log(e.id);
                return id = e.id;
            }   
        });
        const client = await pool.connect();
        const updatedRole = await client.query(`update employee set role_id = $1 where id = $2`, [role_id, id]);
        console.log(updatedRole.rows);
    } catch (error) {
        console.error(error.message);
    } 
}


function employeeID(employee) {
    const employeeID = '';
    switch(employee) {
        case 'John Doe':
            employeeID = 1
            break;
        case 'Jane Smith':
            employeeID = 2
            break;
        case 'Thalia Brown':
            employeeID = 3
            break;
        case 'Tom Allen':
            employeeID = 4
            break;
        case 'Michelle Johnson':
            employeeID = 5
            break;
        case 'Paul Parker':
            employeeID = 6
            break;
        case 'Alex Woods':
            employeeID = 7
            break;
        case 'Horacio Cane':
            employeeID = 8;
    }
    return employeeID;
}

//Returns the department ID based on the role
function departmentID(department) {
    let departmentID = '';
    switch(department) {
        case 'Engineering':
            departmentID = 1
            break;
        case 'Finance':
            departmentID = 2
            break;
        case 'Legal':
            departmentID = 3
            break;
        case 'Sales':
            departmentID = 4;
    }
    return departmentID;
}

//Returns the role ID based on the role
async function roleID(role) {
    try {
        let roleID = '';

        const client = await pool.connect();
        const roles = (await client.query(`select * from role`)).rows;
        console.log(roles)
        roles.forEach((data) => {
            if(data.role === role) {
                console.log(data.id)
                roleID = data.id;
            }
        })
        return roleID;
    } catch (error) {
        console.error(error.message)
    }
};

//Returns the manager ID based on the manager name
function managerID(manager) {
    let managerID = '';
    switch(manager) {
        case 'John Doe':
            managerID = 1
            break;
        case 'Thalia Brown':
            managerID = 3
            break;
        case 'Michelle Johnson':
            managerID = 5
            break;
        case 'Alex Woods':
            managerID = 7;
    }
    return managerID;
}
// userOptions();
updateRolePrompt()