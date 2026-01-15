/**
 * Atomic Design - Molecules
 * Groups of atoms working together
 */

import { MetricBadge, StatusIcon, ProgressBar } from '@/components/atoms/MetricBadge';

// StockInfoCard - displays core stock info
export interface StockInfoCardProps {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  marketCap: string;
  onAnalyze?: () => void;
}

export function StockInfoCard({ ticker, name, sector, price, marketCap, onAnalyze }: StockInfoCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{ticker}</h3>
          <p className="text-gray-600">{name}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">${price.toFixed(2)}</div>
          <p className="text-sm text-gray-500">{sector}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <MetricBadge label="Market Cap" value={marketCap} color="blue" size="sm" />
      </div>

      {onAnalyze && (
        <button
          onClick={onAnalyze}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Analyze Stock
        </button>
      )}
    </div>
  );
}

// GrahamBreakerCard - displays gatekeeper results
export interface GrahamBreakerCardProps {
  passed: boolean;
  peRatio: number;
  interestCoverage: number;
  assetLiabilityRatio: number;
  shareCountChange: number;
  failureReasons?: string[];
}

export function GrahamBreakerCard({
  passed,
  peRatio,
  interestCoverage,
  assetLiabilityRatio,
  shareCountChange,
  failureReasons,
}: GrahamBreakerCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Graham Circuit Breaker</h3>
        <StatusIcon status={passed ? 'pass' : 'fail'} label={passed ? 'PASS' : 'FAIL'} />
      </div>

      {passed ? (
        <div className="grid grid-cols-2 gap-4">
          <MetricBadge label="P/E Ratio" value={peRatio.toFixed(2)} color={peRatio < 35 ? 'green' : 'red'} size="sm" />
          <MetricBadge
            label="Interest Coverage"
            value={interestCoverage.toFixed(2)}
            unit="x"
            color={interestCoverage > 3.0 ? 'green' : 'red'}
            size="sm"
          />
          <MetricBadge
            label="Asset/Liability Ratio"
            value={assetLiabilityRatio.toFixed(2)}
            color={assetLiabilityRatio > 1.5 ? 'green' : 'red'}
            size="sm"
          />
          <MetricBadge
            label="Share Dilution (3yr)"
            value={shareCountChange.toFixed(2)}
            unit="%"
            color={Math.abs(shareCountChange) < 5 ? 'green' : 'red'}
            size="sm"
          />
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="font-semibold text-red-900 mb-2">Failed Criteria:</p>
          <ul className="list-disc list-inside text-sm text-red-800">
            {failureReasons?.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// FVC3ScoreCard - displays composite scoring
export interface FVC3ScoreCardProps {
  compositeScore: number;
  valuationScore: number;
  qualityScore: number;
  momentumScore: number;
  recommendation: 'BUY' | 'HOLD' | 'SELL';
}

export function FVC3ScoreCard({
  compositeScore,
  valuationScore,
  qualityScore,
  momentumScore,
  recommendation,
}: FVC3ScoreCardProps) {
  const recommendationColor = {
    BUY: 'text-green-600 bg-green-50',
    HOLD: 'text-yellow-600 bg-yellow-50',
    SELL: 'text-red-600 bg-red-50',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">FVC 3.0 Score</h3>
        <div className={`px-4 py-2 rounded-lg font-bold ${recommendationColor[recommendation]}`}>
          {recommendation}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-bold text-blue-600 mb-2">{compositeScore.toFixed(1)}/100</div>
        <p className="text-gray-600">Forensic Value Composite Score</p>
      </div>

      <div className="space-y-4">
        <div>
          <ProgressBar value={valuationScore} label="Valuation (40%)" color="blue" />
        </div>
        <div>
          <ProgressBar value={qualityScore} label="Quality (30%)" color="green" />
        </div>
        <div>
          <ProgressBar value={momentumScore} label="Momentum (30%)" color="blue" />
        </div>
      </div>
    </div>
  );
}
