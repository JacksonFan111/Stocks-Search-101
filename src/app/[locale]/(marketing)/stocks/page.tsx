'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { StockInfoCard, GrahamBreakerCard, FVC3ScoreCard } from '@/components/molecules/StockCard';
import { ForensicDashboard } from '@/components/organisms/ForensicDashboard';

// Sample stock data for demo
const SAMPLE_STOCKS = [
  {
    id: 1,
    ticker: 'AAPL',
    name: 'Apple Inc',
    sector: 'Technology',
    price: 182.5,
    marketCap: '2.8T',
    aiSummary: 'Strong cash flow generation, excellent brand moat. Premium valuation reflects quality.',
  },
  {
    id: 2,
    ticker: 'KO',
    name: 'Coca-Cola Company',
    sector: 'Consumer Staples',
    price: 62.3,
    marketCap: '272B',
    aiSummary: 'Defensive dividend play with global distribution network. Modest growth expectations.',
  },
  {
    id: 3,
    ticker: 'JPM',
    name: 'JPMorgan Chase',
    sector: 'Financials',
    price: 214.6,
    marketCap: '585B',
    aiSummary: 'Leading investment bank with strong capital position. Sensitive to interest rates.',
  },
  {
    id: 4,
    ticker: 'XOM',
    name: 'Exxon Mobil',
    sector: 'Energy',
    price: 110.8,
    marketCap: '450B',
    aiSummary: 'Energy dividend yield attractive. Exposed to oil price volatility.',
  },
];

// Sample analysis results
const SAMPLE_ANALYSIS = {
  AAPL: {
    graham: {
      bubbleCapPass: true,
      junkFilterPass: true,
      dilutionCheckPass: true,
      solvencyPass: true,
      overallPass: true,
      failureReasons: [],
      scores: {
        peRatio: 32.5,
        interestCoverage: 12.3,
        shareCountChange: -2.1,
        assetLiabilityRatio: 1.82,
      },
    },
    fvc3: {
      valuationScore: 68,
      qualityScore: 85,
      momentumScore: 72,
      compositeScore: 74.2,
      recommendation: 'BUY' as const,
      metrics: {
        earningsYield: 0.03,
        fcfMargin: 0.95,
        riskAdjustedMomentum: 1.8,
      },
    },
    forensic: {
      paperProfitTrap: false,
      intangibleBloat: false,
      payableDaysAlarm: false,
      assetTurnoverTrend: false,
      gaapGap: false,
      revenueTrend: false,
      marginCompression: false,
      cashFlowDivergence: false,
      accountsReceivableTrend: false,
      debtMaturity: false,
      totalAlarms: 0,
      riskLevel: 'LOW' as const,
      details: {
        paperProfitTrap: { flag: false, ratio: 1.2, threshold: 5, explanation: 'Strong cash flow support' },
        intangibleBloat: { flag: false, ratio: 8.5, threshold: 20, explanation: 'Reasonable intangible asset level' },
        payableDaysAlarm: { flag: false, ratio: 45, threshold: 300, explanation: 'Normal payment terms' },
        assetTurnoverTrend: { flag: false, ratio: -0.5, threshold: 0, explanation: 'Stable asset efficiency' },
        gaapGap: { flag: false, ratio: 3.2, threshold: 15, explanation: 'GAAP and adjusted earnings aligned' },
        revenueTrend: { flag: false, ratio: 5.2, threshold: 0, explanation: 'Growing revenue' },
        marginCompression: { flag: false, ratio: 28, threshold: 5, explanation: 'Healthy profit margins' },
        cashFlowDivergence: { flag: false, ratio: 4.1, threshold: -10, explanation: 'Strong operating cash flow' },
        accountsReceivableTrend: { flag: false, ratio: 3.1, threshold: 5, explanation: 'Receivables in line with growth' },
        debtMaturity: { flag: false, ratio: 0.2, threshold: 1, explanation: 'Strong liquidity position' },
      },
    },
  },
  KO: {
    graham: {
      bubbleCapPass: true,
      junkFilterPass: true,
      dilutionCheckPass: true,
      solvencyPass: true,
      overallPass: true,
      failureReasons: [],
      scores: {
        peRatio: 28.1,
        interestCoverage: 4.5,
        shareCountChange: -1.2,
        assetLiabilityRatio: 2.1,
      },
    },
    fvc3: {
      valuationScore: 52,
      qualityScore: 71,
      momentumScore: 45,
      compositeScore: 55.3,
      recommendation: 'HOLD' as const,
      metrics: {
        earningsYield: 0.0356,
        fcfMargin: 0.92,
        riskAdjustedMomentum: 1.1,
      },
    },
    forensic: {
      paperProfitTrap: false,
      intangibleBloat: true,
      payableDaysAlarm: false,
      assetTurnoverTrend: false,
      gaapGap: false,
      revenueTrend: false,
      marginCompression: true,
      cashFlowDivergence: false,
      accountsReceivableTrend: false,
      debtMaturity: false,
      totalAlarms: 2,
      riskLevel: 'MEDIUM' as const,
      details: {
        paperProfitTrap: { flag: false, ratio: 2.1, threshold: 5, explanation: 'Good cash conversion' },
        intangibleBloat: { flag: true, ratio: 23.5, threshold: 20, explanation: 'Significant intangible assets from acquisitions' },
        payableDaysAlarm: { flag: false, ratio: 62, threshold: 300, explanation: 'Normal terms' },
        assetTurnoverTrend: { flag: false, ratio: 1.2, threshold: 0, explanation: 'Stable' },
        gaapGap: { flag: false, ratio: 8.3, threshold: 15, explanation: 'Aligned' },
        revenueTrend: { flag: false, ratio: -1.3, threshold: 0, explanation: 'Modest decline' },
        marginCompression: { flag: true, ratio: 21, threshold: 5, explanation: 'Tightening margins from input cost pressures' },
        cashFlowDivergence: { flag: false, ratio: 2.1, threshold: -10, explanation: 'Good cash conversion' },
        accountsReceivableTrend: { flag: false, ratio: -1.2, threshold: 5, explanation: 'Improving receivables' },
        debtMaturity: { flag: false, ratio: 0.3, threshold: 1, explanation: 'Good liquidity' },
      },
    },
  },
};

export default function StocksPage() {
  const t = useTranslations();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (ticker: string) => {
    setLoading(true);
    setSelectedStock(ticker);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Use sample data
    if (ticker === 'AAPL') {
      setAnalysis(SAMPLE_ANALYSIS.AAPL);
    } else if (ticker === 'KO') {
      setAnalysis(SAMPLE_ANALYSIS.KO);
    } else {
      // Generate random analysis for other stocks
      setAnalysis(generateRandomAnalysis());
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Stock Analysis</h1>
          <p className="text-lg text-gray-600">Polytope Model - Global Value Investing Framework</p>
          <p className="text-sm text-gray-500 mt-2">
            Forensic Value Composite (FVC 3.0): Graham Circuit Breaker + Sector Distortion Engine + 10-Point Alarm System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {SAMPLE_STOCKS.map((stock) => (
            <StockInfoCard
              key={stock.ticker}
              ticker={stock.ticker}
              name={stock.name}
              sector={stock.sector}
              price={stock.price}
              marketCap={stock.marketCap}
              onAnalyze={() => handleAnalyze(stock.ticker)}
            />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-700">Analyzing {selectedStock}...</span>
          </div>
        )}

        {!loading && selectedStock && analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-6 shadow-md">
              <div>
                <h2 className="text-3xl font-bold">
                  {SAMPLE_STOCKS.find((s) => s.ticker === selectedStock)?.name || selectedStock}
                </h2>
                <p className="text-gray-600">{selectedStock}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedStock(null);
                  setAnalysis(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                ✕ Clear
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GrahamBreakerCard
                passed={analysis.graham.overallPass}
                peRatio={analysis.graham.scores.peRatio}
                interestCoverage={analysis.graham.scores.interestCoverage}
                assetLiabilityRatio={analysis.graham.scores.assetLiabilityRatio}
                shareCountChange={analysis.graham.scores.shareCountChange}
                failureReasons={analysis.graham.failureReasons}
              />

              <FVC3ScoreCard
                compositeScore={analysis.fvc3.compositeScore}
                valuationScore={analysis.fvc3.valuationScore}
                qualityScore={analysis.fvc3.qualityScore}
                momentumScore={analysis.fvc3.momentumScore}
                recommendation={analysis.fvc3.recommendation}
              />
            </div>

            <ForensicDashboard
              riskLevel={analysis.forensic.riskLevel}
              totalAlarms={analysis.forensic.totalAlarms}
              details={analysis.forensic.details}
            />

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Summary</h3>
              <p className="text-gray-700">
                {analysis.graham.overallPass
                  ? `${selectedStock} passed the Graham Circuit Breaker. FVC3 Score of ${analysis.fvc3.compositeScore}/100 suggests a ${analysis.fvc3.recommendation} recommendation.`
                  : `${selectedStock} failed the Graham Circuit Breaker and is not recommended for investment.`}{' '}
                Forensic analysis detected {analysis.forensic.totalAlarms} potential red flags ({analysis.forensic.riskLevel} risk level).
              </p>
            </div>
          </div>
        )}

        {!loading && !selectedStock && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Select a stock above to see full analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}

function generateRandomAnalysis() {
  const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const recommendations = ['BUY', 'HOLD', 'SELL'];
  const alarmCount = Math.floor(Math.random() * 6);

  return {
    graham: {
      bubbleCapPass: Math.random() > 0.2,
      junkFilterPass: Math.random() > 0.1,
      dilutionCheckPass: Math.random() > 0.15,
      solvencyPass: Math.random() > 0.1,
      overallPass: Math.random() > 0.3,
      failureReasons: [],
      scores: {
        peRatio: Math.random() * 40,
        interestCoverage: Math.random() * 8,
        shareCountChange: (Math.random() - 0.5) * 8,
        assetLiabilityRatio: Math.random() * 3 + 0.5,
      },
    },
    fvc3: {
      valuationScore: Math.random() * 100,
      qualityScore: Math.random() * 100,
      momentumScore: Math.random() * 100,
      compositeScore: Math.random() * 100,
      recommendation: recommendations[Math.floor(Math.random() * 3)],
      metrics: {
        earningsYield: Math.random() * 0.1,
        fcfMargin: Math.random() * 1.5,
        riskAdjustedMomentum: Math.random() * 3,
      },
    },
    forensic: {
      paperProfitTrap: Math.random() > 0.7,
      intangibleBloat: Math.random() > 0.7,
      payableDaysAlarm: Math.random() > 0.95,
      assetTurnoverTrend: Math.random() > 0.7,
      gaapGap: Math.random() > 0.8,
      revenueTrend: Math.random() > 0.6,
      marginCompression: Math.random() > 0.7,
      cashFlowDivergence: Math.random() > 0.75,
      accountsReceivableTrend: Math.random() > 0.7,
      debtMaturity: Math.random() > 0.9,
      totalAlarms: alarmCount,
      riskLevel: riskLevels[Math.floor(alarmCount / 3)],
      details: {} as any,
    },
  };
}
