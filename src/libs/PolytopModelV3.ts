/**
 * Polytope Model V3 - Forensic Financial Analysis Engine
 * 
 * Integrates:
 * - 10-Point Alarm System (PFT - Polytope Fraud Theory)
 * - Critical Forensic Analysis Framework
 * - Fundamental Index Screening
 * - Warren Buffett Value Approach
 * 
 * For every company, asks:
 * "Can OCF cover debt repayments without refinancing?"
 * "Is FCF funding growth, or is debt filling the gap?"
 */

import { logger } from './Logger';

export interface ForensicMetrics {
  // I. Fundamental Index
  currentRatio: number;
  debtToEquity: number;
  assetTurnover: number;
  netProfitMargin: number;
  freeCashFlow: number;
  peRatio: number;
  evEbitda: number;

  // II. Polytope 10-Point Alarm System
  debtFueledGrowth: boolean;
  paperProfitTrap: boolean;
  gaapVsNonGaap: number;
  intangibleBloat: boolean;
  inventoryStretch: boolean;
  supplyChainFinancing: boolean;
  cryptoExposure: boolean;
  shortSellerSignal: boolean;
  industryContagion: boolean;
  bigBathWatch: boolean;

  // III. Critical Forensic Tests
  ocfDebtCoverage: number;
  rdCapitalizationRate: number;
  supplyChainPayableDays: number;
  assetTurnoverTrend: number;
  digitalIntangibleGap: number;

  // Overall Risk Score
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  polytopeFlagCount: number;
  recommendation: string;
}

export interface ResearchItem {
  ticker: string;
  company: string;
  sector: string;
  country: string;
  exchange: string;
  price: number;
  marketCap: number;
  
  // Financial data
  revenue: number;
  netIncome: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  totalAssets: number;
  totalLiabilities: number;
  debt: number;
  equity: number;
  currentAssets: number;
  currentLiabilities: number;
  goodwill: number;
  intangibles: number;
  
  // Analysis
  forensics: ForensicMetrics;
  undervaluationGap: number; // DCF vs market price
  dcfValue: number;
  tangibleBookValue: number;
}

/**
 * FUNDAMENTAL INDEX SCREENING
 * Must pass these checks to even be considered for valuation
 */
export function screenFundamentalIndex(data: any): boolean {
  const checks = {
    liquidity: data.currentRatio > 1.5,
    solvency: data.debtToEquity < 1.0,
    efficiency: data.roa > 5,
    profitability: data.netProfitMargin > 10,
    cashFlow: data.fcf > 0,
    valuation: true, // Will verify later
  };

  logger.info('[Polytope] Fundamental Index Screening', {
    liquidity: checks.liquidity,
    solvency: checks.solvency,
    efficiency: checks.efficiency,
    profitability: checks.profitability,
    cashFlow: checks.cashFlow,
  });

  return Object.values(checks).every(v => v === true);
}

/**
 * POLYTOPE 10-POINT ALARM SYSTEM
 * Reorganized to align with Short Seller Forensic Methods
 */
export function evaluatePolytope10Alarms(data: any): Partial<ForensicMetrics> {
  const alarms = {
    // A. Cash vs. Paper Disconnect
    debtFueledGrowth: calculateDebtFueledGrowth(data),
    paperProfitTrap: calculatePaperProfitTrap(data),
    gaapVsNonGaap: calculateGaapVsNonGaap(data),

    // B. Balance Sheet Forensics
    intangibleBloat: calculateIntangibleBloat(data),
    inventoryStretch: calculateInventoryStretch(data),
    supplyChainFinancing: calculateSupplyChainFinancing(data),
    cryptoExposure: calculateCryptoExposure(data),

    // C. Smart Money & Contagion
    shortSellerSignal: calculateShortSellerSignal(data),
    industryContagion: calculateIndustryContagion(data),
    bigBathWatch: calculateBigBathWatch(data),
  };

  const flagCount = Object.values(alarms).filter(a => a === true || a > 0.4).length;

  logger.info('[Polytope] 10-Point Alarm System', {
    flagCount,
    alarms,
  });

  return {
    ...alarms,
    polytopeFlagCount: flagCount,
  };
}

/**
 * CRITICAL FORENSIC ANALYSIS FRAMEWORK
 * Tests with Polytope Thresholds
 */
export function evaluateForensicAnalysis(data: any): Partial<ForensicMetrics> {
  const tests = {
    // 1. OCF / Debt Maturities
    ocfDebtCoverage: data.operatingCashFlow / (data.debtMaturities || data.debt),

    // 2. R&D Capitalization Rate
    rdCapitalizationRate: (data.rdCapitalized || 0) / data.totalAssets,

    // 3. GAAP vs Non-GAAP
    gaapVsNonGaapVariance: calculateGaapVsNonGaap(data),

    // 4. Supply Chain Payable Days
    supplyChainPayableDays: calculatePayableDays(data),

    // 5. Asset Turnover Trend
    assetTurnoverTrend: data.revenue / data.totalAssets,

    // 6. Digital/Intangible Gap
    digitalIntangibleGap: (data.intangibles / data.totalAssets) * 100,
  };

  logger.info('[Polytope] Forensic Analysis', tests);

  return tests as any;
}

// ===== Helper Functions =====

function calculateDebtFueledGrowth(data: any): boolean {
  const debtToFcf = data.debt / (data.fcf || 1);
  return debtToFcf > 3; // If debt is >3x FCF, growth is debt-fueled
}

function calculatePaperProfitTrap(data: any): boolean {
  const accrualRatio = (data.netIncome - data.operatingCashFlow) / (data.totalAssets || 1);
  return accrualRatio > 0.05; // >5% threshold = red flag
}

function calculateGaapVsNonGaap(data: any): number {
  const variance = Math.abs(data.gaapEps - (data.nonGaapEps || data.gaapEps)) / 
                   Math.max(data.gaapEps, 0.01);
  return variance * 100;
}

function calculateIntangibleBloat(data: any): boolean {
  const intangibleRatio = (data.goodwill + data.intangibles) / data.totalAssets;
  return intangibleRatio > 0.2; // >20% = red flag
}

function calculateInventoryStretch(data: any): boolean {
  const currentDio = (data.inventory / data.cogs) * 365;
  const previousDio = data.previousInventory ? (data.previousInventory / data.previousCogs) * 365 : currentDio;
  return currentDio > previousDio * 1.15; // >15% increase = red flag
}

function calculateSupplyChainFinancing(data: any): boolean {
  const otherPayables = data.otherPayables || 0;
  return otherPayables > (data.currentLiabilities * 0.3);
}

function calculateCryptoExposure(data: any): boolean {
  const cryptoAssets = data.cryptoAssets || 0;
  return cryptoAssets > (data.totalAssets * 0.05); // >5% = red flag
}

function calculateShortSellerSignal(data: any): boolean {
  return data.shortInterestRatio > 0.15 || data.borrowingCost > 0.1;
}

function calculateIndustryContagion(data: any): boolean {
  return data.peerFraudCount > 0 && data.sector === 'High Risk';
}

function calculateBigBathWatch(data: any): boolean {
  const ceoAge = data.ceoTenure; // months
  return ceoAge < 12 && data.writeDowns > (data.netIncome * 2);
}

function calculatePayableDays(data: any): number {
  return (data.accountsPayable / data.cogs) * 365;
}

/**
 * VALUATION METHODS
 * Only apply AFTER company passes Forensic Framework
 */
export function calculateDCFValuation(data: any, discountRate: number = 0.12): number {
  const freeCashFlows = data.projectedFcf || [data.fcf];
  const terminalGrowth = 0.025; // 2.5% perpetual growth

  // Project FCF for 5 years
  const projections = [];
  let currentFcf = data.fcf;
  for (let year = 1; year <= 5; year++) {
    currentFcf = currentFcf * (1 + data.fcfGrowthRate || 0.05);
    projections.push(currentFcf / Math.pow(1 + discountRate, year));
  }

  // Terminal value
  const terminalFcf = currentFcf * (1 + terminalGrowth);
  const terminalValue = terminalFcf / (discountRate - terminalGrowth);
  const pv_terminal = terminalValue / Math.pow(1 + discountRate, 5);

  const dcfValue = projections.reduce((a, b) => a + b, 0) + pv_terminal;

  logger.info('[Polytope] DCF Valuation', {
    dcfValue,
    discountRate,
    currentPrice: data.price,
    upside: ((dcfValue - data.price) / data.price) * 100,
  });

  return dcfValue;
}

export function calculateAssetBasedValuation(data: any): number {
  // Tangible Book Value (strip out Goodwill & Intangibles)
  const tangibleAssets = data.totalAssets - data.goodwill - data.intangibles;
  const tangibleBookValue = tangibleAssets - data.totalLiabilities;
  const tbvPerShare = tangibleBookValue / data.sharesOutstanding;

  return tbvPerShare;
}

export function calculateEarningPowerValue(data: any, discountRate: number = 0.10): number {
  // Sustainable earnings excluding growth
  const sustainableEarnings = data.netIncome * (1 - data.fcfToNiRatio); // Conservative approach
  const epv = sustainableEarnings / discountRate;

  return epv;
}

/**
 * GENERATE POLYTOPE RISK SCORE
 */
export function generatePolytopRiskScore(forensics: ForensicMetrics): {
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
} {
  let riskPoints = 0;
  const flagCount = forensics.polytopeFlagCount || 0;

  // The Polytope Rule: One red flag might be an error; Three red flags is a pattern
  if (flagCount >= 3) {
    riskPoints += 3;
  } else if (flagCount === 2) {
    riskPoints += 2;
  } else if (flagCount === 1) {
    riskPoints += 1;
  }

  // Critical forensic tests
  if (forensics.ocfDebtCoverage < 0.8) riskPoints += 2;
  if (forensics.rdCapitalizationRate > 0.6) riskPoints += 2;
  if (forensics.gaapVsNonGaap > 40) riskPoints += 2;
  if (forensics.supplyChainPayableDays > 300) riskPoints += 1;

  // Determine risk level
  let riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  let recommendation = '';

  if (riskPoints >= 7) {
    riskScore = 'CRITICAL';
    recommendation = '🚫 AVOID - Multiple red flags indicate potential fraud or distress.';
  } else if (riskPoints >= 4) {
    riskScore = 'HIGH';
    recommendation = '⚠️ CAUTION - Significant risks. Deep dive required before investment.';
  } else if (riskPoints >= 1) {
    riskScore = 'MEDIUM';
    recommendation = '🔍 INVESTIGATE - Monitor for improvements. Consider entry on weakness.';
  } else {
    riskScore = 'LOW';
    recommendation = '✅ BUY SIGNAL - Strong fundamentals. Wait for margin of safety entry.';
  }

  return { riskScore, recommendation };
}

/**
 * COMPREHENSIVE RESEARCH ANALYSIS
 */
export function conductPolytopResearch(data: any): ResearchItem {
  // Step 1: Screen Fundamental Index
  const passesFundamental = screenFundamentalIndex(data);

  if (!passesFundamental) {
    logger.warn(`[Polytope] ${data.ticker} failed fundamental screening`);
  }

  // Step 2: Evaluate Polytope Alarms
  const polytopAlarms = evaluatePolytope10Alarms(data);

  // Step 3: Forensic Analysis
  const forensicTests = evaluateForensicAnalysis(data);

  // Step 4: Valuation
  const dcfValue = calculateDCFValuation(data);
  const tbvPerShare = calculateAssetBasedValuation(data);
  const epvPerShare = calculateEarningPowerValue(data);

  // Step 5: Risk Score
  const forensics: ForensicMetrics = {
    currentRatio: data.currentRatio,
    debtToEquity: data.debtToEquity,
    assetTurnover: data.assetTurnover,
    netProfitMargin: data.netProfitMargin,
    freeCashFlow: data.fcf,
    peRatio: data.peRatio,
    evEbitda: data.evEbitda,
    ...polytopAlarms,
    ...forensicTests,
    ...generatePolytopRiskScore({ ...polytopAlarms, ...forensicTests } as ForensicMetrics),
  } as ForensicMetrics;

  const undervaluationGap = ((dcfValue - data.price) / data.price) * 100;

  const research: ResearchItem = {
    ticker: data.ticker,
    company: data.company,
    sector: data.sector,
    country: data.country,
    exchange: data.exchange,
    price: data.price,
    marketCap: data.marketCap,
    revenue: data.revenue,
    netIncome: data.netIncome,
    operatingCashFlow: data.operatingCashFlow,
    freeCashFlow: data.fcf,
    totalAssets: data.totalAssets,
    totalLiabilities: data.totalLiabilities,
    debt: data.debt,
    equity: data.equity,
    currentAssets: data.currentAssets,
    currentLiabilities: data.currentLiabilities,
    goodwill: data.goodwill,
    intangibles: data.intangibles,
    forensics,
    undervaluationGap,
    dcfValue,
    tangibleBookValue: tbvPerShare,
  };

  logger.info(`[Polytope] Research Complete: ${data.ticker}`, {
    riskScore: forensics.riskScore,
    undervaluation: undervaluationGap,
    recommendation: forensics.recommendation,
  });

  return research;
}
