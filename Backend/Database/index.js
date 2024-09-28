const mongoose = require("mongoose");
const data = require("./data.js"); // Importing data
const users = require("../Models/users.js");

const MongoDb_url = "mongodb://127.0.0.1:27017/Quick-meds";

async function main() {
    await mongoose.connect(MongoDb_url);
}

main().then(() => {
    console.log("Connection successful");
})
.catch((err) => {
    console.log(err);
});

const initDb = async () => {
    try {
        await  users.deleteMany({});
        await  users.insertMany(data.data); // Use data instead of initData
        console.log("Data is initialized");
    } catch (err) {
        console.error("Error initializing data:", err.message);
    }
};

initDb();