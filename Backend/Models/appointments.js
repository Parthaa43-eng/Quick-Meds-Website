const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient', // Refers to the Patient model
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the doctor (assumed to be a User model)
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
