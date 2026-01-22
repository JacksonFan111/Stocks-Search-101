/*
 * PolyScan - API Configuration Guide
 * 
 * Free & Paid APIs integrated into the platform
 */

export const apiConfiguration = {
  finnhub: {
    name: 'Finnhub API',
    type: 'Primary Stock Data',
    documentation: 'https://finnhub.io/docs/api',
    pricing: 'Free tier: 60 calls/min, Pro: $99/month',
    features: [
      'Real-time stock quotes',
      'Company news',
      'Peer companies',
      'Company profile',
      'Earnings data',
      'Insider transactions'
    ],
    endpoints: 6,
    implemented: true,
    apiKey: import.meta.env.VITE_FINNHUB_API_KEY || 'd5na9lhr01ql6sfqd5e0d5na9lhr01ql6sfqd5eg'
  },

  yahooFinance: {
    name: 'Yahoo Finance API',
    type: 'Market Data & Quotes',
    documentation: 'https://query1.finance.yahoo.com',
    pricing: 'Free - No API key required',
    features: [
      'Market summary',
      'Stock quotes',
      'Trending stocks',
      'Historical data',
      'Sector performance',
      'Market indices'
    ],
    endpoints: 5,
    implemented: true,
    apiKey: 'None - Public endpoint'
  },

  alphaVantage: {
    name: 'Alpha Vantage',
    type: 'Technical Analysis & Time Series',
    documentation: 'https://www.alphavantage.co/documentation/',
    pricing: 'Free tier: 5 calls/min, Premium: $20-200/month',
    features: [
      'Intraday time series',
      'Daily time series',
      'Weekly/Monthly series',
      'RSI indicator',
      'MACD indicator',
      'Moving averages',
      'Company overview'
    ],
    endpoints: 7,
    implemented: true,
    apiKey: 'HOR6ZHVJ8U0GGVE4'
  },
  iexCloud: {
    name: 'IEX Cloud (Recommended Next)',
    type: 'Comprehensive Market Data',
    documentation: 'https://iexcloud.io/docs/api',
    pricing: 'Free tier: $0 (50k msgs/month), Pro: $9-99/month',
    features: [
      'Real-time and delayed quotes',
      'Historical data',
      'Company information',
      'News and events',
      'Sector performance',
      'Technical analysis',
      'Earnings data',
      'IPO calendar'
    ],
    endpoints: 50,
    implemented: false,
    notes: 'Easy to implement, great documentation'
  },

  twelveData: {
    name: 'Twelve Data (Alternative)',
    type: 'Time Series & Market Data',
    documentation: 'https://twelvedata.com/docs',
    pricing: 'Free tier: $0 (limited), Pro: $9-99/month',
    features: [
      'Real-time quotes',
      'Time series data',
      'Technical indicators',
      'Market data',
      'Cryptocurrency',
      'Forex',
      'ETFs'
    ],
    endpoints: 40,
    implemented: false,
    notes: 'Good for real-time data'
  },

  polygon: {
    name: 'Polygon.io (Powerful)',
    type: 'Comprehensive Market Data',
    documentation: 'https://polygon.io/docs',
    pricing: 'Free tier: $0, Pro: $29/month',
    features: [
      'Real-time stock quotes',
      'Historical data',
      'Aggregated data',
      'News feeds',
      'Options data',
      'Forex',
      'Crypto',
      'Technical indicators'
    ],
    endpoints: 50,
    implemented: false,
    notes: 'Enterprise-grade data provider'
  },

  tdameritrade: {
    name: 'TD Ameritrade API',
    type: 'Broker Integration',
    documentation: 'https://developer.tdameritrade.com',
    pricing: 'Free for TD Ameritrade customers',
    features: [
      'Account access',
      'Orders',
      'Quotes',
      'Charts',
      'Historical data',
      'Options data',
      'Account balances'
    ],
    endpoints: 30,
    implemented: false,
    notes: 'For broker integration'
  }
};

// Helper function to get all implemented APIs
export const getImplementedAPIs = () => {
  return Object.entries(apiConfiguration)
    .filter(([_, config]) => config.implemented)
    .map(([key, config]) => ({ key, ...config }));
};

// Helper function to get recommended next APIs to implement
export const getRecommendedAPIs = () => {
  return Object.entries(apiConfiguration)
    .filter(([_, config]) => !config.implemented)
    .sort((a, b) => {
      const priority = { iexCloud: 1, polygon: 2, twelveData: 3, tdameritrade: 4 };
      return (priority[a[0]] || 999) - (priority[b[0]] || 999);
    });
};

export default apiConfiguration;
