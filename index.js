const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "influence",
  database: "EmployeeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runEmployeeDB();
});

function runEmployeeDB() {
    console.log("the database is working")
}

