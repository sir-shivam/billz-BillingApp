import { connectDB } from "@/dbConfig/dbConfig";// Replace with your MongoDB connection helper
import Invoice from "@/models/invoices";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Business from "@/models/businessModel";
import Client from "@/models/clientModel";


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
            return NextResponse.json({ error: error }, { status: 401 });
          }
  
          const businessId = decoded.businesses[0]




  
  try {
   
    const reqBody = await req.json();
    // Extract the invoice data from the request body
    const {
      billNo,
      clientName,
      clientId,
      selectedClientId,
      selectedItemId,
      invoiceDate,
      balance,
      paid,
      items,
      notes,
      total,
    } = reqBody;

    console.log(selectedItemId , "hello");
    console.log(billNo, invoiceDate, items, total, selectedClientId , "check")

    // Validate required fields
    if (!billNo || !clientName || !invoiceDate || !items || !total || !selectedClientId ) {
      return NextResponse.json({ error: "Missing required fields" }, {status: 400});
    }

    // Create and save the invoice
    const newInvoice =  new Invoice({
      billNo,
      clientName,
      clientId,
      businessId,
      invoiceDate,
      balance,
      paid,
      items,
      notes,
      total,
    });

    await newInvoice.save();

    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      { $push: { invoices: newInvoice._id } }, // Push the new invoice ID into the invoices array
      { new: true }
     ) // Return the updated document

     await Client.findByIdAndUpdate(
      selectedClientId,
      {
        $set: {
          prevBalance: (total+balance-paid) ,
          lastPaidAmount: paid,
        },
        $push: { invoices: newInvoice._Id }, // Push the new invoice ID into the array
      },
       // Push the new invoice ID into the invoices array
      { new: true }
     )
     console.log(updatedBusiness , "hello1");

    return NextResponse.json({
      message: "Invoice created successfully",
      invoice: newInvoice,
    });
  }  catch (error: unknown) {
    // TypeScript will now require you to assert the type of 'error' before using it.
    if (error instanceof Error) {
      console.error("Error creating invoice:", error.message);
      return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    } else {
      console.error("Unknown error occurred");
      return NextResponse.json({ message: "Internal Server Error", error: "Unknown error occurred" }, { status: 500 });
    }
  };
}