import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/dbConfig/dbConfig";
import Business from "@/models/businessModel";

interface DecodedToken {
  userId: string;
  role: string;
  businesses: any[];
  hasBusiness: boolean;
}

export async function GET() {
  await connectDB();
  const cookieStore = await cookies(); // ✅ Fixed here
  const token = cookieStore.get("token")?.value;
//   const token = cookies().get("token")?.value;
  if (!token) {
    return NextResponse.json({ user: null, business: null }, { status: 200 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as DecodedToken;
    console.log(decoded , " this is from token");

    if (!decoded.hasBusiness || decoded.businesses.length === 0) {
      return NextResponse.json({
        user: decoded,
        business: null,
      });
    }

    const business = await Business.findById(decoded.businesses[0]).select("name address contact clients invoices stocks");

    return NextResponse.json({
      user: decoded,
      business,
    });
  } catch (err) {
    return NextResponse.json({ user: null, business: null }, { status: 401 });
  }
}
