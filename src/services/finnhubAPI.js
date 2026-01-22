import axios from 'axios';
import { sampleStocks, mockStockQuotes, mockCompanyProfiles } from './sampleData';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';
const USE_MOCK_DATA = !API_KEY || API_KEY === 'demo'; // Use mock data if no API key or demo mode

// Hot cache loader (from public/data/hot/hotCache.json)
// Use promise-based caching to prevent race conditions
let hotCachePromise = null;

const ensureHotCache = async () => {
  // Return existing promise if already loading
  if (hotCachePromise) return hotCachePromise;
  
  // Create promise and cache it
  hotCachePromise = (async () => {
    try {
      const res = await fetch('/data/hot/hotCache.json');
      if (!res.ok) throw new Error('hot cache not found');
      const data = await res.json();

      if (Array.isArray(data.sampleStocks)) {
        sampleStocks.splice(0, sampleStocks.length, ...data.sampleStocks);
      }
      if (data.mockStockQuotes) {
        Object.assign(mockStockQuotes, data.mockStockQuotes);
      }
      if (data.mockCompanyProfiles) {
        Object.assign(mockCompanyProfiles, data.mockCompanyProfiles);
      }
    } catch (err) {
      console.warn('Hot cache load skipped:', err.message);
    }
  })();

  return hotCachePromise;
};

const finnhubAPI = axios.create({
  baseURL: BASE_URL,
  params: {
    token: API_KEY
  }
});

export const searchStocks = async (query) => {
  try {
    // If mock data mode or API fails, return filtered sample stocks
    if (USE_MOCK_DATA) {
      await ensureHotCache();
      const filtered = sampleStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      );
      return { count: filtered.length, result: filtered };
    }
    
    const response = await finnhubAPI.get('/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching stocks, using mock data:', error);
    // Fallback to mock data
    const filtered = sampleStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    return { count: filtered.length, result: filtered };
  }
};

export const getStockQuote = async (symbol) => {
  try {
    // Use mock data if available for this symbol - return instantly
    if (USE_MOCK_DATA) {
      await ensureHotCache();
      if (mockStockQuotes[symbol]) {
        return Promise.resolve(mockStockQuotes[symbol]);
      }
    }
    
    const response = await finnhubAPI.get('/quote', {
      params: { symbol }
    });
    
    // If API returns empty data, try mock
    if (!response.data || response.data.c === 0) {
      return mockStockQuotes[symbol] || { c: 100, h: 105, l: 98, o: 99, pc: 98, t: Date.now(), v: 1000000 };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching stock quote, using mock data:', error);
    return mockStockQuotes[symbol] || { c: 100, h: 105, l: 98, o: 99, pc: 98, t: Date.now(), v: 1000000 };
  }
};

export const getCompanyProfile = async (symbol) => {
  try {
    // Use mock data if available for this symbol - return instantly
    if (USE_MOCK_DATA) {
      await ensureHotCache();
      if (mockCompanyProfiles[symbol]) {
        return Promise.resolve(mockCompanyProfiles[symbol]);
      }
    }
    
    const response = await finnhubAPI.get('/stock/profile2', {
      params: { symbol }
    });
    
    // If API returns empty data, try mock
    if (!response.data || Object.keys(response.data).length === 0) {
      return mockCompanyProfiles[symbol] || {
        name: symbol,
        ticker: symbol,
        exchange: 'NASDAQ',
        marketCapitalization: 100000,
        shareOutstanding: 1000,
        finnhubIndustry: 'Technology',
        country: 'US',
        currency: 'USD'
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching company profile, using mock data:', error);
    return mockCompanyProfiles[symbol] || {
      name: symbol,
      ticker: symbol,
      exchange: 'NASDAQ',
      marketCapitalization: 100000,
      shareOutstanding: 1000,
      finnhubIndustry: 'Technology',
      country: 'US',
      currency: 'USD'
    };
  }
};

export const getStockCandles = async (symbol, resolution = 'D', from, to) => {
  try {
    const response = await finnhubAPI.get('/stock/candle', {
      params: { 
        symbol,
        resolution,
        from: from || Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60,
        to: to || Math.floor(Date.now() / 1000)
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock candles:', error);
    throw error;
  }
};

export const getMarketNews = async (category = 'general') => {
  try {
    const response = await finnhubAPI.get('/news', {
      params: { category }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market news:', error);
    throw error;
  }
};

export const getBasicFinancials = async (symbol, metric = 'all') => {
  try {
    const response = await finnhubAPI.get('/stock/metric', {
      params: { 
        symbol,
        metric
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching basic financials:', error);
    // Return empty object to allow graceful degradation
    return {};
  }
};

export const getCompanyNews = async (symbol, from, to) => {
  try {
    const toDate = to || new Date().toISOString().split('T')[0];
    const fromDate = from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const response = await finnhubAPI.get('/company-news', {
      params: {
        symbol,
        from: fromDate,
        to: toDate
      }
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching company news:', error);
    return [];
  }
};

export const getPeers = async (symbol) => {
  try {
    const response = await finnhubAPI.get('/stock/peers', {
      params: { symbol }
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching peers:', error);
    return [];
  }
};

export const getRecommendations = async (symbol) => {
  try {
    const response = await finnhubAPI.get('/stock/recommendation', {
      params: { symbol }
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};
