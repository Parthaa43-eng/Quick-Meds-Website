const express = require("express"); // Importing the Express library for creating the server
const mongoose = require("mongoose"); // Importing Mongoose for MongoDB interactions
const path = require("path"); // Importing path module to handle and transform file paths
const users = require("./Models/users.js"); // Importing the users model from the Models directory
const data = require("./Database/data.js"); // Importing initial data for database seeding
const port = 8080; // Defining the port on which the server will run
const methodOverride = require("method-override");
const session = require('express-session');
const ejsMate = require("ejs-mate");



const MongoDb_url = "mongodb://127.0.0.1:27017/Quick-meds"; // Defining the MongoDB connection string

// Initialize MongoDB connection
async function main() {
    await mongoose.connect(MongoDb_url); // Connecting to MongoDB
    console.log("Connection successful"); // Log successful connection
    await initDb(); // Initialize the database after successful connection
}

// Function to initialize the database
const initDb = async () => {
    const count = await users.countDocuments(); // Count the number of documents in the users collection
    if (count === 0) { // Check if the collection is empty
        await users.insertMany(data.data); // Insert initial data if the collection is empty
        console.log("Database is initialized"); // Log the database initialization
    } else {
        console.log("Database already has data. Initialization skipped."); // Log if data already exists
    }
};

// Set up Express app
const app = express(); // Initialize the Express app
app.set("view engine", "ejs"); // Set the view engine to EJS for rendering views
app.set("views", path.join(__dirname, "views")); // Set the directory for views
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the public directory
app.use(express.json()); // Middleware for parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded request bodies
app.use(methodOverride("_method")); // Use _method to override HTTP methods
app.engine("ejs" , ejsMate);

app.use(session({
    secret: 'your-secret-key', // Replace with your own secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
// Index route
app.get("/home", async (req, res) => {
    const allUsers = await users.find({});
    
    // Check if a shop was deleted and is stored in the session
    const deletedShop = req.session.deletedShop;

    // Prepare data to send to the view
    res.render("Crud/index.ejs", {
        allUsers,
        deletedShopId: deletedShop ? deletedShop._id : null, // Pass the deleted shop ID
        shopName: deletedShop ? deletedShop.Shop_Name : null // Pass the deleted shop name
    });

    // Clear the session after rendering to prevent showing the message again
    req.session.deletedShop = null; 
});

// New route
app.get("/home/new", (req, res) => {
    res.render("Crud/new.ejs"); // Render the form for creating a new user
});

// Create new shop
app.post("/home", async (req, res) => {
    const newOwner = new users(req.body.owner); // Create a new user from the form data
    await newOwner.save(); // Save the new user to the database
    res.redirect("/home"); // Redirect to the home page after saving
});

// Show route
app.get("/home/:id", async (req, res) => {
    const { id } = req.params; // Extract the user ID from the request parameters
    const user = await users.findById(id); // Find the user by ID in the database
    res.render("Crud/show.ejs", { user }); // Render the show.ejs template with the user data
});

// Edit route
app.get("/home/:id/edit", async (req, res) => {
    let { id } = req.params;
    let user = await users.findById(id);
    res.render("Crud/edit.ejs", { user });
});

// Update route
app.put("/home/:id", async (req, res) => {
    let { id } = req.params;  // Extract the ID from the URL
    await users.findByIdAndUpdate(id, { ...req.body.owner });  // Update the user with the form data
    res.redirect("/home");  // Redirect to the home page after updating
});

// Delete route
app.delete("/home/:id", async (req, res) => {
    const { id } = req.params;
    const deletedShop = await users.findByIdAndDelete(id);

    if (deletedShop) {
        req.session.deletedShop = deletedShop; // Store the deleted shop in session
    }

    res.redirect("/home");
});

// Undo route
app.post("/home/undo/:id", async (req, res) => {
    const deletedShop = req.session.deletedShop;

    if (deletedShop) {
        // Re-create the deleted shop, but ensure the image is a string
        await users.create({
            Shop_Name: deletedShop.Shop_Name,
            description: deletedShop.description,
            image: deletedShop.image, // Change this if your schema expects a different format
            location: deletedShop.location,
            country: deletedShop.country
        });
        
        req.session.deletedShop = null; // Clear the session after use
        res.redirect("/home"); // Redirect back to home page
    } else {
        res.status(404).send('No deleted shop to restore');
    }
});

app.get("/login" , (req,res)=>{
    res.render("Crud/login.ejs");
});

app.get("/signup" , (req,res)=>{
    res.render("Crud/signup.ejs");
})

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`); // Log the server start and URL
});

// Start the application
main(); // Call the main function to initiate the MongoDB connection and database initialization
