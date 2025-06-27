import mongoose from "mongoose";
import "@/models/userModel";
import "@/models/businessModel";
import "@/models/clientModel";
import "@/models/invoiceHistory";
import "@/models/invoices";
import "@/models/processedMessage";
import "@/models/stocks";
const MONGODB_URI = process.env.MONGO_URI!;
let isConnected = false;

export async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "billz", // optional: if your URI doesn't specify DB
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");
    console.log("📦 Registered models:", mongoose.connection.modelNames());
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
