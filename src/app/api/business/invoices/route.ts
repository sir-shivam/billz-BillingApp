import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/dbConfig/dbConfig';
import Business from '@/models/businessModel';
import Invoice from '@/models/invoices';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    const business = await Business.findById(businessId).select('invoices');

    if (!business || !business.invoices || business.invoices.length === 0) {
      return NextResponse.json({
        items: [],
        hasMore: false,
        page,
        totalCount: 0,
      });
    }

    const skip = (page - 1) * limit;
    const totalCount = business.invoices.length;

    // Paginate invoice IDs from business
    const paginatedInvoiceIds = business.invoices.slice(skip, skip + limit + 1); // +1 to check `hasMore`

    const invoices = await Invoice.find({ _id: { $in: paginatedInvoiceIds } })
      .select('billNo clientName total invoiceDate balance paid')
      .sort({ invoiceDate: -1 }) // Newest first
      .lean();

    const hasMore = paginatedInvoiceIds.length > limit;
    const items = hasMore ? invoices.slice(0, limit) : invoices;

    return NextResponse.json({
      items,
      hasMore,
      page,
      totalCount,
    });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
