import jwt from "jsonwebtoken";
import { connectDB } from "@/dbConfig/dbConfig"; // Replace with your MongoDB connection helper
import Business from "@/models/businessModel";
import Client from "@/models/clientModel";
import Stock from "@/models/stocks"


import { NextRequest, NextResponse } from "next/server";

connectDB();

interface JwtPayloadWithUserId {
  userId: string;
  role: string;
  businesses: string[];
  hasBusiness: boolean;
  iat?: number;
  exp?: number;
}
void Stock;
void Client;

export async function GET(req: NextRequest) {
  const retToken = req.cookies.get('token')?.value || '';
  if (!retToken) {
    return NextResponse.json({ error: "Authentication token is missing" }, { status: 401 });
  }

  // Decode and verify the token
  let decoded;
  try {
    decoded = jwt.verify(retToken, process.env.JWT_SECRET || "your-secret-key") as JwtPayloadWithUserId;
    console.log(decoded, "decoding");
    console.log(decoded.businesses[0], "business list");
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  const businessId = decoded.businesses[0];

  try {
    const business = await Business.findById(businessId).populate("clients").populate("stocks");
     // Populating the 'clients' field
  
    if (!business) {
      console.error("Business not found");
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }
  
    return NextResponse.json({
      message: "fetch complete",
      business: business,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching business or populating clients:", error.message);
      return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    } else {
      console.error("Unknown error occurred");
      return NextResponse.json({ message: "Internal Server Error", error: "Unknown error occurred" }, { status: 500 });
    }
  }
  
}
