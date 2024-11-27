const express = require('express');
const router = express.Router();
const Address = require('../models/address.js'); // Update based on your folder structure



const { isLoggedin } = require("../middleware.js");

// Get all addresses
router.get('/address', isLoggedin ,  async (req, res) => {
    try {
        const addresses = await Address.find();
        
        res.render("Crud/addAddress.ejs");
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
});

// Add a new address
router.post('/add', async (req, res) => {
    const { fullName, email, phone, streetAddress, city, state, pincode, landmark } = req.body;

    if (!fullName || !email || !phone || !streetAddress || !city || !state || !pincode) {
        return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    const newAddress = new Address({
        fullName,
        email,
        phone,
        streetAddress,
        city,
        state,
        pincode,
        landmark,
    });

    try {
        await newAddress.save();
        res.redirect("/home");
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
});

// Delete an address
router.delete('/:id', async (req, res) => {
    try {
        const deletedAddress = await Address.findByIdAndDelete(req.params.id);
        if (!deletedAddress) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        res.status(200).json({ success: true, message: 'Address deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
});

module.exports = router;
