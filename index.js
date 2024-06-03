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
    data = data.listOptions;
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
        
        console.log(`Added ${data.addDepartment} to the database`)
    })
}

listOptions();

