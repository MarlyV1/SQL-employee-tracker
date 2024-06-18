const inquirer = require('inquirer');


const listQuestion = [
    {
        type: "list",
        name: "listOptions",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "Add Role", "View All Departments", "Add Department", "Quit"]
    }
];


function listOptions() {
    return inquirer.prompt(listQuestion)
    .then((data) => {
    data = data.choices;
    // console.log(data);
    
    if (data === "View All Employees") {

    }else if(data === "Add Employee") {

    }else if (data === "Update Employee Role") {

    }else if (data === "Add Role") {

    }else if(data === "View All Departments") {

    }else if (data === "Add Department"){

    }
    return;
    // return listOptions();
    })
};

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What is the name of the department?"
        }
    ])
    .then((data) => {
        
        console.log(`Added ${data.department} to the database`)
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
            type: "input",
            name: "department",
            message: "Which department does the role belong to?",
            choices: ["Engineering", "Finance", "Legal", "Sales", "Service"]
        }
    ])
    .then((data) => {
        console.log(`Added ${role} to the database`)
    })
};

listOptions();

