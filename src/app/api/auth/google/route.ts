// /api/auth/google.ts
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { name, email, googleId, contact } = await req.json();

    if (!email || !googleId || !name) {
      return NextResponse.json({ error: "Missing Google login data" }, { status: 400 });
    }

    let user = await User.findOne({ email });

    if (!user) {
      if (!contact) {
        return NextResponse.json({ error: "Phone number required for new users" }, { status: 400 });
      }

      user = await User.create({
        name,
        email,
        googleId,
        contact,
        role: "owner",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        businesses: user.associatedBusinesses,
        hasBusiness: user.associatedBusinesses.length > 0,
      },
      process.env.JWT_SECRET || "your-secret",
      { expiresIn: "30d" }
    );

    const response = NextResponse.json({
      message: "Google login successful",
      hasBusiness: user.associatedBusinesses.length > 0,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (err) {
    console.error("Google login error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
