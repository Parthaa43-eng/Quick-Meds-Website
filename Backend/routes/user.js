const express = require("express");
const router = express.Router();
const User = require('../Models/user'); 
const passport = require("passport");
const flash = require("connect-flash"); // Assuming connect-flash is used

// Signup Route (GET)
router.get("/signup", (req, res) => {
    res.render("users/identification.ejs");
});

router.get("/signup/doctor", (req, res) => {
    res.render("users/doctorsSignup.ejs");
});

// Signup Route (POST)
router.post("/signup/doctor", async (req, res, next) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    console.log(newUser);

    try {
        const registeredUser = await User.register(newUser, password);
        console.log("Registered User:", registeredUser);
        req.flash("success", "Registration successful!");

        req.login(registeredUser, (err) => {  // Log the user in
            if (err) return next(err);
            res.redirect("/doctorsDashboard"); // Redirect to home after successful login
        });
    } catch (error) {
        console.error("Error during registration:", error);
        req.flash("error", "Registration failed. Please try again.");
        res.redirect("/signup");
    }
});


// Login Route (GET)
router.get("/login", (req, res) => {
    res.render("users/login.ejs", { message: req.flash("error") });
});

// Login Route (POST)
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Authentication error:", err);
            return next(err);
        }
        if (!user) {
            req.flash("error", info.message || "Login failed. Try again.");
            return res.redirect("/login");
        }
        console.log("Login successful:", user.username);
        req.logIn(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                return next(err);
            }
            res.redirect("/home");
        });
    })(req, res, next);
});

// Logout Route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        console.log("Logged Out!");
        req.flash("success", "You have logged out successfully.");
        res.redirect("/home");
    });
});

// Export the router
module.exports = router;
