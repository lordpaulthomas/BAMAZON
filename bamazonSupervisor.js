var mysql = require('mysql');
var inquirer = require('inquirer')
var cTable = require('console.table')
colors = require("colors")

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

console.log("------------------------".blue)
console.log("Welcome To Bamazon!".red)
console.log("------------------------\n".blue)

function mainMenu () {

  inquirer
  .prompt([{
    type: "list",
    message: "Menu Options",
    choices: ["View Product Sales by Department","Create New Department", "EXIT"],
    name: "menuOption"
  }])
  .then(function(response){
    switch(response.menuOption){
      case "View Product Sales by Department":
        viewByDepartment();
        break;
      case "Create New Department":
        newDepartment()
        break;
      case "EXIT":
        console.log("\nGoody Bye!\n".rainbow)
        connection.end();
        break;
      default: console.log("my bad".red)
    }
  })
  .catch(function(error){
    if(error) return error;
  })
}

function viewByDepartment(){
  connection.query(
    "SELECT department_id, departments.department_name, product_sales,overhead_cost, products.product_sales-departments.overhead_cost as TotalProfit FROM departments Left JOIN products ON departments.department_name=products.department_name ORDER BY department_id ASC",
    function(err, results){
      if (err) throw err;
      console.table(results);
      mainMenu()
    }
  )
}

function newDepartment() {
  inquirer
  .prompt([
    {
      type: "input",
      message: "What is the name of the department that you want to add?",
      name: "departmentName"
    },
    {
      type: "number",
      message: "What is the overhead cost for this department?",
      name: "overhead"
    }
  ])
  .then(function(response){
    connection.query("INSERT INTO departments SET ?",[
      {
        department_name: response.departmentName,
        overhead_cost: response.overhead
      }],
      function(err,results){
        if (err) throw err
        console.log("Department Succesfully Added!".green)
        console.log(results.affectedRows + " row(s) affected") 
        mainMenu();
      }
    )
  })
  .catch(function(error){
    if (error) return error;
  })
}
mainMenu()