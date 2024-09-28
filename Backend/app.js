const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const users = require("./Models/users.js");
const data = require("./Database/data.js"); // Importing data
const port = 8080;


const MongoDb_url = "mongodb://127.0.0.1:27017/Quick-meds";

mongoose.connect(MongoDb_url)
    .then(() => {
        console.log("Connection successful");
        initDb(); // Call to initialize the database after successful connection
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err.message);
    });

const initDb = () => {
    users.deleteMany({})
        .then(() => users.insertMany(data.data))
        .then(() => {
            console.log("Data is initialized");
            startServer(); // Start the server after the database is initialized
        })
        .catch((err) => {
            console.error("Error initializing data:", err.message);
        });
};

// Set up Express app
const app = express();
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Routes


app.get("/home", async (req, res) => {
    const allUsers = await users.find({});
    res.render("Crud/index.ejs", { allUsers });
});

app.get ("/home/new" , (req , res) =>{
    res.render("Crud/new.ejs");
    res.redirect("/home");
})


// Start the server
const startServer = () => {
    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
};
