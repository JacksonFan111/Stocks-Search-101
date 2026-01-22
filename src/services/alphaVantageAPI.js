// Alpha Vantage API - Free tier
// Free key: demo (limited calls), or sign up for free key at https://www.alphavantage.co/api/

const ALPHA_API_BASE = 'https://www.alphavantage.co/query';
const API_KEY = 'HOR6ZHVJ8U0GGVE4'; // Your free API key from alphavantage.co

export const getTechnicalIndicators = async (symbol) => {
  try {
    // Get RSI (Relative Strength Index)
    const rsiResponse = await fetch(
      `${ALPHA_API_BASE}?function=RSI&symbol=${symbol}&interval=daily&time_period=14&apikey=${API_KEY}`
    );
    const rsiData = await rsiResponse.json();

    // Get MACD (Moving Average Convergence Divergence)
    const macdResponse = await fetch(
      `${ALPHA_API_BASE}?function=MACD&symbol=${symbol}&interval=daily&apikey=${API_KEY}`
    );
    const macdData = await macdResponse.json();

    return {
      rsi: rsiData.TechnicalAnalysis?.RSI?.[0] || {},
      macd: macdData.TechnicalAnalysis?.MACD?.[0] || {},
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Alpha Vantage technical indicators error:', error);
    return { rsi: {}, macd: {}, timestamp: new Date().toISOString() };
  }
};

export const getIntraday = async (symbol, interval = '60min') => {
  try {
    const response = await fetch(
      `${ALPHA_API_BASE}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${API_KEY}`
    );
    const data = await response.json();
    const timeSeries = data[`Time Series (${interval})`] || {};
    
    return Object.entries(timeSeries)
      .slice(0, 20)
      .map(([time, quote]) => ({
        time,
        open: parseFloat(quote['1. open']),
        high: parseFloat(quote['2. high']),
        low: parseFloat(quote['3. low']),
        close: parseFloat(quote['4. close']),
        volume: parseInt(quote['5. volume'])
      }));
  } catch (error) {
    console.error('Alpha Vantage intraday error:', error);
    return [];
  }
};

export const getDailyData = async (symbol, outputSize = 'compact') => {
  try {
    const response = await fetch(
      `${ALPHA_API_BASE}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputSize}&apikey=${API_KEY}`
    );
    const data = await response.json();
    const timeSeries = data['Time Series (Daily)'] || {};

    return Object.entries(timeSeries)
      .slice(0, 30)
      .map(([date, quote]) => ({
        date,
        open: parseFloat(quote['1. open']),
        high: parseFloat(quote['2. high']),
        low: parseFloat(quote['3. low']),
        close: parseFloat(quote['4. close']),
        volume: parseInt(quote['5. volume'])
      }));
  } catch (error) {
    console.error('Alpha Vantage daily error:', error);
    return [];
  }
};

export const getCompanyOverview = async (symbol) => {
  try {
    const response = await fetch(
      `${ALPHA_API_BASE}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    return {
      symbol: data.Symbol,
      name: data.Name,
      exchange: data.Exchange,
      sector: data.Sector,
      industry: data.Industry,
      marketCap: data.MarketCapitalization,
      peRatio: data.PERatio,
      trailingPE: data.TrailingPE,
      forwardPE: data.ForwardPE,
      priceToBookRatio: data.PriceToBookRatio,
      description: data.Description
    };
  } catch (error) {
    console.error('Alpha Vantage overview error:', error);
    return null;
  }
};

export const searchSymbol = async (keywords) => {
  try {
    const response = await fetch(
      `${ALPHA_API_BASE}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`
    );
    const data = await response.json();
    return data.bestMatches || [];
  } catch (error) {
    console.error('Alpha Vantage symbol search error:', error);
    return [];
  }
};
