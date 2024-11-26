const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Patient', patientSchema);
