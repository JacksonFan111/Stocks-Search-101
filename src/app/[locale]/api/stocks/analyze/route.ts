import { NextResponse } from 'next/server';
import * as z from 'zod';
import { evaluateForensicAlarms } from '@/libs/ForensicAlarms';
import { evaluateGrahamBreaker } from '@/libs/GrahamBreaker';
import { calculateFVC3Score } from '@/libs/SectorDistortionEngine';
import { logger } from '@/libs/Logger';

/**
 * Validation schema for stock analysis request
 */
const AnalysisRequestSchema = z.object({
  ticker: z.string().min(1).max(10),
  // Graham Breaker inputs
  peRatio: z.number().positive(),
  forwardPeRatio: z.number().positive().optional(),
  interestCoverage: z.number(),
  shareCountChange: z.number(),
  currentAssets: z.number().positive(),
  currentLiabilities: z.number().positive(),
  // FVC3.0 inputs
  earnings: z.number(),
  freeCashFlow: z.number(),
  operatingCashFlow: z.number(),
  totalAssets: z.number().positive(),
  netIncome: z.number(),
  price: z.number().positive(),
  shares: z.number().positive(),
  volatility6M: z.number().min(0).max(1),
  return12M: z.number().min(-1).max(10),
  // Sector comparison baseline
  sectorMedianPE: z.number().positive(),
  sectorMedianFCFMargin: z.number().positive(),
  sectorMedianMomentum: z.number().positive(),
  // Forensic inputs
  intangibleAssets: z.number().non_negative(),
  payableDays: z.number().non_negative(),
  assetTurnover: z.number().positive(),
  assetTurnoverPriorYear: z.number().positive(),
  gaapNetIncome: z.number(),
  nonGaapNetIncome: z.number(),
  accountsReceivable: z.number(),
  accountsReceivablePriorYear: z.number(),
  inventory: z.number(),
  inventoryPriorYear: z.number(),
  cash: z.number(),
  debtDue1Year: z.number(),
  operatingCashFlowPriorYear: z.number(),
  revenueChange: z.number(),
});

type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>;

/**
 * POST /api/stocks/analyze
 * 
 * Comprehensive stock analysis pipeline:
 * 1. Graham Circuit Breaker (gatekeeping)
 * 2. FVC 3.0 Scoring (relative valuation + quality + momentum)
 * 3. Forensic Alarm System (10-point red flag detection)
 */
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const parseResult = AnalysisRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: z.treeifyError(parseResult.error),
        },
        { status: 422 }
      );
    }

    const data: AnalysisRequest = parseResult.data;

    // Step 1: Graham Circuit Breaker (The Gatekeeper)
    const grahamResult = evaluateGrahamBreaker({
      peRatio: data.peRatio,
      forwardPeRatio: data.forwardPeRatio,
      interestCoverage: data.interestCoverage,
      shareCountChange: data.shareCountChange,
      currentAssets: data.currentAssets,
      currentLiabilities: data.currentLiabilities,
    });

    logger.info(`Graham Breaker for ${data.ticker}: ${grahamResult.overallPass ? 'PASS' : 'FAIL'}`);

    // Step 2: FVC 3.0 Scoring (if it passes Graham)
    let fvc3Result = null;
    if (grahamResult.overallPass) {
      fvc3Result = calculateFVC3Score(
        {
          earnings: data.earnings,
          freeCashFlow: data.freeCashFlow,
          operatingCashFlow: data.operatingCashFlow,
          totalAssets: data.totalAssets,
          netIncome: data.netIncome,
          price: data.price,
          shares: data.shares,
          volatility6M: data.volatility6M,
          return12M: data.return12M,
        },
        {
          medianPE: data.sectorMedianPE,
          medianFCFMargin: data.sectorMedianFCFMargin,
          medianMomentum: data.sectorMedianMomentum,
          sectorStocks: 100, // Placeholder
        }
      );

      logger.info(`FVC3 Score for ${data.ticker}: ${fvc3Result.compositeScore}`);
    }

    // Step 3: Forensic Alarm System
    const forensicResult = evaluateForensicAlarms({
      netIncome: data.netIncome,
      operatingCashFlow: data.operatingCashFlow,
      totalAssets: data.totalAssets,
      intangibleAssets: data.intangibleAssets,
      payableDays: data.payableDays,
      currentAssets: data.currentAssets,
      currentLiabilities: data.currentLiabilities,
      revenueChange: data.revenueChange,
      assetTurnover: data.assetTurnover,
      assetTurnoverPriorYear: data.assetTurnoverPriorYear,
      gaapNetIncome: data.gaapNetIncome,
      nonGaapNetIncome: data.nonGaapNetIncome,
      accountsReceivable: data.accountsReceivable,
      accountsReceivablePriorYear: data.accountsReceivablePriorYear,
      inventory: data.inventory,
      inventoryPriorYear: data.inventoryPriorYear,
      cash: data.cash,
      debtDue1Year: data.debtDue1Year,
      operatingCashFlowPriorYear: data.operatingCashFlowPriorYear,
    });

    logger.info(`Forensic analysis for ${data.ticker}: ${forensicResult.totalAlarms} alarms`);

    return NextResponse.json({
      ticker: data.ticker,
      grahamBreaker: grahamResult,
      fvc3Score: fvc3Result,
      forensicAlarms: forensicResult,
      overallAssessment: {
        passedGrahams: grahamResult.overallPass,
        recommendation: fvc3Result?.recommendation || 'HOLD',
        riskLevel: forensicResult.riskLevel,
        summary: generateSummary(grahamResult, fvc3Result, forensicResult),
      },
    });
  } catch (error) {
    logger.error('Error in /api/stocks/analyze:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze stock',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};

/**
 * Generate a human-readable summary of the analysis
 */
function generateSummary(
  graham: any,
  fvc3: any,
  forensic: any
): string {
  if (!graham.overallPass) {
    const reasons = graham.failureReasons.join('; ');
    return `Stock failed Graham Circuit Breaker: ${reasons}`;
  }

  let summary = `Passed Graham Breaker. `;

  if (fvc3) {
    summary += `FVC3 Score: ${fvc3.compositeScore}/100 (${fvc3.recommendation}). `;
  }

  if (forensic.totalAlarms === 0) {
    summary += `No forensic red flags detected.`;
  } else {
    summary += `⚠️ ${forensic.totalAlarms} forensic alarms (${forensic.riskLevel} risk).`;
  }

  return summary;
}
