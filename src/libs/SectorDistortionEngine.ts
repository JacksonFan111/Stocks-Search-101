/**
 * Sector Distortion Engine (The Scoring Core)
 * 
 * Implements the FVC 3.0 (Forensic Value Composite 3.0) scoring system.
 * Scores stocks on a RELATIVE basis (vs sector peers) not absolute basis.
 * 
 * Three pillars of scoring (weighted):
 * - Valuation (40%): Earnings Yield percentile vs sector
 * - Quality (30%): FCF vs Net Income comparison (paper profit trap detection)
 * - Smart Momentum (30%): 12M return / 6M volatility (risk-adjusted momentum)
 * 
 * Formula: FVC3_Score = 100 * (0.40 * V + 0.30 * Q + 0.30 * M)
 * where V, Q, M are percentile ranks (0-100)
 */

export interface FinancialMetrics {
  earnings: number; // Net Income
  freeCashFlow: number;
  operatingCashFlow: number;
  totalAssets: number;
  netIncome: number;
  price: number;
  shares: number;
  volatility6M: number; // 6-month realized volatility (0-1)
  return12M: number; // 12-month total return (0-1)
}

export interface SectorComparison {
  medianPE: number; // Median P/E for sector
  medianFCFMargin: number; // Median FCF/Net Income for sector
  medianMomentum: number; // Median risk-adjusted momentum
  sectorStocks: number; // Number of stocks in sector
}

export interface FVC3Result {
  valuationScore: number; // 0-100 percentile
  qualityScore: number; // 0-100 percentile
  momentumScore: number; // 0-100 percentile
  compositeScore: number; // Final FVC3 score (0-100)
  recommendation: 'BUY' | 'HOLD' | 'SELL';
  metrics: {
    earningsYield: number; // E/P
    fcfMargin: number; // FCF / Net Income
    riskAdjustedMomentum: number; // 12M return / 6M volatility
  };
}

/**
 * Calculate Valuation Pillar (40% weight)
 * Uses Earnings Yield (E/P) as a relative valuation metric
 * Higher earnings yield is better (inverse of P/E)
 */
function scoreValuation(
  metrics: FinancialMetrics,
  comparison: SectorComparison
): number {
  // Earnings Yield = Earnings / Market Cap
  const marketCap = metrics.price * metrics.shares;
  if (marketCap <= 0) return 0;

  const earningsYield = metrics.earnings / marketCap;
  const sectorEarningsYield = 1 / comparison.medianPE; // Approximate sector earnings yield

  // Percentile score: higher yield = higher score
  // If this stock's yield is higher than sector median, it's a better value
  const percentileScore = Math.min(100, Math.max(0, (earningsYield / sectorEarningsYield) * 100));

  return percentileScore;
}

/**
 * Calculate Quality Pillar (30% weight)
 * Measures earnings quality via FCF to Net Income comparison
 * Detects the "Paper Profit Trap" where reported profits ≠ actual cash
 * 
 * Good quality: FCF ≈ Net Income (ratio close to 1.0)
 * Red flag: FCF << Net Income (earnings manipulation)
 */
function scoreQuality(metrics: FinancialMetrics, comparison: SectorComparison): number {
  if (metrics.netIncome <= 0) return 0;

  // FCF to Net Income ratio
  // Ratio > 1.0 means company converts profits to cash efficiently
  // Ratio < 0.5 is a red flag (only 50% of earnings are real cash)
  const fcfMargin = metrics.freeCashFlow / metrics.netIncome;

  // Normalized score where sector median = 50 percentile
  // Assume sector median FCF margin is comparison.medianFCFMargin (e.g., 0.85)
  const qualityRatio = fcfMargin / comparison.medianFCFMargin;
  const percentileScore = Math.min(100, Math.max(0, (qualityRatio / 1.2) * 100)); // Normalize to 0-100

  return percentileScore;
}

/**
 * Calculate Smart Momentum Pillar (30% weight)
 * "Grinding higher" pattern: 12-month return adjusted for volatility
 * Formula: (12M Return) / (6M Volatility)
 * 
 * Avoids chasing vertical spikes (high volatility)
 * Favors steady uptrends (low vol, consistent returns)
 * A stock with 20% return and 5% vol is better than 20% return with 30% vol
 */
function scoreMomentum(metrics: FinancialMetrics, comparison: SectorComparison): number {
  if (metrics.volatility6M <= 0) return 0;

  // Risk-adjusted momentum
  const riskAdjustedMomentum = metrics.return12M / metrics.volatility6M;

  // Normalize vs sector median
  const momentumRatio = riskAdjustedMomentum / comparison.medianMomentum;
  const percentileScore = Math.min(100, Math.max(0, (momentumRatio / 1.2) * 100));

  return percentileScore;
}

/**
 * Main function: Calculate complete FVC 3.0 score
 */
export function calculateFVC3Score(
  metrics: FinancialMetrics,
  comparison: SectorComparison
): FVC3Result {
  // Calculate individual pillars (0-100 percentile)
  const valuationScore = scoreValuation(metrics, comparison);
  const qualityScore = scoreQuality(metrics, comparison);
  const momentumScore = scoreMomentum(metrics, comparison);

  // Weights: 40% valuation, 30% quality, 30% momentum
  const compositeScore = 0.4 * valuationScore + 0.3 * qualityScore + 0.3 * momentumScore;

  // Generate recommendation based on score
  let recommendation: 'BUY' | 'HOLD' | 'SELL';
  if (compositeScore >= 70) {
    recommendation = 'BUY';
  } else if (compositeScore >= 40) {
    recommendation = 'HOLD';
  } else {
    recommendation = 'SELL';
  }

  // Calculate actual metrics for transparency
  const marketCap = metrics.price * metrics.shares;
  const earningsYield = metrics.earnings / marketCap;
  const fcfMargin = metrics.netIncome > 0 ? metrics.freeCashFlow / metrics.netIncome : 0;
  const riskAdjustedMomentum = metrics.volatility6M > 0 ? metrics.return12M / metrics.volatility6M : 0;

  return {
    valuationScore: Math.round(valuationScore * 100) / 100,
    qualityScore: Math.round(qualityScore * 100) / 100,
    momentumScore: Math.round(momentumScore * 100) / 100,
    compositeScore: Math.round(compositeScore * 100) / 100,
    recommendation,
    metrics: {
      earningsYield: Math.round(earningsYield * 10000) / 10000,
      fcfMargin: Math.round(fcfMargin * 100) / 100,
      riskAdjustedMomentum: Math.round(riskAdjustedMomentum * 100) / 100,
    },
  };
}

/**
 * Calculate sector percentile rank for a given score within a stock list
 * Used to show how this stock ranks vs its sector peers
 */
export function calculateSectorPercentile(stockScore: number, sectorScores: number[]): number {
  const sortedScores = [...sectorScores].sort((a, b) => a - b);
  const rank = sortedScores.filter((score) => score <= stockScore).length / sortedScores.length;
  return Math.round(rank * 100 * 100) / 100; // Return as 0-100 percentile
}
