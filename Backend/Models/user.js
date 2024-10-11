const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Define the user schema
const userIdentity = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures unique usernames
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures unique emails
    }
});

// Apply the passport-local-mongoose plugin to the userIdentity schema
userIdentity.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userIdentity);
