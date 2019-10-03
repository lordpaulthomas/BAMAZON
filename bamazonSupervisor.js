var mysql = require('mysql');
var inquirer = require('inquirer')
var cTable = require('console.table')

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});


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
        console.log("Goody Bye!")
        connection.end();
        break;
      default: console.log("my bad")
    }
  })
  .catch(function(error){
    if(error) return error;
  })
}

function viewByDepartment(){
  connection.query(
    "SELECT department_id, departments.department_name, product_sales,overhead_cost, products.product_sales-departments.overhead_cost as TotalProfit FROM departments Left JOIN products ON departments.department_name=products.department_name",
    function(err, results){
      if (err) throw err;
      console.table(results);
      mainMenu()
    }
  )
}

function newDepartment() {

}
mainMenu()