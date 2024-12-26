import { connectDB } from "@/dbConfig/dbConfig"; 
import Client from "@/models/clientModel"
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge", // Use Edge Runtime
};

export default async function handler(req: NextRequest): Promise<NextResponse> {
  await connectDB();

  const method = req.method;

  switch (method) {
    case "GET":
      try {
        const clients = await Client.find();
        return NextResponse.json(clients, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: "Error fetching clients" }, { status: 500 });
      }

    case "POST":
      try {
        const body = await req.json();
        const { name, balance } = body;

        const newClient = await Client.create({ name, balance, invoiceIDs: [] });
        return NextResponse.json(newClient, { status: 201 });
      } catch (error) {
        return NextResponse.json({ error: "Error creating client" }, { status: 500 });
      }

    default:
      return NextResponse.json({ error: `Method ${method} Not Allowed` }, { status: 405 });
  }
}
