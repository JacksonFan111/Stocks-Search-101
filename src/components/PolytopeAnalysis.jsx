import React, { useEffect, useState } from 'react';
import { getStockQuote, getCompanyProfile } from '../services/finnhubAPI';
import {
  calculateFinancialMetrics,
  calculatePolytopeScore,
  estimateDCFValuation,
  estimateAssetBasedValuation,
  estimateEPV,
  generateBenchmarkComparison,
  generateChartsData
} from '../services/analysisEngine';
import {
  PriceChart,
  ValuationChart,
  RiskScoreChart,
  BenchmarkChart,
  ValuationSummary
} from './Charts';

const PolytopeAnalysis = ({ symbol, onBack }) => {
  const [quote, setQuote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [polytopeScore, setPolytopeScore] = useState(null);
  const [valuations, setValuations] = useState({});
  const [benchmark, setBenchmark] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      setLoading(true);
      setError(null);
      try {
        const [quoteData, profileData] = await Promise.all([
          getStockQuote(symbol),
          getCompanyProfile(symbol)
        ]);

        setQuote(quoteData);
        setProfile(profileData);

        // Calculate metrics
        const calculatedMetrics = calculateFinancialMetrics(quoteData, profileData);
        setMetrics(calculatedMetrics);

        // Calculate Polytope score
        const score = calculatePolytopeScore(calculatedMetrics, quoteData, profileData);
        setPolytopeScore(score);

        // Calculate valuations
        const dcf = estimateDCFValuation(quoteData, profileData, calculatedMetrics);
        const assetBased = estimateAssetBasedValuation(profileData, calculatedMetrics);
        const epv = estimateEPV(calculatedMetrics, quoteData);

        setValuations({ dcf, assetBased, epv });

        // Get benchmark comparison
        const benchmarkData = generateBenchmarkComparison(calculatedMetrics, symbol);
        setBenchmark(benchmarkData);

        // Generate chart data
        const priceHistory = generateChartsData(quoteData);
        setChartData(priceHistory);
      } catch (err) {
        setError('Failed to load stock analysis data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchAndAnalyze();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-500 text-red-700 dark:text-red-300 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!quote || !profile) {
    return <div className="text-gray-500">No data available</div>;
  }

  const recommendation = polytopeScore?.flags?.length >= 3 ? '🔴 DO NOT BUY' : 
                      polytopeScore?.flags?.length >= 1 ? '🟡 HOLD' : '🟢 REVIEW';

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <button
        onClick={onBack}
        className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
      >
        ← Back to Search
      </button>

      {/* Header */}
      <div className="stock-card mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{profile?.name || symbol}</h1>
            <p className="text-xl opacity-90">{symbol} • {profile?.exchange}</p>
            <p className="text-lg mt-2 opacity-80">{profile?.finnhubIndustry}</p>
          </div>
          {profile?.logo && (
            <img src={profile.logo} alt={profile.name} className="w-20 h-20 rounded-lg bg-white p-2" />
          )}
        </div>
        <div className="mt-4 flex items-baseline gap-4">
          <span className="text-5xl font-bold">${quote?.c?.toFixed(2)}</span>
          <span className={`text-2xl font-semibold ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
            {isPositive ? '+' : ''}{priceChange?.toFixed(2)} ({isPositive ? '+' : ''}{percentChange}%)
          </span>
        </div>
      </div>

      {/* Recommendation Banner */}
      <div className={`stock-card mb-6 text-center p-6 rounded-lg font-bold text-2xl ${
        recommendation.includes('DO NOT BUY') ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
        recommendation.includes('HOLD') ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
        'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
      }`}>
        {recommendation}
      </div>

      {/* Risk Score Chart */}
      {polytopeScore && (
        <div className="stock-card mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 Polytope Risk Score
          </h2>
          <RiskScoreChart score={polytopeScore.score} flags={polytopeScore.flags?.length || 0} />
        </div>
      )}

      {/* Valuation Summary Cards */}
      {valuations && (
        <div className="stock-card mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            💰 Valuation Summary
          </h2>
          <ValuationSummary valuations={valuations} currentPrice={quote?.c} />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {chartData && (
          <>
            <div className="stock-card rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">30-Day Price Chart</h3>
              <PriceChart data={chartData} />
            </div>
            <div className="stock-card rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Valuation Methods</h3>
              <ValuationChart valuations={valuations} currentPrice={quote?.c} />
            </div>
          </>
        )}
      </div>

      {/* Benchmark Comparison */}
      {benchmark && (
        <div className="stock-card mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Benchmark vs Market
          </h2>
          <BenchmarkChart benchmark={benchmark} />
        </div>
      )}

      {/* Financial Metrics Table */}
      {metrics && (
        <div className="stock-card mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📈 Financial Metrics
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-3 text-left">Metric</th>
                  <th className="px-4 py-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 font-medium">Market Cap</td>
                  <td className="px-4 py-3 text-right">${(metrics.marketCap / 1000).toFixed(1)}B</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">P/E Ratio</td>
                  <td className="px-4 py-3 text-right">{metrics.peRatio?.toFixed(2) || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">P/B Ratio</td>
                  <td className="px-4 py-3 text-right">{metrics.pbRatio?.toFixed(2) || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Daily Change</td>
                  <td className={`px-4 py-3 text-right font-semibold ${
                    metrics.percentChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metrics.percentChange >= 0 ? '+' : ''}{metrics.percentChange?.toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">52-Week Range</td>
                  <td className="px-4 py-3 text-right">${metrics.fiftyTwoWeekHigh?.toFixed(2)} / ${metrics.fiftyTwoWeekLow?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Polytope Flags */}
      {polytopeScore?.flags && polytopeScore.flags.length > 0 && (
        <div className="stock-card mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🚩 Red Flags ({polytopeScore.flags.length})
          </h2>
          <div className="space-y-3">
            {polytopeScore.flags.map((flag, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                flag.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/30' :
                'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30'
              }`}>
                <h4 className="font-bold text-gray-900 dark:text-white">{flag.category}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Info */}
      <div className="stock-card rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Company Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.finnhubIndustry || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.country || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">IPO Date</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.ipo || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">${(metrics?.marketCap / 1000).toFixed(2)}B</p>
          </div>
        </div>
        {profile?.weburl && (
          <div className="mt-6">
            <a
              href={profile.weburl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Visit Company Website →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolytopeAnalysis;
