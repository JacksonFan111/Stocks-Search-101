/**
 * API Endpoint: Fetch Real Stock Data
 * Route: POST /api/stocks/fetch
 * 
 * Calls external APIs (Finnhub, Alpha Vantage)
 * Caches results in PostgreSQL
 * Returns complete stock data for analysis
 * 
 * Request Body:
 * {
 *   "ticker": "AAPL",
 *   "useCache": true  // optional
 * }
 * 
 * Response:
 * {
 *   "ticker": "AAPL",
 *   "name": "Apple Inc",
 *   "price": 232.5,
 *   "metrics": { ... }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { stockSchema } from '@/models/Schema';
import { getCompleteStockData, calculateAnalysisMetrics } from '@/libs/ExternalAPIs';
import { logger } from '@/libs/Logger';
import { eq } from 'drizzle-orm';

// Validation schema
const FetchStockSchema = z.object({
  ticker: z.string().min(1).max(10).toUpperCase(),
  useCache: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const body = await request.json();
    const { ticker, useCache } = FetchStockSchema.parse(body);

    logger.info(`[API] Fetching stock data: ${ticker}`);

    // Step 1: Check cache if enabled
    if (useCache) {
      const cached = await db.query.stockSchema.findFirst({
        where: eq(stockSchema.ticker, ticker),
      });

      if (cached && cached.lastUpdated && Date.now() - cached.lastUpdated.getTime() < 60 * 60 * 1000) {
        logger.info(`[API] Returning cached data for ${ticker}`);
        return NextResponse.json({
          ticker: cached.ticker,
          name: cached.name,
          sector: cached.sector,
          price: cached.price,
          marketCap: cached.marketCap,
          source: 'cache',
          cached: true,
        });
      }
    }

    // Step 2: Fetch from external APIs
    logger.info(`[API] Calling external APIs for ${ticker}`);
    const stockData = await getCompleteStockData(ticker);

    // Step 3: Calculate analysis metrics
    const analysisMetrics = calculateAnalysisMetrics(stockData);

    // Step 4: Store in database (cache for future requests)
    try {
      await db.insert(stockSchema).values({
        ticker: stockData.ticker,
        name: stockData.name,
        sector: stockData.sector,
        price: stockData.price,
        marketCap: stockData.marketCap || 0,
        description: `${stockData.name} - ${stockData.sector}`,
        lastUpdated: new Date(),
      }).onConflictDoUpdate({
        target: [stockSchema.ticker],
        set: {
          price: stockData.price,
          name: stockData.name,
          sector: stockData.sector,
          lastUpdated: new Date(),
        },
      });

      logger.info(`[API] Stored ${ticker} in database`);
    } catch (dbError) {
      logger.warn(`[API] Failed to cache ${ticker}`, dbError);
      // Don't fail - still return the data
    }

    // Step 5: Return complete response
    const response = {
      success: true,
      ticker: stockData.ticker,
      name: stockData.name,
      sector: stockData.sector,
      price: stockData.price,
      priceChange: stockData.priceChange,
      changePercent: stockData.changePercent,
      marketCap: stockData.marketCap,
      country: stockData.country,
      website: stockData.website,
      metrics: stockData.metrics,
      analysisMetrics,
      timestamp: new Date().toISOString(),
      source: 'live-api',
      cached: false,
    };

    logger.info(`[API] Successfully fetched ${ticker}`);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('[API] Validation error', error.errors);
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    logger.error('[API] Failed to fetch stock data', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint - fetch from cache or list all stocks
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (ticker) {
      // Get single stock
      const stock = await db.query.stockSchema.findFirst({
        where: eq(stockSchema.ticker, ticker.toUpperCase()),
      });

      if (!stock) {
        return NextResponse.json(
          { error: 'Stock not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(stock);
    }

    // List all stocks with limit
    const stocks = await db.query.stockSchema.findMany({
      limit,
    });

    return NextResponse.json({ stocks, count: stocks.length });
  } catch (error) {
    logger.error('[API] GET failed', error);
    return NextResponse.json(
      { error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
}
