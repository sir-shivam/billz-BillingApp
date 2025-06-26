import jwt from "jsonwebtoken";
import { connectDB } from "@/dbConfig/dbConfig"; // Replace with your MongoDB connection helper
import Business from "@/models/businessModel";
import Client from "@/models/clientModel";
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
export async function POST(req: NextRequest) {

        const retToken = req.cookies.get('token')?.value || '';
        if (!retToken) {
          return NextResponse.json({ error: "Authentication token is missing" }, { status: 401 });
        }
    
        // Decode and verify the token
        let decoded ;
        try {
          decoded = jwt.verify(retToken, process.env.JWT_SECRET || "your-secret-key") as JwtPayloadWithUserId;
          console.log(decoded , "decoding");
          console.log(decoded.businesses[0] , "businesslist");
        } catch (error) {
          return NextResponse.json({ error: error , }, { status: 401 });
        }

        const businessId = decoded.businesses[0];
  
  try {
    const reqBody = await req.json();
    // Extract client data from the request body
    const {  clientName, contact, prevBalance, lastPaidAmount } = reqBody;

    // Validate required fields
    if (!businessId || !clientName || !contact ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Create and save the client
    const newClient = new Client({
      clientName,
      contact,
      prevBalance,
      lastPaidAmount,
      byBusiness: businessId, // Link the client to the business
    });

    await newClient.save();

    // Add the client to the business document's 'clients' array
    await Business.findByIdAndUpdate(
      businessId,
      { $push: { clients: newClient._id } }, // Push the new invoice ID into the invoices array
      { new: true }
     ) // Return the updated document
     

    return NextResponse.json({
      message: "Client created successfully",
      // client: newClient,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating client:", error.message);
      return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    } else {
      console.error("Unknown error occurred");
      return NextResponse.json({ message: "Internal Server Error", error: "Unknown error occurred" }, { status: 500 });
    }
  }
}
