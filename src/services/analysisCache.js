import { mockStockQuotes, mockCompanyProfiles } from './sampleData';
import { 
  calculateFinancialMetrics, 
  calculatePolytopeScore,
  estimateDCFValuation,
  estimateAssetBasedValuation,
  estimateEPV,
  generateBenchmarkComparison,
  generateChartsData
} from './analysisEngine';

// Pre-calculated analysis cache
const analysisCache = {};

// Pre-load all analysis for mock stocks
export const preloadAnalysis = () => {
  const symbols = Object.keys(mockStockQuotes);
  
  symbols.forEach(symbol => {
    try {
      const quote = mockStockQuotes[symbol];
      const profile = mockCompanyProfiles[symbol];
      
      if (!quote || !profile) return;
      
      const metrics = calculateFinancialMetrics(quote, profile);
      const polytopeScore = calculatePolytopeScore(metrics, quote, profile);
      const dcf = estimateDCFValuation(quote, profile, metrics);
      const assetBased = estimateAssetBasedValuation(profile, metrics);
      const epv = estimateEPV(metrics, quote);
      const benchmark = generateBenchmarkComparison(metrics, symbol);
      const chartData = generateChartsData(quote);
      
      analysisCache[symbol] = {
        quote,
        profile,
        metrics,
        polytopeScore,
        valuations: { dcf, assetBased, epv },
        benchmark,
        chartData
      };
    } catch (err) {
      console.error(`Failed to preload analysis for ${symbol}:`, err);
    }
  });
  
  console.log(`✅ Pre-loaded analysis for ${Object.keys(analysisCache).length} stocks`);
};

// Get cached analysis (instant)
export const getCachedAnalysis = (symbol) => {
  return analysisCache[symbol] || null;
};

// Check if analysis is cached
export const hasCache = (symbol) => {
  return !!analysisCache[symbol];
};
