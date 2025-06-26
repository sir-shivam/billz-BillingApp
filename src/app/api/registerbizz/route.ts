import jwt from "jsonwebtoken";
import { connectDB } from "@/dbConfig/dbConfig";
import Business from "@/models/businessModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import Client from "@/models/clientModel";
import Stock from "@/models/stocks";

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
  try {
    // Extract token from cookies
    const retToken = req.cookies.get('token')?.value || '';
    

    if (!retToken) {
      return NextResponse.json({ error: "Authentication token is missing" }, { status: 401 });
    }

    // Decode and verify the token
    let decoded ;
    try {
      decoded = jwt.verify(retToken, process.env.JWT_SECRET || "your-secret-key") as JwtPayloadWithUserId;
      console.log(decoded , "decoding");
      console.log(decoded.userId , "decoding");
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 401 });
    }

    // Extract userId from decoded token
    const userId = decoded.userId;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found in token" }, { status: 400 });
    }

    // Parse request body
    const reqBody = await req.json();
    const { name, address } = reqBody;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }


    // Check if the owner exists
    const owner = await User.findById(userId);
    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    // create sample stock and client

    const newClient = new Client({
      clientName : "Sample Client",
      contact:123456789,
      email:"abc@abc.com",
      prevBalance:100,
      lastPaidAmount:0,
    });

    await newClient.save();

    const newStock = new Stock({
      name: "Sample Item",
      quantity: 100,
      price: 100,
    });
    let sampleclient = await Client.findOne({clientName : "Sample Client"})
    let  sampleStock = await Stock.findOne({name: "Sample Item" })

    if(!sampleclient){
      sampleclient = new Client({
        clientName : "Sample Client",
        contact:123456789,
        email:"abc@abc.com",
        prevBalance:100,
        lastPaidAmount:0,
      });
  
      await sampleclient.save();
    }

    if(!sampleStock){
      sampleStock = new Stock({
        name: "Sample Item",
        quantity: 100,
        price: 100,
      });
    await sampleStock.save();
    }

    console.log(newStock , "stocks item");


    // Create and save the business
    const newBusiness = new Business({
      name,
      ownerId: userId,
      contact: owner.contact,
      address,
      clients: [sampleclient._id],
      stocks: [sampleStock._id],
    });

    await newBusiness.save();

    // Add the business ID to the owner's associated businesses
    owner.associatedBusinesses.push(newBusiness._id);
    await owner.save();
    // Regenerate the token with updated business list
    const updatedBusinesses = owner.associatedBusinesses;
    const hasBusiness = updatedBusinesses.length > 0;

    const token = jwt.sign(
      {
        userId: owner._id,
        role: owner.role,
        businesses: updatedBusinesses,
        hasBusiness,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    



    const response =  NextResponse.json({
      message: "Business registered successfully",
      owner,
      business: newBusiness,
    });


    response.cookies.set("token", token, {
      httpOnly: true,
    })

    return response;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error registering business:", error.message);
      return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    } else {
      console.error("Unknown error occurred");
      return NextResponse.json({ message: "Internal Server Error", error: "Unknown error occurred" }, { status: 500 });
    }
  }
}
