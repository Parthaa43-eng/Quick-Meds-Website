const mongoose = require("mongoose");
const Schema  = mongoose.Schema;


const medsSchema = new mongoose.Schema({
    Drug: { type: String, required: true },
    Type: { type: String, required: true, enum: ['Medicine', 'Supplement', 'Baby Products', 'Beauty Products', 'Wellness'] },
    MRP: { type: Number, required: true },
    MFD: { type: Date, required: true },
    EXP: { type: Date, required: true},
    image: String

});


const meds = mongoose.model("meds" ,  medsSchema);
module.exports = meds;