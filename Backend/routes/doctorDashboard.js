const express = require("express");
const router = express.Router();
const Appointment = require('../Models/appointments'); // Assuming you have an Appointment model
const Patient = require('../Models/Patient'); // Assuming you have a Patient model
const { isLoggedin } = require("../middleware.js"); // Middleware for login check
const appointments = require("../Models/appointments");

// Doctor's Dashboard Route (GET)
router.get("/dashboard", isLoggedin, (req, res) => {
    res.render("doctor/dashboard.ejs"); // Render the doctor's dashboard page
});

router.get("/appointments", (req, res) => {
    res.render("doctor/appointments.ejs");
});



module.exports = router;