import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { name, email, password, contact, role } = reqBody;

    // Validate required fields
    if (!name || !email || !password || !contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      name,
      email,
      contact,
      password: hashedPassword, // Hashed password
      role: role || "owner", // Default role is "owner" if not provided
    });

    // Save the user to the database
    await newUser.save();

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        contact: newUser.contact,
        role: newUser.role,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error registering user:", error.message);
      return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    } else {
      console.error("Unknown error occurred");
      return NextResponse.json({ message: "Internal Server Error", error: "Unknown error occurred" }, { status: 500 });
    }
  }
}
