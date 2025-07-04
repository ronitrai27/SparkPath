
import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MongoDB connection string is missing in environment variables.");
}

let isConnected = false; 

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log(" Already connected to MongoDB.");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "sparkpath", 
    } as ConnectOptions);

    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log(" Connected to MongoDB");
    } else {
      console.log("MongoDB connection failed");
    }

    mongoose.connection.on("error", (err) => {
      console.error(" MongoDB connection error:", err);
    });

  } catch (error) {
    console.error(" Error connecting to MongoDB:", error);
    throw error;
  }
};