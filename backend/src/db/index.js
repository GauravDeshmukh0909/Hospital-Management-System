import mongoose from "mongoose";

const connectDB = async () => {
  try {

    console.log(process.env.MONGO_URL);
    const connectionInstance = await mongoose.connect(
      process.env.MONGO_URL
    );

    console.log(
      `MongoDB connected ✅ : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    process.exit(1);
  }
};

export default connectDB;
