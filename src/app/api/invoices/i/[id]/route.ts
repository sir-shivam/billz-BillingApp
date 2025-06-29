// /app/api/invoice/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/dbConfig/dbConfig';
import Invoice from '@/models/invoices';

export async function GET(
  request: NextRequest,
) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const invoiceId = url.pathname.split("/").pop();

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const invoice = await Invoice.findById(invoiceId).lean();

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
