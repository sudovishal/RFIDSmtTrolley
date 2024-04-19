const mongoose = require("mongoose")

const connectDB = async () => {
    try {
      const connectionInstance = await mongoose.connect(
        `${process.env.MONGO_URI}`
      );
      console.log(
        `\n MongoDB connected: DB Host: ${connectionInstance.connection.host}`
      );
    } catch (error) {
      console.log("MONGODB CONNECTION ERROR: ", error);
      process.exit(1);
    }
  };
  module.exports = connectDB