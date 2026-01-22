// Sample data for demo purposes - Top 20 S&P 500 by Market Cap + Bottom 20
export const sampleStocks = [
  // TOP 20 S&P 500 STOCKS
  { symbol: 'AAPL', name: 'Apple Inc.', description: 'Apple Inc.', displaySymbol: 'NASDAQ:AAPL', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', description: 'Microsoft Corporation', displaySymbol: 'NASDAQ:MSFT', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', description: 'Alphabet Inc.', displaySymbol: 'NASDAQ:GOOGL', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', description: 'Amazon.com Inc.', displaySymbol: 'NASDAQ:AMZN', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', description: 'NVIDIA Corporation', displaySymbol: 'NASDAQ:NVDA', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms Inc.', description: 'Meta Platforms Inc.', displaySymbol: 'NASDAQ:META', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', description: 'Tesla Inc.', displaySymbol: 'NASDAQ:TSLA', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', description: 'Berkshire Hathaway Inc.', displaySymbol: 'NYSE:BRK.B', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'LLY', name: 'Eli Lilly and Company', description: 'Eli Lilly and Company', displaySymbol: 'NYSE:LLY', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'V', name: 'Visa Inc.', description: 'Visa Inc.', displaySymbol: 'NYSE:V', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.', description: 'UnitedHealth Group Inc.', displaySymbol: 'NYSE:UNH', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', description: 'Exxon Mobil Corporation', displaySymbol: 'NYSE:XOM', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', description: 'JPMorgan Chase & Co.', displaySymbol: 'NYSE:JPM', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', description: 'Johnson & Johnson', displaySymbol: 'NYSE:JNJ', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'WMT', name: 'Walmart Inc.', description: 'Walmart Inc.', displaySymbol: 'NYSE:WMT', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', description: 'Procter & Gamble Co.', displaySymbol: 'NYSE:PG', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'MA', name: 'Mastercard Inc.', description: 'Mastercard Inc.', displaySymbol: 'NYSE:MA', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'HD', name: 'The Home Depot Inc.', description: 'The Home Depot Inc.', displaySymbol: 'NYSE:HD', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'CVX', name: 'Chevron Corporation', description: 'Chevron Corporation', displaySymbol: 'NYSE:CVX', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', description: 'Broadcom Inc.', displaySymbol: 'NASDAQ:AVGO', type: 'Common Stock', exchange: 'NASDAQ' },
  
  // BOTTOM 20 S&P 500 STOCKS (Smallest Market Cap)
  { symbol: 'NWL', name: 'Newell Brands Inc.', description: 'Newell Brands Inc.', displaySymbol: 'NASDAQ:NWL', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'FMC', name: 'FMC Corporation', description: 'FMC Corporation', displaySymbol: 'NYSE:FMC', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'ALK', name: 'Alaska Air Group Inc.', description: 'Alaska Air Group Inc.', displaySymbol: 'NYSE:ALK', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'HII', name: 'Huntington Ingalls Industries', description: 'Huntington Ingalls Industries', displaySymbol: 'NYSE:HII', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'NWSA', name: 'News Corporation', description: 'News Corporation', displaySymbol: 'NASDAQ:NWSA', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'PARA', name: 'Paramount Global', description: 'Paramount Global', displaySymbol: 'NASDAQ:PARA', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'MOS', name: 'The Mosaic Company', description: 'The Mosaic Company', displaySymbol: 'NYSE:MOS', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'AIZ', name: 'Assurant Inc.', description: 'Assurant Inc.', displaySymbol: 'NYSE:AIZ', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'TPR', name: 'Tapestry Inc.', description: 'Tapestry Inc.', displaySymbol: 'NYSE:TPR', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'ZION', name: 'Zions Bancorporation', description: 'Zions Bancorporation', displaySymbol: 'NASDAQ:ZION', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'REG', name: 'Regency Centers Corporation', description: 'Regency Centers Corporation', displaySymbol: 'NASDAQ:REG', type: 'Common Stock', exchange: 'NASDAQ' },
  { symbol: 'BEN', name: 'Franklin Resources Inc.', description: 'Franklin Resources Inc.', displaySymbol: 'NYSE:BEN', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'IVZ', name: 'Invesco Ltd.', description: 'Invesco Ltd.', displaySymbol: 'NYSE:IVZ', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'GL', name: 'Globe Life Inc.', description: 'Globe Life Inc.', displaySymbol: 'NYSE:GL', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'VFC', name: 'V.F. Corporation', description: 'V.F. Corporation', displaySymbol: 'NYSE:VFC', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'BWA', name: 'BorgWarner Inc.', description: 'BorgWarner Inc.', displaySymbol: 'NYSE:BWA', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'NCLH', name: 'Norwegian Cruise Line Holdings', description: 'Norwegian Cruise Line Holdings', displaySymbol: 'NYSE:NCLH', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'CRL', name: 'Charles River Laboratories', description: 'Charles River Laboratories', displaySymbol: 'NYSE:CRL', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'GNRC', name: 'Generac Holdings Inc.', description: 'Generac Holdings Inc.', displaySymbol: 'NYSE:GNRC', type: 'Common Stock', exchange: 'NYSE' },
  { symbol: 'WBD', name: 'Warner Bros. Discovery Inc.', description: 'Warner Bros. Discovery Inc.', displaySymbol: 'NASDAQ:WBD', type: 'Common Stock', exchange: 'NASDAQ' }
];

// Mock stock quotes - Top 20 + Bottom 20 S&P 500
export const mockStockQuotes = {
  // TOP 20 S&P 500
  AAPL: { c: 230.45, h: 235.20, l: 228.30, o: 229.50, pc: 225.60, t: Date.now(), v: 52847392 },
  MSFT: { c: 425.80, h: 428.90, l: 423.10, o: 424.50, pc: 418.30, t: Date.now(), v: 28493021 },
  GOOGL: { c: 155.30, h: 157.80, l: 154.20, o: 156.10, pc: 150.40, t: Date.now(), v: 31294857 },
  AMZN: { c: 190.25, h: 192.80, l: 188.50, o: 189.70, pc: 185.60, t: Date.now(), v: 45829103 },
  NVDA: { c: 875.20, h: 882.50, l: 870.10, o: 872.40, pc: 838.50, t: Date.now(), v: 62394812 },
  META: { c: 520.75, h: 525.40, l: 518.20, o: 520.00, pc: 512.30, t: Date.now(), v: 35821940 },
  TSLA: { c: 280.50, h: 285.90, l: 278.40, o: 284.20, pc: 284.90, t: Date.now(), v: 98234521 },
  'BRK.B': { c: 452.80, h: 455.30, l: 450.20, o: 451.50, pc: 448.90, t: Date.now(), v: 3294812 },
  LLY: { c: 785.40, h: 792.80, l: 783.10, o: 786.50, pc: 772.30, t: Date.now(), v: 2849302 },
  V: { c: 295.60, h: 297.90, l: 294.20, o: 295.80, pc: 292.40, t: Date.now(), v: 7294812 },
  UNH: { c: 548.30, h: 552.70, l: 546.10, o: 547.90, pc: 541.20, t: Date.now(), v: 3184902 },
  XOM: { c: 112.45, h: 114.20, l: 111.80, o: 112.10, pc: 110.60, t: Date.now(), v: 18492834 },
  JPM: { c: 198.60, h: 200.30, l: 197.50, o: 198.10, pc: 195.40, t: Date.now(), v: 12394712 },
  JNJ: { c: 158.70, h: 160.20, l: 157.90, o: 158.30, pc: 156.80, t: Date.now(), v: 9284930 },
  WMT: { c: 178.90, h: 180.40, l: 177.80, o: 178.50, pc: 176.20, t: Date.now(), v: 8492831 },
  PG: { c: 168.40, h: 169.80, l: 167.50, o: 168.00, pc: 165.90, t: Date.now(), v: 7392840 },
  MA: { c: 485.20, h: 488.60, l: 483.70, o: 484.90, pc: 478.30, t: Date.now(), v: 3294821 },
  HD: { c: 398.50, h: 401.90, l: 396.80, o: 397.30, pc: 392.10, t: Date.now(), v: 4182930 },
  CVX: { c: 156.80, h: 158.40, l: 155.90, o: 156.50, pc: 154.20, t: Date.now(), v: 9384921 },
  AVGO: { c: 1345.60, h: 1358.20, l: 1342.10, o: 1346.80, pc: 1328.40, t: Date.now(), v: 2184930 },
  
  // BOTTOM 20 S&P 500
  NWL: { c: 8.45, h: 8.82, l: 8.31, o: 8.52, pc: 8.58, t: Date.now(), v: 2849302 },
  FMC: { c: 58.30, h: 59.40, l: 57.80, o: 58.10, pc: 59.20, t: Date.now(), v: 1284930 },
  ALK: { c: 42.70, h: 43.50, l: 42.30, o: 42.80, pc: 41.90, t: Date.now(), v: 1849302 },
  HII: { c: 245.80, h: 248.30, l: 244.50, o: 245.20, pc: 243.60, t: Date.now(), v: 384920 },
  NWSA: { c: 26.45, h: 26.90, l: 26.20, o: 26.50, pc: 26.10, t: Date.now(), v: 2184930 },
  PARA: { c: 11.85, h: 12.20, l: 11.70, o: 11.90, pc: 12.40, t: Date.now(), v: 8492830 },
  MOS: { c: 28.60, h: 29.30, l: 28.40, o: 28.90, pc: 29.80, t: Date.now(), v: 3849201 },
  AIZ: { c: 182.40, h: 184.70, l: 181.50, o: 182.80, pc: 180.20, t: Date.now(), v: 294820 },
  TPR: { c: 48.90, h: 49.80, l: 48.50, o: 48.70, pc: 47.30, t: Date.now(), v: 2184930 },
  ZION: { c: 52.30, h: 53.10, l: 51.90, o: 52.20, pc: 51.40, t: Date.now(), v: 1849302 },
  REG: { c: 68.70, h: 69.50, l: 68.30, o: 68.50, pc: 67.80, t: Date.now(), v: 849302 },
  BEN: { c: 22.80, h: 23.20, l: 22.60, o: 22.90, pc: 23.40, t: Date.now(), v: 2184930 },
  IVZ: { c: 16.45, h: 16.80, l: 16.30, o: 16.50, pc: 16.90, t: Date.now(), v: 3849201 },
  GL: { c: 92.30, h: 93.80, l: 91.90, o: 92.50, pc: 90.70, t: Date.now(), v: 584920 },
  VFC: { c: 15.60, h: 15.95, l: 15.40, o: 15.70, pc: 16.20, t: Date.now(), v: 4849201 },
  BWA: { c: 32.80, h: 33.40, l: 32.50, o: 32.90, pc: 33.60, t: Date.now(), v: 1849302 },
  NCLH: { c: 21.45, h: 22.10, l: 21.20, o: 21.60, pc: 20.80, t: Date.now(), v: 12849302 },
  CRL: { c: 218.60, h: 221.90, l: 217.40, o: 218.80, pc: 215.30, t: Date.now(), v: 384920 },
  GNRC: { c: 145.70, h: 148.30, l: 144.90, o: 145.50, pc: 142.80, t: Date.now(), v: 849302 },
  WBD: { c: 9.85, h: 10.20, l: 9.70, o: 9.90, pc: 10.40, t: Date.now(), v: 18492834 }
};

// Mock company profiles - Top 20 + Bottom 20 S&P 500
export const mockCompanyProfiles = {
  // TOP 20 S&P 500
  AAPL: { name: 'Apple Inc.', ticker: 'AAPL', exchange: 'NASDAQ', marketCapitalization: 3450000, shareOutstanding: 15204.1, finnhubIndustry: 'Technology', country: 'US', currency: 'USD' },
  MSFT: { name: 'Microsoft Corporation', ticker: 'MSFT', exchange: 'NASDAQ', marketCapitalization: 2890000, shareOutstanding: 7430.8, finnhubIndustry: 'Technology', country: 'US', currency: 'USD' },
  GOOGL: { name: 'Alphabet Inc.', ticker: 'GOOGL', exchange: 'NASDAQ', marketCapitalization: 1680000, shareOutstanding: 12456.3, finnhubIndustry: 'Technology', country: 'US', currency: 'USD' },
  AMZN: { name: 'Amazon.com Inc.', ticker: 'AMZN', exchange: 'NASDAQ', marketCapitalization: 1950000, shareOutstanding: 10324.5, finnhubIndustry: 'Retail', country: 'US', currency: 'USD' },
  NVDA: { name: 'NVIDIA Corporation', ticker: 'NVDA', exchange: 'NASDAQ', marketCapitalization: 2140000, shareOutstanding: 2458.7, finnhubIndustry: 'Semiconductors', country: 'US', currency: 'USD' },
  META: { name: 'Meta Platforms Inc.', ticker: 'META', exchange: 'NASDAQ', marketCapitalization: 1320000, shareOutstanding: 2567.4, finnhubIndustry: 'Technology', country: 'US', currency: 'USD' },
  TSLA: { name: 'Tesla Inc.', ticker: 'TSLA', exchange: 'NASDAQ', marketCapitalization: 880000, shareOutstanding: 3178.9, finnhubIndustry: 'Automobiles', country: 'US', currency: 'USD' },
  'BRK.B': { name: 'Berkshire Hathaway Inc.', ticker: 'BRK.B', exchange: 'NYSE', marketCapitalization: 985000, shareOutstanding: 2178.4, finnhubIndustry: 'Financial Services', country: 'US', currency: 'USD' },
  LLY: { name: 'Eli Lilly and Company', ticker: 'LLY', exchange: 'NYSE', marketCapitalization: 748000, shareOutstanding: 952.8, finnhubIndustry: 'Pharmaceuticals', country: 'US', currency: 'USD' },
  V: { name: 'Visa Inc.', ticker: 'V', exchange: 'NYSE', marketCapitalization: 624000, shareOutstanding: 2110.5, finnhubIndustry: 'Financial Services', country: 'US', currency: 'USD' },
  UNH: { name: 'UnitedHealth Group Inc.', ticker: 'UNH', exchange: 'NYSE', marketCapitalization: 518000, shareOutstanding: 944.8, finnhubIndustry: 'Healthcare', country: 'US', currency: 'USD' },
  XOM: { name: 'Exxon Mobil Corporation', ticker: 'XOM', exchange: 'NYSE', marketCapitalization: 482000, shareOutstanding: 4285.6, finnhubIndustry: 'Energy', country: 'US', currency: 'USD' },
  JPM: { name: 'JPMorgan Chase & Co.', ticker: 'JPM', exchange: 'NYSE', marketCapitalization: 572000, shareOutstanding: 2893.4, finnhubIndustry: 'Banking', country: 'US', currency: 'USD' },
  JNJ: { name: 'Johnson & Johnson', ticker: 'JNJ', exchange: 'NYSE', marketCapitalization: 394000, shareOutstanding: 2483.5, finnhubIndustry: 'Pharmaceuticals', country: 'US', currency: 'USD' },
  WMT: { name: 'Walmart Inc.', ticker: 'WMT', exchange: 'NYSE', marketCapitalization: 487000, shareOutstanding: 2720.4, finnhubIndustry: 'Retail', country: 'US', currency: 'USD' },
  PG: { name: 'Procter & Gamble Co.', ticker: 'PG', exchange: 'NYSE', marketCapitalization: 405000, shareOutstanding: 2405.8, finnhubIndustry: 'Consumer Goods', country: 'US', currency: 'USD' },
  MA: { name: 'Mastercard Inc.', ticker: 'MA', exchange: 'NYSE', marketCapitalization: 468000, shareOutstanding: 964.2, finnhubIndustry: 'Financial Services', country: 'US', currency: 'USD' },
  HD: { name: 'The Home Depot Inc.', ticker: 'HD', exchange: 'NYSE', marketCapitalization: 412000, shareOutstanding: 1034.6, finnhubIndustry: 'Retail', country: 'US', currency: 'USD' },
  CVX: { name: 'Chevron Corporation', ticker: 'CVX', exchange: 'NYSE', marketCapitalization: 298000, shareOutstanding: 1900.8, finnhubIndustry: 'Energy', country: 'US', currency: 'USD' },
  AVGO: { name: 'Broadcom Inc.', ticker: 'AVGO', exchange: 'NASDAQ', marketCapitalization: 586000, shareOutstanding: 435.6, finnhubIndustry: 'Semiconductors', country: 'US', currency: 'USD' },
  
  // BOTTOM 20 S&P 500
  NWL: { name: 'Newell Brands Inc.', ticker: 'NWL', exchange: 'NASDAQ', marketCapitalization: 3420, shareOutstanding: 404.7, finnhubIndustry: 'Consumer Goods', country: 'US', currency: 'USD' },
  FMC: { name: 'FMC Corporation', ticker: 'FMC', exchange: 'NYSE', marketCapitalization: 7380, shareOutstanding: 126.5, finnhubIndustry: 'Chemicals', country: 'US', currency: 'USD' },
  ALK: { name: 'Alaska Air Group Inc.', ticker: 'ALK', exchange: 'NYSE', marketCapitalization: 5340, shareOutstanding: 125.2, finnhubIndustry: 'Airlines', country: 'US', currency: 'USD' },
  HII: { name: 'Huntington Ingalls Industries', ticker: 'HII', exchange: 'NYSE', marketCapitalization: 9820, shareOutstanding: 39.9, finnhubIndustry: 'Aerospace & Defense', country: 'US', currency: 'USD' },
  NWSA: { name: 'News Corporation', ticker: 'NWSA', exchange: 'NASDAQ', marketCapitalization: 15280, shareOutstanding: 577.8, finnhubIndustry: 'Media', country: 'US', currency: 'USD' },
  PARA: { name: 'Paramount Global', ticker: 'PARA', exchange: 'NASDAQ', marketCapitalization: 7680, shareOutstanding: 648.2, finnhubIndustry: 'Media', country: 'US', currency: 'USD' },
  MOS: { name: 'The Mosaic Company', ticker: 'MOS', exchange: 'NYSE', marketCapitalization: 10240, shareOutstanding: 357.9, finnhubIndustry: 'Chemicals', country: 'US', currency: 'USD' },
  AIZ: { name: 'Assurant Inc.', ticker: 'AIZ', exchange: 'NYSE', marketCapitalization: 10680, shareOutstanding: 58.5, finnhubIndustry: 'Insurance', country: 'US', currency: 'USD' },
  TPR: { name: 'Tapestry Inc.', ticker: 'TPR', exchange: 'NYSE', marketCapitalization: 12640, shareOutstanding: 258.5, finnhubIndustry: 'Apparel', country: 'US', currency: 'USD' },
  ZION: { name: 'Zions Bancorporation', ticker: 'ZION', exchange: 'NASDAQ', marketCapitalization: 7850, shareOutstanding: 150.1, finnhubIndustry: 'Banking', country: 'US', currency: 'USD' },
  REG: { name: 'Regency Centers Corporation', ticker: 'REG', exchange: 'NASDAQ', marketCapitalization: 12180, shareOutstanding: 177.3, finnhubIndustry: 'Real Estate', country: 'US', currency: 'USD' },
  BEN: { name: 'Franklin Resources Inc.', ticker: 'BEN', exchange: 'NYSE', marketCapitalization: 11540, shareOutstanding: 506.1, finnhubIndustry: 'Financial Services', country: 'US', currency: 'USD' },
  IVZ: { name: 'Invesco Ltd.', ticker: 'IVZ', exchange: 'NYSE', marketCapitalization: 7280, shareOutstanding: 442.8, finnhubIndustry: 'Financial Services', country: 'US', currency: 'USD' },
  GL: { name: 'Globe Life Inc.', ticker: 'GL', exchange: 'NYSE', marketCapitalization: 8740, shareOutstanding: 94.7, finnhubIndustry: 'Insurance', country: 'US', currency: 'USD' },
  VFC: { name: 'V.F. Corporation', ticker: 'VFC', exchange: 'NYSE', marketCapitalization: 6020, shareOutstanding: 385.9, finnhubIndustry: 'Apparel', country: 'US', currency: 'USD' },
  BWA: { name: 'BorgWarner Inc.', ticker: 'BWA', exchange: 'NYSE', marketCapitalization: 7450, shareOutstanding: 227.1, finnhubIndustry: 'Auto Parts', country: 'US', currency: 'USD' },
  NCLH: { name: 'Norwegian Cruise Line Holdings', ticker: 'NCLH', exchange: 'NYSE', marketCapitalization: 9620, shareOutstanding: 448.4, finnhubIndustry: 'Travel & Leisure', country: 'US', currency: 'USD' },
  CRL: { name: 'Charles River Laboratories', ticker: 'CRL', exchange: 'NYSE', marketCapitalization: 11080, shareOutstanding: 50.7, finnhubIndustry: 'Healthcare', country: 'US', currency: 'USD' },
  GNRC: { name: 'Generac Holdings Inc.', ticker: 'GNRC', exchange: 'NYSE', marketCapitalization: 8920, shareOutstanding: 61.2, finnhubIndustry: 'Industrial Machinery', country: 'US', currency: 'USD' },
  WBD: { name: 'Warner Bros. Discovery Inc.', ticker: 'WBD', exchange: 'NASDAQ', marketCapitalization: 24180, shareOutstanding: 2454.3, finnhubIndustry: 'Media', country: 'US', currency: 'USD' }
};

export const generateSampleChartData = (symbol) => {
  const basePrice = mockStockQuotes[symbol]?.c || 100;
  const volatility = ['TSLA', 'PARA', 'WBD', 'NCLH', 'VFC'].includes(symbol) ? 0.12 : 0.05;

  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: basePrice * (1 + (Math.random() - 0.5) * volatility),
    ma20: basePrice * (1 + (Math.random() - 0.5) * volatility * 0.5)
  }));
};

export const generateSampleValuations = (symbol) => {
  const currentPrice = mockStockQuotes[symbol]?.c || 100;
  const premium = Math.random() * 0.15 + 1.05; // 5-20% premium
  
  return {
    dcf: currentPrice * premium,
    asset: currentPrice * (premium * 0.95),
    epv: currentPrice * (premium * 1.02)
  };
};

export const generateSampleMetrics = (symbol) => {
  const quote = mockStockQuotes[symbol];
  const profile = mockCompanyProfiles[symbol];
  
  if (!quote || !profile) {
    return { peRatio: 25, pbRatio: 3, marketCap: 50000, percentChange: 0 };
  }
  
  const percentChange = ((quote.c - quote.pc) / quote.pc) * 100;
  const peRatio = profile.marketCapitalization / (quote.c * profile.shareOutstanding);
  
  return {
    peRatio: peRatio || 25,
    pbRatio: profile.marketCapitalization / (profile.shareOutstanding * 50) || 3,
    marketCap: profile.marketCapitalization,
    percentChange: percentChange
  };
};

export const generateSampleRiskScore = (symbol) => {
  // High risk for volatile/small cap stocks
  const highRiskStocks = ['TSLA', 'NWL', 'PARA', 'WBD', 'VFC', 'NCLH', 'MOS', 'IVZ', 'BWA'];
  const mediumRiskStocks = ['NVDA', 'AMD', 'META', 'AVGO', 'FMC', 'ALK', 'ZION', 'BEN', 'GNRC'];
  
  if (highRiskStocks.includes(symbol)) {
    return { score: 6 + Math.floor(Math.random() * 2), flags: 2 };
  } else if (mediumRiskStocks.includes(symbol)) {
    return { score: 4 + Math.floor(Math.random() * 2), flags: 1 };
  } else {
    return { score: 2 + Math.floor(Math.random() * 2), flags: 0 };
  }
};

export const generateSampleBenchmark = (symbol) => {
  const metrics = generateSampleMetrics(symbol);
  const marketPE = 18.5;
  const marketPB = 2.8;
  
  return {
    stockPE: metrics.peRatio,
    marketPE: marketPE,
    stockPB: metrics.pbRatio,
    marketPB: marketPB
  };
};

// Pre-calculated analysis cache for fast loading
export const preCalculatedAnalysis = {
  AAPL: { dcf: 245, assetBased: 235, epv: 240, riskScore: 3, riskFlags: 1 },
  MSFT: { dcf: 450, assetBased: 435, epv: 442, riskScore: 2, riskFlags: 0 },
  GOOGL: { dcf: 165, assetBased: 152, epv: 160, riskScore: 2, riskFlags: 0 },
  AMZN: { dcf: 210, assetBased: 185, epv: 200, riskScore: 3, riskFlags: 1 },
  NVDA: { dcf: 920, assetBased: 850, epv: 900, riskScore: 5, riskFlags: 2 },
  META: { dcf: 540, assetBased: 510, epv: 530, riskScore: 4, riskFlags: 1 },
  TSLA: { dcf: 265, assetBased: 250, epv: 270, riskScore: 7, riskFlags: 3 },
  'BRK.B': { dcf: 480, assetBased: 470, epv: 475, riskScore: 2, riskFlags: 0 },
  LLY: { dcf: 820, assetBased: 800, epv: 815, riskScore: 3, riskFlags: 1 },
  V: { dcf: 310, assetBased: 298, epv: 305, riskScore: 2, riskFlags: 0 },
  UNH: { dcf: 575, assetBased: 560, epv: 570, riskScore: 2, riskFlags: 0 },
  XOM: { dcf: 120, assetBased: 110, epv: 115, riskScore: 3, riskFlags: 1 },
  JPM: { dcf: 210, assetBased: 195, epv: 205, riskScore: 2, riskFlags: 0 },
  JNJ: { dcf: 165, assetBased: 160, epv: 163, riskScore: 2, riskFlags: 0 },
  WMT: { dcf: 190, assetBased: 180, epv: 185, riskScore: 2, riskFlags: 0 },
  PG: { dcf: 175, assetBased: 170, epv: 173, riskScore: 2, riskFlags: 0 },
  MA: { dcf: 510, assetBased: 495, epv: 505, riskScore: 3, riskFlags: 0 },
  HD: { dcf: 420, assetBased: 405, epv: 415, riskScore: 2, riskFlags: 0 },
  CVX: { dcf: 165, assetBased: 155, epv: 160, riskScore: 3, riskFlags: 1 },
  AVGO: { dcf: 1410, assetBased: 1360, epv: 1390, riskScore: 4, riskFlags: 1 },
  NWL: { dcf: 9, assetBased: 8, epv: 8.5, riskScore: 7, riskFlags: 3 },
  FMC: { dcf: 62, assetBased: 58, epv: 60, riskScore: 5, riskFlags: 2 },
  ALK: { dcf: 45, assetBased: 42, epv: 44, riskScore: 6, riskFlags: 2 },
  HII: { dcf: 260, assetBased: 250, epv: 255, riskScore: 4, riskFlags: 1 },
  NWSA: { dcf: 28, assetBased: 26, epv: 27, riskScore: 6, riskFlags: 2 },
  PARA: { dcf: 12, assetBased: 11, epv: 11.5, riskScore: 7, riskFlags: 3 },
  MOS: { dcf: 30, assetBased: 28, epv: 29, riskScore: 5, riskFlags: 2 },
  AIZ: { dcf: 195, assetBased: 185, epv: 190, riskScore: 4, riskFlags: 1 },
  TPR: { dcf: 52, assetBased: 50, epv: 51, riskScore: 5, riskFlags: 2 },
  ZION: { dcf: 55, assetBased: 52, epv: 54, riskScore: 5, riskFlags: 2 },
  REG: { dcf: 72, assetBased: 70, epv: 71, riskScore: 4, riskFlags: 1 },
  BEN: { dcf: 24, assetBased: 22, epv: 23, riskScore: 5, riskFlags: 2 },
  IVZ: { dcf: 17, assetBased: 16, epv: 16.5, riskScore: 5, riskFlags: 2 },
  GL: { dcf: 98, assetBased: 95, epv: 97, riskScore: 4, riskFlags: 1 },
  VFC: { dcf: 16, assetBased: 15, epv: 15.5, riskScore: 6, riskFlags: 2 },
  BWA: { dcf: 35, assetBased: 33, epv: 34, riskScore: 5, riskFlags: 2 },
  NCLH: { dcf: 23, assetBased: 21, epv: 22, riskScore: 7, riskFlags: 3 },
  CRL: { dcf: 230, assetBased: 220, epv: 225, riskScore: 4, riskFlags: 1 },
  GNRC: { dcf: 155, assetBased: 145, epv: 150, riskScore: 5, riskFlags: 2 },
  WBD: { dcf: 10.5, assetBased: 9.8, epv: 10, riskScore: 7, riskFlags: 3 }
};
