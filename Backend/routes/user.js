const express = require("express");
const router = express.Router();
const User = require('../Models/user'); // Ensure this path is correct
const passport = require("passport");

// Signup Route (GET)
router.get("/signup", (req, res) => {
    res.render("users/identification.ejs");
});

router.get("/signup/doctor", (req, res) =>   {
    res.render("users/doctorsSignup.ejs");
});

// Signup Route (POST)
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body; // Capture username as well
    const newUser = new User({ username, email });  // Include username in the new user object
    try {
        const registeredUser = await User.register(newUser, password); // Register user
        console.log(registeredUser);
        res.redirect("/home"); // Redirect to home page on success
    } catch (error) {
        console.error("Error during registration:", error);
        res.redirect("/signup"); // Redirect back to signup on error
    }
});

// Login Route (GET)
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Login Route (POST)
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Authentication error:", err);
            return next(err); // Pass the error to the next middleware
        }
        if (!user) {
            console.log("Login failed:", info.message); // Print the error message
            return res.redirect("/login"); // Redirect back to login page on failure
        }
        
        // Log user information on successful login
        console.log("Login successful:"); // Print user details to console
        console.log( "Current User : " ,    user.username);
        req.logIn(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                return next(err); // Pass the error to the next middleware
            }
            return res.redirect("/home"); // Redirect to home page on successful login
        });
    })(req, res, next);
});

router.get("/logout" , ( req,res ,next) =>{
    req.logout( (err)=>{
        if(err){
            next(err);
        }
        console.log( " Logged Out!!");
        res.redirect("/home");
    })
})

// Export the router
module.exports = router;
