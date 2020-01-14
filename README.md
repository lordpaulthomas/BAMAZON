# BAMAZON
 
Licensing Information: READ LICENSE
---
Project source can be downloaded from https://github.com/lordpaulthomas/BAMAZON
----
Author
-----------
Paul Thomas

File List
---------
```
.:

.gitignore

LICENSE

README.md

bamazonCustomer.js

bamazonManager.js

bamazonSupervisor.js

package-lock.json

package.json

.:

```

Description of BAMAZON
-----------
BAMAZON is a faux marketplace that useds both **Node.js** and a  **MySQL** database to create, read, update inventory.  This app has three javascript files that interact with 
the database:

* A Customer file that can make purchases.

* A Manager file that can view, update and add products.

* A Supervisor file that can view products by department, overhead sales and sales profit.  

Requirements
---------------
Both Node.js and MySQL are required to run this program.

Installation
-------
Clone repository to desired folder
```git clone https://github.com/lordpaulthomas/BAMAZON.git```
Navigate into cloned directory
```cd BAMAZAON/```
Install all node dependencies
```npm install```
-----
- To use system as Customer enter:
```node bamazonCustomer.js```
- To use system as Manager enter:
```node bamazonManager```
- To use system as Supervisor enter:
```node bamazonSupervisor.js```
------
Required node_modules
---------------------
``` mysql ```

``` inquirer ```

``` console.table ```

``` colors ```

Example GIF
----------------------

<img src="https://media.giphy.com/media/LmrwrZJziYEQTZYDUq/giphy.gif" width="500" height="500" />

Click link below to go to Full Example Video

https://drive.google.com/file/d/14-qnfUcnZu-HX2B0aICNg1KHRHvmCQi-/view?usp=sharing
