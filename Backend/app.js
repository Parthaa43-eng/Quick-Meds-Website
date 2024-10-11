const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const users = require("./Models/users.js"); // User model
const meds = require("./Models/medicines.js"); // Medicine model
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require("ejs-mate");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require('./Models/user.js'); // User for passport auth
const userRouter = require("./routes/user.js"); // User routes
const { isLoggedin } = require("./middleware.js");
// Session configuration options
const sessionOptions = {
    secret: 'your_secret_key', // Replace with your secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to 'true' if using HTTPS
};

const MongoDb_url = "mongodb://127.0.0.1:27017/Quick-meds";
const port = 8080;

// Connect to MongoDB and initialize the database
async function main() {
    await mongoose.connect(MongoDb_url);
    console.log("Connection successful");
    await initDb();
    await initMedsDb(); // Keeping medicine DB initialization
}

// Initialize users collection with initial data if empty
const initDb = async () => {
    const count = await users.countDocuments();
    if (count === 0) {
        await users.insertMany(data.data);
        console.log("User database initialized");
    } else {
        console.log("User database already has data. Initialization skipped.");
    }
};

// Initialize medicines collection with initial data
const initMedsDb = async () => {
    const count = await meds.countDocuments();
    if (count === 0) {
        await meds.insertMany(medsData);
        console.log("Medicines database initialized");
    } else {
        console.log("Medicines database already has data. Initialization skipped.");
    }
};

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
 
// Middleware setup
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes for user authentication and management
app.use("/", userRouter);

/**
 * Passport configuration for user authentication
 */
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * Route for the main page
 */
app.get("/home", async (req, res) => {
    const allUsers = await users.find({});
    res.render("Crud/index.ejs", { allUsers });
});

/**
 * Route to render form for adding new user
 * Protected by login check
 */


// Route to display all shops (all users)
app.get("/shops", async (req, res) => {
    const allUsers = await users.find({});
    res.render("Crud/shop.ejs", { allUsers });
});

app.get("/shops/new",isLoggedin ,  (req, res) => {
        res.render("Crud/new.ejs");
});
// Add new shop
app.post("/shops", async (req, res) => {
    try {
        const newOwner = new users(req.body.owner);
        await newOwner.save();
        res.redirect("/shops");
    } catch (error) {
        console.error("Error creating shop:", error);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * Route to display individual shop details
 */
app.get("/shops/:id", async (req, res) => {
    const { id } = req.params;
    const user = await users.findById(id);
    res.render("Crud/show.ejs", { user });
});
/**
 * Route to render edit form for shop
 */
app.get("/shops/:id/edit",  async (req, res) => {
    let { id } = req.params;
    let user = await users.findById(id);
    res.render("Crud/edit.ejs", { user });
});

/**
 * Route to update shop information
 */
app.put("/shops/:id", async (req, res) => {
    const { id } = req.params; // Corrected destructuring
    await users.findByIdAndUpdate(id, { ...req.body.owner });
    res.redirect("/shops");
});

/**
 * Route to delete a shop
 */
app.delete("/shops/:id", async (req, res) => {
    const { id } = req.params.id;
    const deletedShop = await users.findByIdAndDelete(id);
    if (deletedShop) {
        req.session.deletedShop = deletedShop;
    }
    res.redirect("/shops");
});



// Route to display all medicines
app.get("/medicines", async (req, res) => {
    try {
        // Filter for medicines only
        let allMeds =  await meds.find({});
        res.render("medicines/index.ejs", { allMeds });
    } catch (err) {
        console.error("Error fetching medicines:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/about" , (req,res)=>{
    res.render("medicines/about.ejs");
})


// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

// Call main to start the application
main();
