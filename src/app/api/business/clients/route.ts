// /app/api/business/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/dbConfig/dbConfig';
import Business from '@/models/businessModel';
import Client from '@/models/clientModel';
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

    const business = await Business.findById(businessId)
      .populate({
        path: 'clients',
        select: 'clientName contact address createdAt', // Newest first
      })
      .lean()as {
    clients: any[]; // ideally you should define a better type for clients
     } | null;

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const allClients = business.clients || [];
    const totalCount = allClients.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedClients = allClients.slice(startIndex, endIndex);

    // Get invoice totals for each client
    const clientsWithTotals = await Promise.all(
      paginatedClients.map(async (client: any) => {
        const totalInvoices = await Invoice.aggregate([
          { $match: { clientId: client._id } },
          { $group: { _id: null, totalAmount: { $sum: '$total' } } }
        ]);

        return {
          ...client,
          totalAmount: totalInvoices[0]?.totalAmount || 0,
        };
      })
    );

    return NextResponse.json({
      items: clientsWithTotals,
      hasMore: endIndex < totalCount,
      page,
      totalCount,
    });

  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
