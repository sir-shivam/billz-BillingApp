import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/dbConfig/dbConfig";// Replace with your MongoDB connection helper
import Invoice, { InvoiceDocument } from "@/models/invoices";
import { NextRequest, NextResponse } from "next/server";

connectDB();
type ResponseData = {
  message?: string;
  invoice?: InvoiceDocument;
  error?: string;
};

export async function POST(req: NextRequest) {
  
  try {
   
    const reqBody = await req.json();
    // Extract the invoice data from the request body
    const {
      billNo,
      clientName,
      invoiceDate,
      balance,
      paid,
      items,
      notes,
      total,
    } = reqBody;

    console.log(reqBody , "hello");

    // Validate required fields
    if (!billNo || !clientName || !invoiceDate || !items || !total) {
      return NextResponse.json({ error: "Missing required fields" }, {status: 400});
    }

    // Create and save the invoice
    const newInvoice =  new Invoice({
      billNo,
      clientName,
      invoiceDate,
      balance,
      paid,
      items,
      notes,
      total,
    });

    await newInvoice.save();

    return NextResponse.json({
      message: "Invoice created successfully",
      invoice: newInvoice,
    });
  } catch (error: any) {
    console.error("Error creating invoice:", error.message);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, {status: 500});
  }
};

