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

//Prompts the user about what they want to do
function userOptionsPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "listOption",
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
        }
    ])
    .then((data) => {
         userOptions(data);
    })
};

//Prompts the user to add a new department
function addDepartmentPrompt() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What is the name of the new department?"
        }
    ])
    .then((data) => {
        newDepartment(data);
    })
};

//Prompts the user to add a new employee
async function addEmployeePrompt() {
    let allManagers = ["None"];
    const allRoles = [];

    const client = await pool.connect();
    const roles = (await client.query(`select * from role`)).rows;
    const managers = (await client.query(`select employee.first_name||' '||employee.last_name as manager_name, id from employee where manager_id is null;`)).rows;

    roles.forEach((data) => {
        allRoles.push(data.title);
    })

    managers.forEach((data) => {
        allManagers.push(data.manager_name);
    })

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
            choices: allRoles
        },
        {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: allManagers
        }
    ])
    .then((data) => {
        newEmployee(data, managers);
     })
};

//Prompts the user to add a new role
async function addRolePrompt() {
    let  allDepartments = [];

    const client = await pool.connect();
    const departments = (await client.query(`select * from department`)).rows;
    departments.forEach((data) => {
        allDepartments.push(data.name);
    });

    inquirer.prompt([
        {
            type: "input",
            name: "title",
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
            choices: allDepartments
        }
    ])
    .then((data) => {
       newRole(data, departments);
    })
};

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
        allRoles.push(data.title);
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
};

async function userOptions(data) {
    const client = await pool.connect();
    const { listOption } = data;

    const viewEmployees = (await client.query(`select e.id, e.first_name || ' ' || e.last_name AS employee, role.title, department.name as department, role.salary, m.first_name || ' ' || m.last_name AS manager from employee e LEFT JOIN employee m ON m.id = e.manager_id Join role on e.role_id = role.id Join department on role.department_id = department.id;`)).rows;

    const viewRoles = (await client.query(`select r.id, r.title, d.name as department, r.salary from role r join department d on r.department_id = d.id;`)).rows;
   
    const viewDepartments = (await client.query(`select * from department`)).rows;
    switch(listOption) {
        case "View All Employees":
            console.table(viewEmployees);
            userOptionsPrompt()
            break;
        case "Add Employee":
            addEmployeePrompt();
            break;
        case "Update Employee Role":
            updateRolePrompt();
            break;
        case "View All Roles":
            console.table(viewRoles);
            userOptionsPrompt();
            break;
        case "Add Role":
            addRolePrompt();
          break;
        case "View All Departments":
            console.table(viewDepartments);
            userOptionsPrompt();
          break;
        case "Add Department":
            addDepartmentPrompt();
      }
}

//Adds the new role to the database
async function newRole(data, departments) {
    try {
        let department_id = '';
        const { title, salary, department } = data;
        departments.forEach((data) => {
            if(data.name === department) {
                return department_id = data.id;
            }
        })
        const client = await pool.connect();
        const roleData = await client.query(`insert into role (title, salary, department_id) values($1, $2, $3)`, [title, salary, department_id])
        // console.log(roleData);
        console.log(`Added ${title} to the database`);
        userOptionsPrompt();
     } catch (error) {
         console.error(error.message);
     }
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
                // console.log(e.id);
                return id = e.id;
            }   
        });
        const client = await pool.connect();
        const updatedRole = await client.query(`update employee set role_id = $1 where id = $2`, [role_id, id]);
        // console.log(updatedRole.rows);
        console.log(`Updated ${employee}'s role to ${role}`)
        userOptionsPrompt();
    } catch (error) {
        console.error(error.message);
    } 
}

//Returns the role ID based on the role
async function roleID(role) {
    try {
        let roleID = '';

        const client = await pool.connect();
        const roles = (await client.query(`select * from role`)).rows;
        // console.log(roles)
        roles.forEach((data) => {
            if(data.title === role) {
                // console.log(data.id)
                roleID = data.id;
            }
        })
        return roleID;
    } catch (error) {
        console.error(error.message)
    }
};

//Adds the new employee to the database
async function newEmployee(data, managers) {
    
    try {
        let manager_id = '';
        const { firstName, lastName, role, manager } = data;
        let role_id = await roleID(role);

        managers.forEach((e) =>{
            if(e.manager_name === manager) {
                manager_id = e.id;
            } else {
                manager_id = null;
            }
        })
        const client = await pool.connect();
        const employeeData = await client.query(`insert into employee(first_name, last_name, role_id, manager_id) values($1, $2, $3, $4)`, [firstName, lastName, role_id, manager_id])
        console.log(`Added ${firstName} ${lastName} to the database`);
        userOptionsPrompt();
    } catch (error) {
        console.error(error.message);
    }
};

//Adds the new department to the database
async function newDepartment(data) {
    try {
        const { department } = data;
        const client = await pool.connect();
        const departmentData = await client.query(`insert into department(name) values ($1)`, [department])
        // console.log(departmentData);
        console.log(`The ${department} department was added`);
        userOptionsPrompt();
    } catch (error) {
        console.error(error.message);
    }
};

userOptionsPrompt();