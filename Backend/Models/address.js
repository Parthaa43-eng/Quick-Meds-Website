const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true }, // Optional for user identification
    phone: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Address', addressSchema);
