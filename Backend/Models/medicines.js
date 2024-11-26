const mongoose = require("mongoose");
const Schema  = mongoose.Schema;




const medsSchema = new mongoose.Schema({
    Drug: { type: String, required: true },
    Type: { type: String, required: true, enum: ['Medicine', 'Supplement', 'Baby Products', 'Beauty Products', 'Wellness'] },
    MRP: { type: Number, required: true },
    MFD: { type: Date, required: true },
    EXP: { type: Date, required: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1592323818181-f9b967ff537c?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } // Use a valid path to your default image
});


const meds = mongoose.model("meds" ,  medsSchema);
module.exports = meds;