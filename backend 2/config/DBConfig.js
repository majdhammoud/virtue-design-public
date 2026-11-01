require('dotenv').config();
const mongoose = require('mongoose');

const dbUri = process.env.DB_HOST;

if (!dbUri) {
    console.error("No MongoDB URI found in environment variables! Exiting...");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(dbUri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); 
    }
};

module.exports = connectDB;
