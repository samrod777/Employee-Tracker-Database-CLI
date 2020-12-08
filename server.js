const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "influence",
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  startApp();
});

const userQuestion = [
  {
      type: "list",
      message: "What would you like to do?",
      name: "userChoice",
      choices: [
          "Add Department",
          "Add Role",
          "Add Employee",
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "View All Employees by Department",
          "Remove Employee",
          "Update Employee Role",
          "Exit"
      ]
  }
]

// Function to begin the application
function startApp() {   
  inquirer
      .prompt(
          userQuestion
      )
      .then(function(response) {
          switch(response.userChoice) {
              case "Add Department":
                addDept();
              break;

              case "Add Role":
                  addRole();
              break;

              case "Add Employee":
                  addEmployee();
              break;

              case "View All Departments":
                  allDepts();
              break;

              case "View All Roles":
                  allRoles();
              break;

              case "View All Employees":
                  allEmployees();
              break;

              case "Update Employee Role":
                  updateRole();
              break;

              case "Exit":
                  connection.end();

              // case "View All Employees by Department":
              //     allEmployeesByDept();
              // break;
              
              // case "Remove Employee":
              //     removeEmployee();
              // break;
         
          }
      })
}

function addDept() {
  inquirer
  .prompt([
      {
          type: "input",
          message: "What department would you like to add?",
          name: "newDept"
      }
  ]).then(function(response) {
      connection.query("INSERT INTO department SET ?", 
          {
            department_name: response.newDept
          },
          function(err) {
              if (err) throw err;
              console.log("New department has been added");

              startApp();
          })            
      })
}


