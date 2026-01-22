// Yahoo Finance API - Free tier (no key required)
// Uses RapidAPI's Yahoo Finance endpoint

const YAHOO_API_BASE = 'https://query1.finance.yahoo.com';

export const getMarketSummary = async () => {
  try {
    // Get trending stocks from Yahoo Finance
    const response = await fetch(
      `${YAHOO_API_BASE}/v10/finance/trending/US`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    const data = await response.json();
    return data.finance?.result?.[0]?.quotes || [];
  } catch (error) {
    console.error('Yahoo Finance API error:', error);
    return [];
  }
};

export const getStockQuote = async (symbol) => {
  try {
    const response = await fetch(
      `${YAHOO_API_BASE}/v10/finance/quoteSummary/${symbol}?modules=price,summaryProfile,financialData`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    const data = await response.json();
    return data.quoteSummary?.result?.[0] || null;
  } catch (error) {
    console.error('Yahoo Finance Quote error:', error);
    return null;
  }
};

export const getSectorPerformance = async () => {
  try {
    // Get sector indices performance
    const sectors = ['^XLK', '^XLV', '^XLI', '^XLY', '^XLP', '^XLE', '^XLU', '^XLF', '^XLRE'];
    const promises = sectors.map(sector =>
      fetch(`${YAHOO_API_BASE}/v10/finance/quoteSummary/${sector}?modules=price`)
        .then(r => r.json())
        .catch(e => ({ error: e }))
    );
    const results = await Promise.all(promises);
    return results
      .filter(r => r.quoteSummary?.result?.[0]?.price)
      .map((r, i) => ({
        symbol: sectors[i],
        name: r.quoteSummary?.result?.[0]?.price?.longName || sectors[i],
        regularMarketPrice: r.quoteSummary?.result?.[0]?.price?.regularMarketPrice || 0,
        regularMarketChangePercent: r.quoteSummary?.result?.[0]?.price?.regularMarketChangePercent || 0
      }));
  } catch (error) {
    console.error('Sector performance error:', error);
    return [];
  }
};

export const getHistoricalData = async (symbol, interval = '1d', range = '1y') => {
  try {
    const response = await fetch(
      `${YAHOO_API_BASE}/v7/finance/download/${symbol}?interval=${interval}&range=${range}&events=split%7Cdiv`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    const data = await response.json();
    return data.chart?.result?.[0]?.quotes || [];
  } catch (error) {
    console.error('Yahoo Finance historical error:', error);
    return [];
  }
};
