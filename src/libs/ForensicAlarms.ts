/**
 * Forensic Alarms (10-Point Alarm System)
 * 
 * Detects "red flags" of creative accounting and potential future crashes.
 * Each alarm represents a ratio or trend that signals financial manipulation or distress.
 * 
 * Higher alarm scores = higher risk of fraud/collapse
 */

export interface ForensicMetrics {
  netIncome: number;
  operatingCashFlow: number;
  totalAssets: number;
  intangibleAssets: number;
  payableDays: number;
  currentAssets: number;
  currentLiabilities: number;
  revenueChange: number; // YoY revenue change %
  assetTurnover: number; // Revenue / Total Assets
  assetTurnoverPriorYear: number;
  gaapNetIncome: number;
  nonGaapNetIncome: number;
  accountsReceivable: number;
  accountsReceivablePriorYear: number;
  inventory: number;
  inventoryPriorYear: number;
  cash: number;
  debtDue1Year: number;
  operatingCashFlowPriorYear: number;
}

export interface ForensicAlarmResult {
  paperProfitTrap: boolean;
  intangibleBloat: boolean;
  payableDaysAlarm: boolean;
  assetTurnoverTrend: boolean;
  gaapGap: boolean;
  revenueTrend: boolean;
  marginCompression: boolean;
  cashFlowDivergence: boolean;
  accountsReceivableTrend: boolean;
  debtMaturity: boolean;
  totalAlarms: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: Record<string, { flag: boolean; ratio: number; threshold: number; explanation: string }>;
}

/**
 * Alarm 1: Paper Profit Trap
 * (NI - Operating Cash Flow) / Total Assets > 5%
 * 
 * Indicates reported profits are not supported by actual cash inflows.
 * If a company reports $100M profit but only generated $50M cash, that's suspicious.
 */
function checkPaperProfitTrap(metrics: ForensicMetrics): {
  flag: boolean;
  ratio: number;
  explanation: string;
} {
  const profitQuality = (metrics.netIncome - metrics.operatingCashFlow) / metrics.totalAssets;
  const ratio = Math.abs(profitQuality) * 100; // Express as percentage

  return {
    flag: ratio > 5,
    ratio: Math.round(ratio * 100) / 100,
    explanation:
      ratio > 5
        ? `High divergence between reported profits and cash flow (${ratio.toFixed(2)}%). Suggests earnings quality issues.`
        : `Reported profits are well-supported by operating cash flow.`,
  };
}

/**
 * Alarm 2: Intangible Bloat
 * Intangible Assets > 20% of Total Assets
 * 
 * Suggests "Goodwill" or other non-amortized assets hiding losses.
 * Intangibles (patents, trademarks, goodwill) are easy to manipulate.
 */
function checkIntangibleBloat(metrics: ForensicMetrics): {
  flag: boolean;
  ratio: number;
  explanation: string;
} {
  const intangibleRatio = (metrics.intangibleAssets / metrics.totalAssets) * 100;

  return {
    flag: intangibleRatio > 20,
    ratio: Math.round(intangibleRatio * 100) / 100,
    explanation:
      intangibleRatio > 20
        ? `Intangible assets are ${intangibleRatio.toFixed(2)}% of total assets. High intangible ratio can mask poor fundamentals.`
        : `Intangible asset ratio (${intangibleRatio.toFixed(2)}%) is reasonable.`,
  };
}

/**
 * Alarm 3: Payable Days
 * Payable Days > 300
 * 
 * Sign of "unpaid suppliers," indicating extreme liquidity stress or hidden debt.
 * Companies paying suppliers in 300+ days are essentially using them as lenders.
 */
function checkPayableDaysAlarm(metrics: ForensicMetrics): {
  flag: boolean;
  ratio: number;
  explanation: string;
} {
  return {
    flag: metrics.payableDays > 300,
    ratio: Math.round(metrics.payableDays * 100) / 100,
    explanation:
      metrics.payableDays > 300
        ? `Payable days of ${metrics.payableDays.toFixed(0)} indicates severe liquidity stress. Suppliers are waiting 10+ months to be paid.`
        : `Payable days (${metrics.payableDays.toFixed(0)}) are within normal range.`,
  };
}

/**
 * Alarm 4: Asset Turnover Trend
 * Declining asset turnover while sales are rising
 * 
 * Signals "Asset Bloating" where company is piling up inventory it cannot sell.
 * Asset turnover = Revenue / Total Assets. If declining, company is less efficient.
 */
function checkAssetTurnoverTrend(metrics: ForensicMetrics): {
  flag: boolean;
  ratio: number;
  explanation: string;
} {
  const assetTurnoverChange = ((metrics.assetTurnover - metrics.assetTurnoverPriorYear) / metrics.assetTurnoverPriorYear) * 100;
  const revenueRising = metrics.revenueChange > 0;
  const turnoverFalling = assetTurnoverChange < 0;

  const flag = revenueRising && turnoverFalling;

  return {
    flag,
    ratio: Math.round(assetTurnoverChange * 100) / 100,
    explanation:
      flag
        ? `Asset turnover declined ${Math.abs(assetTurnoverChange).toFixed(2)}% while revenue rose. Company is accumulating assets inefficiently.`
        : `Asset efficiency trends are healthy.`,
  };
}

/**
 * Alarm 5: GAAP vs Non-GAAP Gap
 * Variance > 15%
 * 
 * Indicates "Footnote Shooting" where company uses adjusted metrics to hide poor performance.
 * If non-GAAP earnings are 20% higher than GAAP, that's suspicious.
 */
function checkGaapGap(metrics: ForensicMetrics): {
  flag: boolean;
  ratio: number;
  explanation: string;
} {
  if (metrics.gaapNetIncome === 0) {
    return { flag: false, ratio: 0, explanation: 'Insufficient data for GAAP comparison.' };
  }

  const gaapGap = ((metrics.nonGaapNetIncome - metrics.gaapNetIncome) / Math.abs(metrics.gaapNetIncome)) * 100;
  const ratio = Math.abs(gaapGap);

  return {
    flag: ratio > 15,
    ratio: Math.round(ratio * 100) / 100,
    explanation:
      ratio > 15
        ? `Large gap (${gaapGap.toFixed(2)}%) between GAAP and non-GAAP earnings. Company is using aggressive adjustments to boost reported profits.`
        : `GAAP and non-GAAP earnings are reasonably aligned.`,
  };
}

/**
 * Alarm 6: Revenue Trend Decline
 * Revenue declining YoY
 * 
 * Shrinking revenues combined with other flags suggests distress.
 */
function checkRevenueTrend(metrics: ForensicMetrics): {
  flag: boolean;
  ratio: number;
  explanation: string;
} {
  return {
    flag: metrics.revenueChange < 0,
    ratio: Math.round(metrics.revenueChange * 100) / 100,
    explanation:
      metrics.revenueChange < 0
        ? `Revenue declined ${Math.abs(metrics.revenueChange).toFixed(2)}% YoY. Organic business is shrinking.`
        : `Revenue is growing (${metrics.revenueChange.toFixed(2)}% YoY).`,
  };
}

/**
 * Alarm 7: Margin Compression
 * Net Margin declining while peers are stable
 * 
 * Operating profit margins shrinking = pricing power loss or cost control issues.
 */
function checkMarginCompression(metrics: ForensicMetrics): {
  flag: boolean;
  ratio: number;
  explanation: string;
} {
  const netMargin = metrics.netIncome / (metrics.totalAssets * 0.05); // Rough estimate
  const flag = netMargin < 5; // Assuming 5% is healthy benchmark

  return {
    flag,
    ratio: Math.round(netMargin * 100) / 100,
    explanation: flag
      ? `Net margin (${netMargin.toFixed(2)}%) is below industry healthy threshold.`
      : `Profit margins are healthy.`,
  };
}

/**
 * Alarm 8: Cash Flow Divergence
 * Operating Cash Flow declining while Net Income stable/rising
 * 
 * Classic sign of earnings manipulation. Cash never lies.
 */
function checkCashFlowDivergence(metrics: ForensicMetrics): {
  flag: boolean;
  ratio: number;
  explanation: string;
} {
  const ocfChange = ((metrics.operatingCashFlow - metrics.operatingCashFlowPriorYear) / metrics.operatingCashFlowPriorYear) * 100;

  const flag = ocfChange < -10 && metrics.revenueChange > 0;

  return {
    flag,
    ratio: Math.round(ocfChange * 100) / 100,
    explanation: flag
      ? `Operating cash flow declined ${Math.abs(ocfChange).toFixed(2)}% while revenue rose. Cash generation is decoupling from reported earnings.`
      : `Operating cash flow trends are healthy.`,
  };
}

/**
 * Alarm 9: Accounts Receivable Trend
 * A/R growing faster than revenue
 * 
 * Sign of channel stuffing or inability to collect. Company books sales customers won't pay for.
 */
function checkAccountsReceivableTrend(metrics: ForensicMetrics): {
  flag: boolean;
  ratio: number;
  explanation: string;
} {
  const arChange = ((metrics.accountsReceivable - metrics.accountsReceivablePriorYear) / metrics.accountsReceivablePriorYear) * 100;
  const flag = arChange > (metrics.revenueChange + 5); // A/R growing much faster than revenue

  return {
    flag,
    ratio: Math.round(arChange * 100) / 100,
    explanation: flag
      ? `Accounts receivable growing (${arChange.toFixed(2)}%) much faster than revenue growth. Potential channel stuffing.`
      : `Receivables are growing in line with revenue.`,
  };
}

/**
 * Alarm 10: Debt Maturity
 * Debt due within 1 year > cash available
 * 
 * Liquidity crisis indicator. Company may not have cash to pay debt maturing soon.
 */
function checkDebtMaturity(metrics: ForensicMetrics): {
  flag: boolean;
  ratio: number;
  explanation: string;
} {
  const ratio = metrics.debtDue1Year / (metrics.cash + 1); // +1 to avoid division by zero
  const flag = ratio > 1; // More debt due than cash available

  return {
    flag,
    ratio: Math.round(ratio * 100) / 100,
    explanation: flag
      ? `Debt due within 1 year (${metrics.debtDue1Year.toFixed(0)}) exceeds available cash (${metrics.cash.toFixed(0)}). Potential refinancing risk.`
      : `Debt maturity profile is manageable.`,
  };
}

/**
 * Main function: Calculate all forensic alarms
 */
export function evaluateForensicAlarms(metrics: ForensicMetrics): ForensicAlarmResult {
  const paperProfitTrap = checkPaperProfitTrap(metrics);
  const intangibleBloat = checkIntangibleBloat(metrics);
  const payableDaysAlarm = checkPayableDaysAlarm(metrics);
  const assetTurnoverTrend = checkAssetTurnoverTrend(metrics);
  const gaapGap = checkGaapGap(metrics);
  const revenueTrend = checkRevenueTrend(metrics);
  const marginCompression = checkMarginCompression(metrics);
  const cashFlowDivergence = checkCashFlowDivergence(metrics);
  const accountsReceivableTrend = checkAccountsReceivableTrend(metrics);
  const debtMaturity = checkDebtMaturity(metrics);

  const alarms = [
    paperProfitTrap.flag,
    intangibleBloat.flag,
    payableDaysAlarm.flag,
    assetTurnoverTrend.flag,
    gaapGap.flag,
    revenueTrend.flag,
    marginCompression.flag,
    cashFlowDivergence.flag,
    accountsReceivableTrend.flag,
    debtMaturity.flag,
  ];

  const totalAlarms = alarms.filter((a) => a).length;

  // Determine risk level
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  if (totalAlarms === 0) riskLevel = 'LOW';
  else if (totalAlarms <= 2) riskLevel = 'MEDIUM';
  else if (totalAlarms <= 4) riskLevel = 'HIGH';
  else riskLevel = 'CRITICAL';

  return {
    paperProfitTrap: paperProfitTrap.flag,
    intangibleBloat: intangibleBloat.flag,
    payableDaysAlarm: payableDaysAlarm.flag,
    assetTurnoverTrend: assetTurnoverTrend.flag,
    gaapGap: gaapGap.flag,
    revenueTrend: revenueTrend.flag,
    marginCompression: marginCompression.flag,
    cashFlowDivergence: cashFlowDivergence.flag,
    accountsReceivableTrend: accountsReceivableTrend.flag,
    debtMaturity: debtMaturity.flag,
    totalAlarms,
    riskLevel,
    details: {
      paperProfitTrap: { flag: paperProfitTrap.flag, ratio: paperProfitTrap.ratio, threshold: 5, explanation: paperProfitTrap.explanation },
      intangibleBloat: { flag: intangibleBloat.flag, ratio: intangibleBloat.ratio, threshold: 20, explanation: intangibleBloat.explanation },
      payableDaysAlarm: { flag: payableDaysAlarm.flag, ratio: payableDaysAlarm.ratio, threshold: 300, explanation: payableDaysAlarm.explanation },
      assetTurnoverTrend: { flag: assetTurnoverTrend.flag, ratio: assetTurnoverTrend.ratio, threshold: 0, explanation: assetTurnoverTrend.explanation },
      gaapGap: { flag: gaapGap.flag, ratio: gaapGap.ratio, threshold: 15, explanation: gaapGap.explanation },
      revenueTrend: { flag: revenueTrend.flag, ratio: revenueTrend.ratio, threshold: 0, explanation: revenueTrend.explanation },
      marginCompression: { flag: marginCompression.flag, ratio: marginCompression.ratio, threshold: 5, explanation: marginCompression.explanation },
      cashFlowDivergence: { flag: cashFlowDivergence.flag, ratio: cashFlowDivergence.ratio, threshold: -10, explanation: cashFlowDivergence.explanation },
      accountsReceivableTrend: { flag: accountsReceivableTrend.flag, ratio: accountsReceivableTrend.ratio, threshold: 5, explanation: accountsReceivableTrend.explanation },
      debtMaturity: { flag: debtMaturity.flag, ratio: debtMaturity.ratio, threshold: 1, explanation: debtMaturity.explanation },
    },
  };
}
