const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Define the user schema
const userIdentity = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Add any additional fields here, such as password, name, etc.
});

// Add passport-local-mongoose plugin to the schema
userIdentity.plugin(passportLocalMongoose);

// Export the User model
module.exports = mongoose.model("User", userIdentity);
