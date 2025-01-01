import { connectDB } from "@/dbConfig/dbConfig"; // Your MongoDB connection helper
import Invoice from "@/models/invoices"; // Your Mongoose model for invoices
import { NextRequest, NextResponse } from "next/server";

connectDB(); // Ensure the database connection is established

export async function GET(req: NextRequest) {
  try {
    console.log("finding");
    // Extract query parameters from the request
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoiceId"); // Get the 'invoiceId' query parameter

    // Validate the invoice ID
    if (!invoiceId) {
      return NextResponse.json(
        { message: "Invoice ID is required" },
        { status: 400 }
      );
    }

    // Fetch the invoice by ID
    const thisInvoice = await Invoice.findById(invoiceId);

    // Check if the invoice exists
    if (!thisInvoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    // Return the fetched invoice
    return NextResponse.json({
      message: "Fetch complete",
      invoice: thisInvoice,
    });
  } catch (error: unknown) {
    // Handle errors
    if (error instanceof Error) {
      console.error("Error fetching invoice:", error.message);
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error occurred");
      return NextResponse.json(
        { message: "Internal Server Error", error: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
