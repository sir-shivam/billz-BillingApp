import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(req: NextRequest) {
    try {
      const { email, password } = await req.json();
  
      // Validate required fields
      if (!email || !password) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      // Check if the user exists
      const user = await User.findOne({ email }).select("associatedBusinesses password role");
      if (!user) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
      }
  
      // Compare the entered password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
      }
  
      // Get the associated businesses' IDs
      const businesses = user.associatedBusinesses;
  
      // Check if the user has businesses associated
      const hasBusiness = businesses.length > 0;
  
      // Create a JWT token with the user ID, role, and business IDs (if any)
const token = await jwt.sign(
  { 
    userId: user._id, 
    role: user.role, 
    businesses: businesses.length === 1
      ? [businesses[0]]  // If only one business, store just that business ID
      : businesses,  // If multiple businesses, store all business IDs
    hasBusiness,  // Add a flag to indicate whether the user has businesses
  },
  process.env.JWT_SECRET || "your-secret-key",  // Secret key
  { expiresIn: "30d" }  // JWT expires in 1 day (token expiration)
);

// Create response with the token and other data
const response = NextResponse.json({
  message: "Login successful",
  token,
  success: true,
  hasBusiness,
});

// Set the token in the cookie with a 1-year expiration
response.cookies.set("token", token, {
  httpOnly: true, // Make sure the cookie can't be accessed via JavaScript
  secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
  maxAge: 30 * 24 * 60 * 60,
  sameSite: 'strict', // Use the lowercase 'strict' for sameSite
  path: '/', // Ensure the cookie is available on all paths
});

return response;

      
    } catch (error) {
      console.error("Error during login:", error);
      if (error instanceof Error) {
          console.error("Error during login:", error.message);
          return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
      } else {
        console.error("Unknown error occurred");
        return NextResponse.json({ message: "Internal Server Error", error: "Unknown error occurred" }, { status: 500 });
      }
    }
  }
  
