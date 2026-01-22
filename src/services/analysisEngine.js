// Financial Analysis & Valuation Engine
import { preCalculatedAnalysis } from './sampleData';

export const calculateFinancialMetrics = (quote, profile) => {
  if (!quote || !profile) {
    return {
      currentPrice: 0,
      marketCap: 0,
      shareOutstanding: 1,
      dayHigh: 0,
      dayLow: 0,
      openPrice: 0,
      prevClose: 0,
      priceChange: 0,
      percentChange: 0,
      pe: 0,
      pb: 0,
      volume: 0
    };
  }

  const currentPrice = quote.c || 0;
  const marketCap = profile.marketCapitalization || 1;
  const shareOutstanding = profile.shareOutstanding || 1;
  
  // Basic Valuation Ratios
  const pe = currentPrice > 0 ? marketCap / (currentPrice * shareOutstanding / 1000000) : 0;
  const pb = Math.abs(marketCap) > 0 ? Math.abs(marketCap) / (shareOutstanding || 1) : 0;
  
  // Price movement analysis
  const priceChange = quote.c - quote.pc;
  const percentChange = quote.pc > 0 ? ((priceChange / quote.pc) * 100) : 0;
  
  return {
    currentPrice,
    marketCap,
    shareOutstanding,
    dayHigh: quote.h || 0,
    dayLow: quote.l || 0,
    openPrice: quote.o || 0,
    prevClose: quote.pc || 0,
    priceChange,
    percentChange,
    pe: isFinite(pe) ? pe : 0,
    pb: isFinite(pb) ? pb : 0,
    volume: quote.v || 0
  };
};

export const calculatePolytopeScore = (metrics, quote, profile) => {
  let score = 0;
  const flags = [];

  if (!metrics) return { score: 0, flags, risk: 'Unknown' };

  // 1. Price Volatility Check
  const dailyChange = Math.abs(metrics.percentChange);
  if (dailyChange > 5) {
    flags.push({
      category: '⚠️ High Daily Volatility',
      message: `${dailyChange.toFixed(2)}% daily change detected`,
      severity: 'medium',
      metric: dailyChange
    });
    score += 1;
  }

  // 2. Market Cap Check
  if (metrics.marketCap < 500) {
    flags.push({
      category: '⚠️ Small Cap Risk',
      message: `Market cap: $${metrics.marketCap.toFixed(0)}M (< $500M threshold)`,
      severity: 'high',
      metric: metrics.marketCap
    });
    score += 2;
  }

  // 3. Valuation Check (Price to Book)
  if (typeof metrics.pb === 'number') {
    if (metrics.pb > 10) {
      flags.push({
        category: '⚠️ High Valuation',
        message: `P/B Ratio: ${metrics.pb.toFixed(2)} (Potentially expensive)`,
        severity: 'medium',
        metric: metrics.pb
      });
      score += 1;
    } else if (metrics.pb > 20) {
      flags.push({
        category: '🔴 Extreme Valuation',
        message: `P/B Ratio: ${metrics.pb.toFixed(2)} (Very expensive)`,
        severity: 'high',
        metric: metrics.pb
      });
      score += 2;
    }
  }

  // 4. Industry Risk Check
  const riskyIndustries = ['Crypto', 'Cannabis', 'SPAC', 'Biotech'];
  if (profile.finnhubIndustry) {
    const industry = profile.finnhubIndustry.toLowerCase();
    if (riskyIndustries.some(ind => industry.includes(ind.toLowerCase()))) {
      flags.push({
        category: '⚠️ High-Risk Sector',
        message: `Sector: ${profile.finnhubIndustry}`,
        severity: 'high',
        metric: 'sector'
      });
      score += 1;
    }
  }

  // 5. Price Momentum
  if (metrics.percentChange < -10) {
    flags.push({
      category: '📉 Downward Momentum',
      message: `Stock down ${Math.abs(metrics.percentChange).toFixed(2)}% today`,
      severity: 'medium',
      metric: metrics.percentChange
    });
    score += 1;
  }

  // Determine risk level
  let risk = 'Low';
  let riskColor = 'green';
  if (score >= 6) {
    risk = 'High';
    riskColor = 'red';
  } else if (score >= 3) {
    risk = 'Medium';
    riskColor = 'yellow';
  }

  return { score, flags, risk, riskColor };
};

export const estimateDCFValuation = (quote, profile, metrics) => {
  // Use pre-calculated data for faster loading
  if (preCalculatedAnalysis[quote?.symbol] || preCalculatedAnalysis[profile?.ticker]) {
    const symbol = quote?.symbol || profile?.ticker;
    const cached = preCalculatedAnalysis[symbol];
    if (cached && cached.dcf) {
      return {
        fairValue: cached.dcf,
        currentPrice: metrics?.currentPrice || quote?.c || 0,
        upside: ((cached.dcf - (metrics?.currentPrice || quote?.c || 0)) / (metrics?.currentPrice || quote?.c || 1) * 100),
        status: cached.dcf > (metrics?.currentPrice || quote?.c || 0) ? 'Undervalued' : 'Overvalued'
      };
    }
  }

  // Fallback calculation
  if (!quote || !metrics) {
    return {
      fairValue: 0,
      currentPrice: 0,
      upside: 0,
      status: 'Unknown'
    };
  }

  const currentPrice = quote.c || 0;
  const shareOutstanding = metrics.shareOutstanding || 1;
  
  // Assumptions
  const fcf = Math.max(metrics.marketCap * 0.05, 1); // Assume FCF is 5% of market cap
  const growthRate = 0.06; // 6% perpetual growth
  const discountRate = 0.10; // 10% WACC
  
  // Gordon Growth Model: DCF = FCF * (1 + g) / (r - g)
  const denominator = (discountRate - growthRate);
  if (denominator <= 0) {
    return {
      fairValue: currentPrice * 1.1,
      currentPrice,
      upside: 10,
      status: 'Fair'
    };
  }

  const dcfValue = (fcf * (1 + growthRate)) / denominator;
  const fairValuePerShare = dcfValue / shareOutstanding;
  
  const upside = ((fairValuePerShare - currentPrice) / currentPrice) * 100;
  
  return {
    fairValue: fairValuePerShare > 0 ? fairValuePerShare : currentPrice,
    currentPrice,
    upside: isFinite(upside) ? upside : 0,
    status: upside > 20 ? 'Undervalued' : upside < -20 ? 'Overvalued' : 'Fair'
  };
};

export const estimateAssetBasedValuation = (profile, metrics) => {
  if (!metrics) {
    return {
      tangibleValuePerShare: 0,
      currentPrice: 0,
      discount: 0
    };
  }

  // Asset-based valuation (simplified)
  const marketCap = Math.max(metrics.marketCap, 1);
  const tangibleValue = marketCap * 0.7;
  const tangibleValuePerShare = tangibleValue / (metrics.shareOutstanding || 1);
  
  return {
    tangibleValuePerShare: tangibleValuePerShare > 0 ? tangibleValuePerShare : 0,
    currentPrice: metrics.currentPrice || 0,
    discount: metrics.currentPrice > 0 ? ((tangibleValuePerShare - metrics.currentPrice) / metrics.currentPrice) * 100 : 0
  };
};

export const estimateEPV = (metrics, quote) => {
  if (!metrics || !quote) {
    return {
      epvPerShare: 0,
      currentPrice: 0,
      margin: 0
    };
  }

  // Earning Power Value = Sustainable Earnings / WACC
  const sustainableEarnings = Math.max(metrics.marketCap * 0.08, 1); // Assume 8% sustainable earnings yield
  const wacc = 0.10; // 10% WACC
  
  const epv = sustainableEarnings / wacc;
  const epvPerShare = epv / (metrics.shareOutstanding || 1);
  
  return {
    epvPerShare: epvPerShare > 0 ? epvPerShare : 0,
    currentPrice: metrics.currentPrice || 0,
    margin: metrics.currentPrice > 0 ? ((epvPerShare - metrics.currentPrice) / metrics.currentPrice) * 100 : 0
  };
};

export const generateBenchmarkComparison = (metrics, symbol) => {
  // Market benchmarks (as of early 2026)
  const benchmarks = {
    avgPE: 18.5,
    avgPB: 2.8,
    avgDividendYield: 2.1,
    marketGrowthRate: 0.07
  };

  const peRatio = metrics.pe || 0;
  const pbRatio = metrics.pb || 0;

  return {
    benchmarks,
    peComparison: {
      value: peRatio,
      benchmark: benchmarks.avgPE,
      status: peRatio < benchmarks.avgPE ? 'Undervalued' : 'Overvalued',
      diff: ((peRatio - benchmarks.avgPE) / benchmarks.avgPE * 100).toFixed(1)
    },
    pbComparison: {
      value: pbRatio,
      benchmark: benchmarks.avgPB,
      status: pbRatio < benchmarks.avgPB ? 'Undervalued' : 'Overvalued',
      diff: ((pbRatio - benchmarks.avgPB) / benchmarks.avgPB * 100).toFixed(1)
    }
  };
};

export const generateChartsData = (quote) => {
  // Generate mock historical data for charts - FAST VERSION
  if (!quote) {
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: 100,
      high: 102,
      low: 98
    }));
  }

  const currentDate = new Date();
  const priceHistory = [];
  const basePrice = quote.pc || quote.c || 100;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    
    const volatility = (Math.random() - 0.5) * 0.04; // ±2% random daily movement
    const price = basePrice * (1 + volatility);
    
    priceHistory.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dateTime: date.toISOString(),
      price: Math.max(parseFloat(price.toFixed(2)), 0.01),
      high: Math.max(parseFloat((price * 1.02).toFixed(2)), 0.01),
      low: Math.max(parseFloat((price * 0.98).toFixed(2)), 0.01)
    });
  }

  return priceHistory;
};
