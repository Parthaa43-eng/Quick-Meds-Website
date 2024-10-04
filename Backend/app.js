const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const users = require("./Models/users.js"); // User model
const validation = require("./Models/validation.js");
const data = require("./Database/data.js"); // Initial data for database seeding
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require("ejs-mate");
const passport = require("passport");
const localStratergy = require("passport-local");
const User = require('./Models/validation'); // Adjust the path as necessary
const userRouter = require("./routes/user.js");   

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
}

// Initialize database with initial data if empty
const initDb = async () => {
    const count = await users.countDocuments();
    if (count === 0) {
        await users.insertMany(data.data);
        console.log("Database is initialized");
    } else {
        console.log("Database already has data. Initialization skipped.");
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

app.use("/" , userRouter);

// Passport configuration
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/demouser" , async(req,res)=>{
    let fakeUser = new User({
        email:"abcd@email.com",
        username : "abcd"
    })

   let registerUser =  await User.register(fakeUser , "passwors");
   res.send(registerUser);
})

// Routes
app.get("/home", async (req, res) => {
    const allUsers = await users.find({});
    const deletedShop = req.session.deletedShop;

    res.render("Crud/index.ejs", {
        allUsers,
        deletedShopId: deletedShop ? deletedShop._id : null,
        shopName: deletedShop ? deletedShop.Shop_Name : null
    });

    req.session.deletedShop = null;
});

app.get("/home/new", (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Please log in first");
        return res.redirect("/login"); // Redirect to a valid route, use '/' or another route instead of an EJS file
    } else {
        res.render("Crud/new.ejs"); // Only render the form if the user is authenticated
    }
});



app.post("/home", async (req, res) => {
    const newOwner = new users(req.body.owner);
    await newOwner.save();
    res.redirect("/home");
});

app.get("/home/:id", async (req, res) => {
    const { id } = req.params;
    const user = await users.findById(id);
    res.render("Crud/show.ejs", { user });
});

app.get("/home/:id/edit", async (req, res) => {
    let { id } = req.params;
    let user = await users.findById(id);
    res.render("Crud/edit.ejs", { user });
});

app.put("/home/:id", async (req, res) => {
    let { id } = req.params;
    await users.findByIdAndUpdate(id, { ...req.body.owner });
    res.redirect("/home");
});

app.delete("/home/:id", async (req, res) => {
    const { id } = req.params;
    const deletedShop = await users.findByIdAndDelete(id);
    if (deletedShop) {
        req.session.deletedShop = deletedShop;
    }
    res.redirect("/home");
});

app.post("/home/undo/:id", async (req, res) => {
    const deletedShop = req.session.deletedShop;
    if (deletedShop) {
        await users.create({
            Shop_Name: deletedShop.Shop_Name,
            description: deletedShop.description,
            image: deletedShop.image,
            location: deletedShop.location,
            country: deletedShop.country
        });
        req.session.deletedShop = null;
        res.redirect("/home");
    } else {
        res.status(404).send('No deleted shop to restore');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

// Call main to start the application
main();
