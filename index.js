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
    })
}
listOptions();

