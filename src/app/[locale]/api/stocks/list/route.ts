import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { fvc3ScoreSchema, grahamBreakerSchema, stockSchema } from '@/models/Schema';

/**
 * GET /api/stocks/list
 * 
 * Returns all stocks that passed the Graham Circuit Breaker with their FVC3.0 scores.
 * Optionally filtered by sector or sorted by composite score.
 */
export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url);
    const sector = url.searchParams.get('sector');
    const sortBy = url.searchParams.get('sortBy') || 'compositeScore';
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);

    let query = db
      .select({
        id: stockSchema.id,
        ticker: stockSchema.ticker,
        name: stockSchema.name,
        sector: stockSchema.sector,
        price: stockSchema.price,
        marketCap: stockSchema.marketCap,
        aiSummary: stockSchema.aiSummary,
        compositeScore: fvc3ScoreSchema.compositeScore,
        recommendation: fvc3ScoreSchema.recommendation,
        valuationScore: fvc3ScoreSchema.valuationScore,
        qualityScore: fvc3ScoreSchema.qualityScore,
        momentumScore: fvc3ScoreSchema.momentumScore,
        grahamPassed: grahamBreakerSchema.overallPass,
      })
      .from(stockSchema)
      .leftJoin(fvc3ScoreSchema, sql`${stockSchema.id} = ${fvc3ScoreSchema.stockId}`)
      .leftJoin(grahamBreakerSchema, sql`${stockSchema.id} = ${grahamBreakerSchema.stockId}`)
      .where(sql`${grahamBreakerSchema.overallPass} = 1`); // Only show stocks that passed Graham

    if (sector) {
      query = query.where(sql`${stockSchema.sector} = ${sector}`);
    }

    // Sort by requested field
    if (sortBy === 'compositeScore') {
      query = query.orderBy(sql`${fvc3ScoreSchema.compositeScore} DESC`);
    } else if (sortBy === 'price') {
      query = query.orderBy(sql`${stockSchema.price} ASC`);
    } else if (sortBy === 'ticker') {
      query = query.orderBy(sql`${stockSchema.ticker} ASC`);
    }

    query = query.limit(limit);

    const stocks = await query;

    logger.info(`Retrieved ${stocks.length} stocks from database`);

    return NextResponse.json({
      stocks,
      count: stocks.length,
    });
  } catch (error) {
    logger.error('Error in /api/stocks/list:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve stocks',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
