import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/dbConfig/dbConfig';
import Business from '@/models/businessModel';
import Stock from '@/models/stocks';

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

    const business = await Business.findById(businessId).select('stocks');

    if (!business || !business.stocks || business.stocks.length === 0) {
      return NextResponse.json({
        items: [],
        hasMore: false,
        page,
        totalCount: 0,
      });
    }

    const skip = (page - 1) * limit;
    const totalCount = business.stocks.length;
    const paginatedStockIds = business.stocks.slice(skip, skip + limit + 1); // +1 to check hasMore

    const stocks = await Stock.find({ _id: { $in: paginatedStockIds } })
      .select('name price quantity')
      .sort({ name: 1 })
      .lean();

    const hasMore = paginatedStockIds.length > limit;
    const items = hasMore ? stocks.slice(0, limit) : stocks;

    return NextResponse.json({
      items,
      hasMore,
      page,
      totalCount,
    });

  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
