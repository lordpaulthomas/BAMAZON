//List a set of menu options:
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

function mainMenu()  {
  inquirer
    .prompt([
      {
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"],
        name: "selection"
      }
    ])
    .then(function (response) {
      switch (response.selection) {

        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          lowInventory();
          break;
        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          addProduct();
          break;
        case "EXIT":
          connection.end()
          break;
        default: console.log("Error most likely my bad")
      }
    })

}
mainMenu();

function viewProducts() {
  // * View Products for Sale
  // * If a manager selects `View Products for Sale`, the app should list 
  // every available item: the item IDs, names, prices, and quantities.
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products",
    function (err, results) {
      if (err) throw err;
      console.table("Products For Sale", results)
      // for (let i = 0; i < results.length; i++) {
        // console.log("------------------------------------------------");

        // console.log(results[i].item_id + " | " + results[i].product_name + " | Price: $" + results[i].price + " | Amount: " + results[i].stock_quantity + " |")
      // }
      // console.log("------------------------------------------------")
      mainMenu();
    })
}

function lowInventory() {
  //* View Low Inventory
  //* If a manager selects `View Low Inventory`, then it should list all 
  // items with an inventory count lower than five.

  connection.query(" SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 3",
    function (err, results) {
      if (err) throw err;
     console.table("Low Inventory Items", results)
      mainMenu();
    })
}

function addInventory() {
  //* Add to Inventory
  //* If a manager selects `Add to Inventory`, your app should display a 
  //  prompt that will let the manager "add more" of any item currently in the store.
  const choicesArray = [];
  connection.query("SELECT * FROM products", function (error, results) {
    if (error) throw error;
    for (let i = 0; i < results.length; i++) {
      choicesArray.push(results[i].product_name)
    }
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which product inventory would you like to add to?",
          choices: choicesArray,
          name: "itemChoice"
        }
      ])
      .then(function (firstResponse) {
        var item = firstResponse.itemChoice;
        connection.query("SELECT stock_quantity FROM products WHERE product_name = ?", item, function (err, res) {
          if (err) throw err;
          console.log("Current quantity in stock: " + res[0].stock_quantity);
          inquirer
            .prompt([
              {
                type: "number",
                message: "What you like to change the quantity to?",
                name: "quantity"
              }
            ])
            .then(function (response) {
              var amount = response.quantity;
              console.log("Updating product: " + firstResponse.itemChoice + " quantitiy from: " + res[0].stock_quantity + " to: " + amount)
              connection.query("UPDATE products SET ? WHERE ?", [
                {
                  stock_quantity: amount
                },
                { 
                  product_name: firstResponse.itemChoice
                }
              ], 
                function (err, res) {
                  console.log(res.message)
                if (err) throw err;
                console.log("Product quantitiy successfully updated to " + amount + "\n" + res.message);
                mainMenu();
              })
            })
            .catch(function (err) {
              if (err) return err;
            })
        })
      })
      .catch(function (err) {
        if (err) return console.log(err);
      })
  })
}

function addProduct () {
  //* Add New Product
//* If a manager selects `Add New Product`, it should allow the manager to 
// add a completely new product to the store.
  inquirer
  .prompt([
    {
      type: "input",
      message: "What is the product name?",
      name: "productname"
    },
    {
      type: "input",
      message: "What department does this product belong in",
      name: "department"
    },
    {
      type: "number",
      message: "What is the price of this product?",
      name: "price"
    },
    {
      type: "number",
      message: "What is the quantity of this product?",
      name: "quantity"
    }
  ])
  .then(function(response){
    console.log(response.productname, response.department, response.price, response.quantity)
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: response.productname,
          department_name: response.department,
          price: response.price,
          stock_quantity: response.quantity
        },
        function(err, res){
          if(err) throw err;
          console.log(res)
          console.log("Product successfully added to inventory")
          mainMenu()
        }
      )
    })
  .catch(function(err){
    if (err) return err;
  })
}










