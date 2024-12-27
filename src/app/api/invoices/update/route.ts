import Invoice from "@/models/invoices";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { id, updates } = await req.json();

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Update the invoice fields
    Object.assign(invoice, updates);

    // Save the updated invoice (this triggers the history middleware)
    await invoice.save();

    return NextResponse.json({
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating invoice:", error.message);
      return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Internal Server Error", error: "Unknown error occurred" }, { status: 500 });
  }
}
