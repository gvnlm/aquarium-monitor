require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('Connecting to database...');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to database.');
  } catch (err) {
    console.error(`Failed to connect to database: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
