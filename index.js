//import required modules
const express = require("express");
const path = require("path");
require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");

//set up Express app
const app = express();
const port = process.env.PORT || 8888;
const dbUrl = process.env.DB_URL;
const client = new MongoClient(dbUrl);

//define important folders
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//setup public folder
app.use(express.static(path.join(__dirname, "public")));

//Set up app to use json 
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//PAGE ROUTES
app.get("/", async (request, response) => {  
    let petInfo = await getPetInfo();
    let result = await getPetForCart();
    response.render("index", { title: "Pet Store", petInfos: petInfo, itemCount: result.length });
});

app.get("/pet/add",async(request, response)=>{
    let result = await getPetForCart();
    response.render("pet-add", { pageTitle: "Add new Product", itemCount: result.length });
});


app.post("/pet/add/submit",async (request, response)=>{

    let name = request.body.name;
    let description = request.body.description;
    let price = request.body.price;

    let newPet = { "name": name, "price": price, "description": description, "quantity": 0, "isItemAdded": false}
    addPet(newPet); //insert new pet to petInfo
    response.redirect("/");
});

app.get("/pet/edit",async(request, response) =>{
   
    if (request.query.petId) {
        let petToEdit = await getSinglePet(request.query.petId);
        
        response.render("pet-edit", { pageTitle: "Edit Product details", editPet: petToEdit });
    } 
    else {
        response.redirect("/");
    }
});

app.post("/pet/edit/submit", async (request, response)=>{

    let idFilter = { _id: new ObjectId(request.body.petId) };
    
    let name = request.body.name;
    let description = request.body.description;
    let price = request.body.price;

    let doc = {
        $set:{
            "name": name,
            "description": description,
            "price": price
        },
    };

    await editPet(idFilter, doc); 
    response.redirect("/");
});

app.post("/pet/cart", async (request, response)=>{

    let result = await getPetForCart();
    if (request.body.petId) {
        if(result.filter(a=>a._id == request.body.petId).length == 0){
            let idFilter = { _id: new ObjectId(request.body.petId) };

            let doc = {
                $set:{
                    "isItemAdded": true,
                    "quantity": 1
                },
            };
    
            await editPet(idFilter, doc);
    
            response.redirect("/pet/cart/list");
        }
        else{
            let idFilter = { _id: new ObjectId(request.body.petId) };

            let doc = {
                $set:{
                    "quantity": (result.filter(a=>a._id == request.body.petId)[0]?.quantity) + 1
                },
            };

            await editPet(idFilter, doc);
            response.redirect("/pet/cart/list");
        }
    } 
    else {
        response.redirect("/");
    }
});

app.get("/pet/cart/list", async (request, response)=>{
    let result = await getPetForCart();
    let total = 0;
    if(result.length > 0){
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            total += element.price * element.quantity;
        }
    }
    response.render("pet-cart", { pageTitle: "Shopping Cart", cartItems: result, totalPrice: total.toFixed(2), itemCount: result.length });
});

app.post("/pet/cart/list/remove", async (request, response)=>{

    let result = await getPetForCart();
    if (request.body.petId) {
        if(result.filter(a=>a._id == request.body.petId)){
            let idFilter = { _id: new ObjectId(request.body.petId) };
            let doc;

            if((result.filter(a=>a._id == request.body.petId)[0]?.quantity) - 1 > 0){
                doc = {
                    $set:{
                        "quantity": (result.filter(a=>a._id == request.body.petId)[0]?.quantity) - 1
                    },
                };
            }else{
                doc = {
                    $set:{
                        "isItemAdded" : false,
                        "quantity": 0
                    },
                };
            }
            
            await editPet(idFilter, doc);
    
            response.redirect("/pet/cart/list");
        }
        else{
            response.redirect("/pet/cart/list");
        }
    } 
    else {
        response.redirect("/");
    }
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

//Database functions
// Function to connect with databse 
async function connection(){
    db = client.db("Pet_Store");
    return db;
}

// FUnction to get all pet items from the database
async function getPetInfo(){
    db = await connection();
    let results = db.collection("petInfo").find({});

    resultArray = await results.toArray();
    return resultArray;
}

//Function to insert document into petInfo collection using insertOne().
async function addPet(pet) {
    db = await connection();
    let status = await db.collection("petInfo").insertOne(pet);
    console.log("Pet added", status);
}

// FUnction to get get pet item from the database
async function getSinglePet(id) {
    db = await connection();
    editId = { _id: new ObjectId(id) };

    const result = await db.collection("petInfo").findOne(editId);
    return result;
}

//Function to edit the item into the database
async function editPet(filter, pet){
    db = await connection();
    
    const result = await db.collection("petInfo").updateOne(filter, pet);
    console.log("Updated");
    return result;
}

//Function to get from the database which are already added into the cart
async function getPetForCart(){
    db = await connection();

    const results = await db.collection("petInfo").find({isItemAdded: true});
    resultArray = await results.toArray();
    console.log("Fetched");

    return resultArray;
}