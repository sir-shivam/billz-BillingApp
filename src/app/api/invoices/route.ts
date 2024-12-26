import { connectDB } from "@/dbConfig/dbConfig"; 
import Invoice from "@/models/invoices"
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge", // Use Edge Runtime
};

export default async function Invoicehandler(req: NextRequest): Promise<NextResponse> {
  await connectDB();

  const method = req.method;
  console.log(method);

  switch (method) {
    case "GET":
      try {
        const invoices = await Invoice.find();
        return NextResponse.json(invoices, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: "Error fetching invoices" }, { status: 500 });
      }

    case "POST":
      try {
        const body = await req.json();
        const { clientID, items } = body;

        const total = items.reduce((sum: number, item: { price: number; quantity: number }) => {
          return sum + item.price * item.quantity;
        }, 0);

        const newInvoice = await Invoice.create({ clientID, items, total });
        return NextResponse.json(newInvoice, { status: 201 });
      } catch (error) {
        return NextResponse.json({ error: "Error creating invoice" }, { status: 500 });
      }

    default:
      return NextResponse.json({ error: `Method ${method} Not Allowed` }, { status: 405 });
  }
}
