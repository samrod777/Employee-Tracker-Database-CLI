const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "influence",
  database: "employee_db",
});

connection.connect(function (err) {
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
      "Update Employee Role",
      "Exit",
    ],
  },
];

function startApp() {
  inquirer.prompt(userQuestion).then(function (response) {
    switch (response.userChoice) {
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
        allDeparments();
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
    }
  })
}

function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What department would you like to add?",
        name: "newDept",
      }
    ])
    .then(function (response) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: response.newDept,
        },
        function (err) {
          if (err) throw err;
          console.log("New department has been added");

          startApp();
        }
      )
    })
}nod

function addRole() {
  let query = "SELECT * FROM department ORDER BY department_name ASC";

  connection.query(query, function (err, results) {
    if (err) throw err;

    let allDeparments = [];

    for (let i = 0; i < results.length; i++) {
      let eachDepartment = results[i].department_name;
      allDeparments.push(eachDepartment);
    }

    inquirer
      .prompt([
        {
          type: "input",
          message: "What role would you like to add?",
          name: "newRole",
        },
        {
          type: "input",
          message: "What is the salary for this new role?",
          name: "salary",
        },
        {
          type: "list",
          message: "In which department is this new role?",
          name: "dept",
          choices: [...allDeparments],
        },
      ])
      .then(function (response) {
        let chosenDeptId;

        for (let i = 0; i < results.length; i++) {
          if (results[i].department_name === response.dept) {
            chosenDeptId = results[i].id;
          }
        }

        connection.query(
          "INSERT INTO role SET ?",
          {
            title: response.newRole,
            salary: response.salary,
            department_id: chosenDeptId,
          },
          function (err) {
            if (err) throw err;
            console.log("New role has been added");

            startApp();
          }
        );
      });
  });
}

function addEmployee() {
  let query =
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id";

  connection.query(query, function (err, results) {
    if (err) throw err;

    let employeeNames = ["None"];
    let allRoles = [];

    for (let i = 0; i < results.length; i++) {
      let eachName = results[i].first_name + " " + results[i].last_name;
      employeeNames.push(eachName);

      let eachRole = results[i].title;
      allRoles.push(eachRole);
    }

    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the employee's first name?",
          name: "firstName",
        },
        {
          type: "input",
          message: "What is the employee's last name?",
          name: "lastName",
        },
        {
          type: "list",
          message: "Select the employee's title.",
          name: "title",
          choices: [...allRoles],
        },
        {
          type: "list",
          message: "Who is the employee's manager?",
          name: "empManager",
          choices: [...employeeNames],
        },
      ])
      .then(function (response) {
        let selectedRoleId = "";

        for (let i = 0; i < results.length; i++) {
          if (response.title === results[i].title) {
            selectedRoleId = results[i].role_id;
          }
        }

        let selectedManagerId = "";

        for (let i = 0; i < results.length; i++) {
          if (
            response.empManager ===
            results[i].first_name + " " + results[i].last_name
          ) {
            selectedManagerId = results[i].id;
          } else if (response.empManager === "None") {
            selectedManagerId = null;
          }
        }

        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: response.firstName,
            last_name: response.lastName,
            role_id: selectedRoleId,
            manager_id: selectedManagerId,
          },
          function (err) {
            if (err) throw err;
            console.log("Employee added to database.");

            startApp();
          }
        );
      });
  });
}

function allDeparments() {
  let query =
    "SELECT DISTINCT department_name AS Department FROM department ORDER BY department_name ASC";

  connection.query(query, function (err, results) {
    if (err) throw err;

    console.table(results);

    startApp();
  });
}

function allRoles() {
  let query = "SELECT DISTINCT title AS Title FROM role ORDER BY title ASC";

  connection.query(query, function (err, results) {
    if (err) throw err;

    console.table(results);

    startApp();
  });
}

function allEmployees() {
  let query =
    "SELECT employee.id AS Id, employee.first_name AS `First Name`, employee.last_name AS `Last Name`, role.title AS Title, department.department_name AS Department, role.salary AS Salary, CONCAT(m.first_name,' ',m.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee m ON employee.manager_id = m.id";

  connection.query(query, function (err, results) {
    if (err) throw err;

    console.table(results);

    startApp();
  });
}

function updateRole() {
  let query =
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id";

  connection.query(query, function (err, results) {
    if (err) throw err;

    let employeeNames = [];
    let allRoles = [];

    for (let i = 0; i < results.length; i++) {
      let eachName = results[i].first_name + " " + results[i].last_name;
      employeeNames.push(eachName);

      let eachRole = results[i].title;
      allRoles.push(eachRole);
    }

    inquirer
      .prompt([
        {
          type: "list",
          message: "Whose role would you like to update?",
          name: "name",
          choices: [...employeeNames],
        },
        {
          type: "list",
          message: "What is the employee's new role?",
          name: "role",
          choices: [...allRoles],
        },
      ])
      .then(function (response) {
        let selectedEmployeeId;
        let selectedRoleId;

        for (let i = 0; i < results.length; i++) {
          if (
            results[i].first_name + " " + results[i].last_name ===
            response.name
          ) {
            selectedEmployeeId = results[i].id;
          }
        }

        for (let i = 0; i < results.length; i++) {
          if (results[i].title === response.role) {
            selectedRoleId = results[i].role_id;
          }
        }

        connection.query(
          "UPDATE employee SET ? WHERE ?",
          [
            {
              role_id: selectedRoleId,
            },
            {
              id: selectedEmployeeId,
            },
          ],
          function (err) {
            if (err) throw err;

            console.log("Employee role updated.");

            startApp();
          }
        );
      });
  });
}
