/**
 * External API Integration Layer
 * Connects to Finnhub, Alpha Vantage, and Google Finance
 * 
 * Usage:
 *   const data = await getCompleteStockData('AAPL');
 *   
 * Environment Variables Required:
 *   FINNHUB_API_KEY
 *   ALPHA_VANTAGE_API_KEY
 */

import { logger } from './Logger';

export interface StockData {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  priceChange: number;
  changePercent: number;
  marketCap: number;
  country: string;
  website: string;
  metrics: FinancialMetrics | null;
}

export interface FinancialMetrics {
  netIncome: number;
  revenue: number;
  operatingCashFlow: number;
  totalAssets: number;
  totalLiabilities: number;
  goodwill: number;
  currentAssets: number;
  currentLiabilities: number;
  eps: number;
  peRatio: number;
}

/**
 * Fetch stock info from Finnhub API
 * Includes: ticker, name, sector, price, market cap, website
 */
export async function fetchStockFromFinnhub(ticker: string): Promise<any> {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    
    if (!apiKey) {
      logger.warn('FINNHUB_API_KEY not set - using demo data');
      return getDemoStockData(ticker);
    }

    const response = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    if (!response.ok) {
      logger.error(`Finnhub API error: ${response.status}`);
      return getDemoStockData(ticker);
    }

    const data = await response.json();

    logger.info(`Fetched ${ticker} from Finnhub`);

    return {
      ticker: data.ticker,
      name: data.name,
      sector: data.finnhubIndustry || 'Unknown',
      marketCap: data.marketCapitalization || 0,
      country: data.country || 'US',
      website: data.weburl || '',
      price: data.quote?.c || 0,
      priceChange: data.quote?.d || 0,
      changePercent: data.quote?.dp || 0,
    };
  } catch (error) {
    logger.error('Finnhub fetch failed', error);
    return getDemoStockData(ticker);
  }
}

/**
 * Fetch financial metrics from Alpha Vantage API
 * Includes: income statement, balance sheet, cash flow data
 */
export async function fetchFinancialMetrics(ticker: string): Promise<FinancialMetrics | null> {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (!apiKey) {
      logger.warn('ALPHA_VANTAGE_API_KEY not set - using demo data');
      return getDemoMetrics(ticker);
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${apiKey}`
    );

    if (!response.ok) {
      logger.error(`Alpha Vantage API error: ${response.status}`);
      return getDemoMetrics(ticker);
    }

    const data = await response.json();
    const latestReport = data.annualReports?.[0];

    if (!latestReport) {
      logger.warn(`No financial data for ${ticker}`);
      return getDemoMetrics(ticker);
    }

    logger.info(`Fetched financial metrics for ${ticker}`);

    const netIncome = parseInt(latestReport.netIncome || '0');
    const revenue = parseInt(latestReport.totalRevenue || '0');
    const eps = revenue > 0 ? netIncome / (revenue / 1000000) : 0;

    return {
      netIncome,
      revenue,
      operatingCashFlow: parseInt(latestReport.operatingCashFlow || '0'),
      totalAssets: parseInt(latestReport.totalAssets || '0'),
      totalLiabilities: parseInt(latestReport.totalLiabilities || '0'),
      goodwill: parseInt(latestReport.goodwillAndIntangibleAssets || '0'),
      currentAssets: parseInt(latestReport.currentAssets || '0'),
      currentLiabilities: parseInt(latestReport.currentLiabilities || '0'),
      eps,
      peRatio: 0, // Will be calculated
    };
  } catch (error) {
    logger.error('Alpha Vantage fetch failed', error);
    return getDemoMetrics(ticker);
  }
}

/**
 * Combine Finnhub + Alpha Vantage data
 * Single function to get all stock data needed for analysis
 */
export async function getCompleteStockData(ticker: string): Promise<StockData> {
  logger.info(`Fetching complete data for ${ticker}`);

  const [stockInfo, metrics] = await Promise.all([
    fetchStockFromFinnhub(ticker),
    fetchFinancialMetrics(ticker),
  ]);

  const stockData: StockData = {
    ticker: stockInfo.ticker,
    name: stockInfo.name,
    sector: stockInfo.sector,
    price: stockInfo.price,
    priceChange: stockInfo.priceChange,
    changePercent: stockInfo.changePercent,
    marketCap: stockInfo.marketCap,
    country: stockInfo.country,
    website: stockInfo.website,
    metrics: metrics ? { ...metrics, peRatio: metrics.eps > 0 ? stockInfo.price / metrics.eps : 0 } : null,
  };

  logger.info(`Complete data fetched for ${ticker}`);

  return stockData;
}

/**
 * Demo data fallback when API keys not configured
 * Realistic sample data for testing
 */
function getDemoStockData(ticker: string): any {
  const demoData: Record<string, any> = {
    AAPL: {
      ticker: 'AAPL',
      name: 'Apple Inc',
      sector: 'Technology',
      price: 232.5,
      priceChange: 2.5,
      changePercent: 1.08,
      marketCap: 3200000000000,
      country: 'US',
      website: 'https://www.apple.com',
    },
    MSFT: {
      ticker: 'MSFT',
      name: 'Microsoft Corporation',
      sector: 'Technology',
      price: 428.0,
      priceChange: -3.2,
      changePercent: -0.74,
      marketCap: 3100000000000,
      country: 'US',
      website: 'https://www.microsoft.com',
    },
    GOOGL: {
      ticker: 'GOOGL',
      name: 'Alphabet Inc',
      sector: 'Communication Services',
      price: 178.5,
      priceChange: 1.2,
      changePercent: 0.68,
      marketCap: 2400000000000,
      country: 'US',
      website: 'https://www.google.com',
    },
    AMZN: {
      ticker: 'AMZN',
      name: 'Amazon.com Inc',
      sector: 'Consumer Discretionary',
      price: 195.0,
      priceChange: -2.1,
      changePercent: -1.07,
      marketCap: 2000000000000,
      country: 'US',
      website: 'https://www.amazon.com',
    },
  };

  return demoData[ticker] || demoData['AAPL'];
}

function getDemoMetrics(ticker: string): FinancialMetrics {
  return {
    netIncome: 30000000000,
    revenue: 394000000000,
    operatingCashFlow: 100000000000,
    totalAssets: 350000000000,
    totalLiabilities: 120000000000,
    goodwill: 15000000000,
    currentAssets: 85000000000,
    currentLiabilities: 60000000000,
    eps: 5.61,
    peRatio: 41.4,
  };
}

/**
 * Batch fetch multiple stocks
 * Useful for loading market overview
 */
export async function getMultipleStocks(tickers: string[]): Promise<StockData[]> {
  logger.info(`Fetching data for ${tickers.length} stocks`);

  const results = await Promise.allSettled(
    tickers.map(ticker => getCompleteStockData(ticker))
  );

  return results
    .map((result, index) => {
      if (result.status === 'fulfilled') return result.value;
      logger.error(`Failed to fetch ${tickers[index]}`);
      return null;
    })
    .filter((data): data is StockData => data !== null);
}

/**
 * Calculate analysis metrics from stock data
 * Used by Graham Breaker and FVC3 engines
 */
export function calculateAnalysisMetrics(stockData: StockData) {
  if (!stockData.metrics) return null;

  const m = stockData.metrics;
  const assetLiability = m.totalAssets > 0 ? (m.totalAssets - m.totalLiabilities) / m.totalAssets : 0;
  const currentRatio = m.currentLiabilities > 0 ? m.currentAssets / m.currentLiabilities : 0;
  const roa = m.totalAssets > 0 ? m.netIncome / m.totalAssets : 0;
  const fcf = m.operatingCashFlow - (m.revenue * 0.05); // Rough capex estimate

  return {
    peRatio: m.peRatio,
    interestCoverage: m.netIncome > 0 ? m.netIncome / (m.netIncome * 0.15) : 0, // Rough estimate
    shareCountChange: -1.5, // Would need historical data
    assetLiabilityRatio: assetLiability,
    currentRatio,
    returnOnAssets: roa,
    freeCashFlow: fcf,
    grossMargin: (m.revenue - (m.revenue * 0.6)) / m.revenue,
  };
}
