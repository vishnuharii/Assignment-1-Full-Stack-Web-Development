# Assignment-1-Full-Stack-Web-Development


Welcome to the Pet Store Application, a web app built with Express.js and MongoDB to manage pet products, allowing users to add, edit, and manage items in their shopping cart.


Features
Add New Pet Products: Users can add new pet items to the store.
Edit Existing Products: Modify details of existing pet items.
Shopping Cart Functionality: Users can add pets to their shopping cart and manage quantities.
View Cart Summary: Check total prices and item details in the cart.

Technologies Used
Node.js: JavaScript runtime for building the server-side application.
Express: Web framework for Node.js, used to create server and define routes.
MongoDB: NoSQL database for storing pet information.
Pug: Template engine for rendering views.
dotenv: Module for loading environment variables.

Usage
Navigate to the home page to view pet products.
Use the "Add" option to create new entries.
Edit or remove products as necessary.
Manage your shopping cart with the items you wish to purchase.


Installation
To set up this project on your local machine, follow these steps:

Clone the GitHub repository

Install the required dependencies: 
npm i

Run the development server:
npm run dev

Install Mongoose (if needed):

npm install mongoose

Install dotenv (if needed):

npm install dotenv

Set up your environment variables:

Create a .env file in the root directory and define your database URL as follows:

DB_URL=<your-mongodb-connection-string>
PORT=8888

API Endpoints
GET /
Render the home page with a list of available pets.
GET /pet/add
Render the page to add a new pet.
POST /pet/add/submit
Submit the new pet information to be added to the database.
GET /pet/edit?petId={id}
Render the page to edit an existing pet based on the provided petId.
POST /pet/edit/submit
Submit the edited pet information to update the database.
POST /pet/cart
Add a pet to the shopping cart.
GET /pet/cart/list
View the items currently in the shopping cart.
POST /pet/cart/list/remove
Remove an item from the shopping cart.

