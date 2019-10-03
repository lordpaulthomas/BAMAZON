mysql = require("mysql")
inquirer = require("inquirer")
colors = require("colors")

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});
connection.connect(function (err) {
  if (err) throw err;
  main();
})
function main() {
  inquirer
  .prompt([
    {
      type: "confirm",
      message: "Would yo like to make a purchase?",
      name: "start"
    }
  ])
  .then(function(response){
    if (response.start){
      chooseItem();
    }
    else {
      console.log("See you next time!")
      connection.end();
    }
  })
}



function chooseItem() {
  connection.query("SELECT * FROM products", function (error, results) {
    if (error) throw error;
    const choicesArray = []
    for (let i = 0; i < results.length; i++) {
      choicesArray[i] = results[i].product_name;
    }

  inquirer
      .prompt([
        {
          type: "list",
          message: "What product would you like to purchase?",
          choices: choicesArray,
          name: 'productChoice'
        }
      ])
      .then(function (results, error) {
        if (error) {return console.log(error) }
        connection.query("SElECT item_id FROM products WHERE product_name = ?", results.productChoice,
          function (err, results) {
            if (err) throw err;
            purchase(results[0].item_id)
          }
          )
      })
      .catch(function(error){
        if(error){console.log(error)}
      })    
    }   
  )}


function purchase(id) {
  inquirer
    .prompt([
      {
        type: 'number',
        message: 'How many units would you like to buy?',
        name: 'units'
      }
    ])
    .then(function (response, error) {
      if (error) {
        return console.log(error);
      }
      var quantity = parseInt(response.units)   
      connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;
        for (let i = 0; i < results.length; i++) {
          if (id === results[i].item_id) {
            console.log(results[i].product_name);
            if (quantity > results[i].stock_quantity) {
              console.log("Insufficient quantity!")
              main()
            }
            else {
              newQuantity = results[i].stock_quantity - quantity;
              price = quantity * results[i].price;
              console.log("Your total purchase is $" + price)
              fulfillPurchase(id, newQuantity, price)
            }
          }
        }
      })
    })
    .catch(function (error) {
      if (error) {
        return console.log(error)
      }
    })
}

function fulfillPurchase(num, quantity, price) {
  connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?", [quantity, price, num],
    function (err, res) {
      if (err) throw err;
      console.log("Quantity updated\n")
      main()
    }
  );
}
