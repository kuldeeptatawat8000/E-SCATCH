const mongoose = require('mongoose');
const dbgr = require("debug")("development:mongoose")
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    dbgr(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    dbgr('MongoDB connection failed:', error.message);
    process.exit(1); // app crash if DB fails
  }
};


module.exports = connectDB;
