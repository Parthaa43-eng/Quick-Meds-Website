const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const ownerSchema = new mongoose.Schema({
    Shop_Name: String,
    description: String,
    image: {
        filename: String,
        url: String
    },
    location: String,
    country: String,
});

const owner  = mongoose.model("owner" , ownerSchema);
module.exports = owner;