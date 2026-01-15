/**
 * Graham Circuit Breaker (The Gatekeeper)
 * 
 * First layer of the Polytope Model that filters out junk stocks and speculative bubbles.
 * Uses rules derived from Benjamin Graham's principles of margin of safety.
 * 
 * All rules must PASS for a stock to proceed to scoring. A single failure disqualifies.
 */

export interface FinancialData {
  peRatio: number;
  forwardPeRatio?: number;
  interestCoverage: number;
  shareCountChange: number; // 3-year change in %
  currentAssets: number;
  currentLiabilities: number;
}

export interface GrahamBreakerResult {
  bubbleCapPass: boolean;
  junkFilterPass: boolean;
  dilutionCheckPass: boolean;
  solvencyPass: boolean;
  overallPass: boolean;
  failureReasons: string[];
  scores: {
    peRatio: number;
    interestCoverage: number;
    shareCountChange: number;
    assetLiabilityRatio: number;
  };
}

/**
 * Bubble Cap Test: P/E < 35 (or forward P/E)
 * Rationale: Prevents entry into overvalued speculative names
 */
function testBubbleCap(peRatio: number, forwardPeRatio?: number): { pass: boolean; effectivePE: number } {
  const pe = forwardPeRatio !== undefined ? Math.min(peRatio, forwardPeRatio) : peRatio;
  return {
    pass: pe < 35 && pe > 0, // Also checks positive
    effectivePE: pe,
  };
}

/**
 * Junk Filter: Interest Coverage > 3.0 (EBIT / Interest Expense)
 * Rationale: Ensures the company can survive its debt obligations
 * Higher is safer
 */
function testJunkFilter(interestCoverage: number): { pass: boolean; coverage: number } {
  return {
    pass: interestCoverage > 3.0,
    coverage: interestCoverage,
  };
}

/**
 * Dilution Check: Share Count Change < 5% over 3 years
 * Rationale: Flags excessive stock-based compensation that dilutes shareholder value
 * Lower (more negative or closer to 0) is better for existing shareholders
 */
function testDilutionCheck(shareCountChange: number): { pass: boolean; change: number } {
  return {
    pass: Math.abs(shareCountChange) < 5.0,
    change: shareCountChange,
  };
}

/**
 * Solvency Test: Current Assets / Current Liabilities > 1.5
 * Rationale: Measures short-term liquidity and survival capability
 * Companies must have enough liquid assets to cover near-term obligations
 */
function testSolvency(currentAssets: number, currentLiabilities: number): { pass: boolean; ratio: number } {
  const ratio = currentAssets / currentLiabilities;
  return {
    pass: ratio > 1.5,
    ratio,
  };
}

/**
 * Main function: Apply all Graham Circuit Breaker rules
 * Returns detailed results and list of failures
 */
export function evaluateGrahamBreaker(financialData: FinancialData): GrahamBreakerResult {
  const failureReasons: string[] = [];

  // Test each rule
  const bubbleCap = testBubbleCap(financialData.peRatio, financialData.forwardPeRatio);
  if (!bubbleCap.pass) {
    failureReasons.push(`P/E ratio of ${bubbleCap.effectivePE.toFixed(2)} exceeds threshold of 35`);
  }

  const junkFilter = testJunkFilter(financialData.interestCoverage);
  if (!junkFilter.pass) {
    failureReasons.push(`Interest coverage of ${junkFilter.coverage.toFixed(2)}x is below required 3.0x`);
  }

  const dilutionCheck = testDilutionCheck(financialData.shareCountChange);
  if (!dilutionCheck.pass) {
    failureReasons.push(`Share count dilution of ${dilutionCheck.change.toFixed(2)}% exceeds 5% threshold`);
  }

  const solvency = testSolvency(financialData.currentAssets, financialData.currentLiabilities);
  if (!solvency.pass) {
    failureReasons.push(`Current ratio of ${solvency.ratio.toFixed(2)} is below required 1.5`);
  }

  const overallPass =
    bubbleCap.pass && junkFilter.pass && dilutionCheck.pass && solvency.pass;

  return {
    bubbleCapPass: bubbleCap.pass,
    junkFilterPass: junkFilter.pass,
    dilutionCheckPass: dilutionCheck.pass,
    solvencyPass: solvency.pass,
    overallPass,
    failureReasons,
    scores: {
      peRatio: bubbleCap.effectivePE,
      interestCoverage: junkFilter.coverage,
      shareCountChange: dilutionCheck.change,
      assetLiabilityRatio: solvency.ratio,
    },
  };
}

/**
 * Convenience function to check if a stock passes all gates
 * Used to pre-filter stocks before sending to scoring engine
 */
export function passesAllGates(financialData: FinancialData): boolean {
  return evaluateGrahamBreaker(financialData).overallPass;
}
