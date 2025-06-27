// /api/auth/signup/route.ts

import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Business from "@/models/businessModel";
import Client from "@/models/clientModel";
import { InvoiceHistory } from "@/models/invoiceHistory";
import Invoice from "@/models/invoices";

import ProcessedMessage from "@/models/processedMessage";
import Stock from "@/models/stocks";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, contact, role } = await req.json();

    if (!name || !email || !password || !contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      contact,
      password: hashedPassword,
      role: role || "owner",
    });

    await newUser.save();

    const token = await jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
        businesses: [],
        hasBusiness: false,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    const response = NextResponse.json({
      message: "User registered successfully",
      token,
      success: true,
      hasBusiness: false,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
