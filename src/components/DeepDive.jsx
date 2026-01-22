import React, { useEffect, useState } from 'react';
import { getStockQuote, getCompanyProfile } from '../services/finnhubAPI';import { getCachedAnalysis } from '../services/analysisCache';import {
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

const DeepDive = ({ symbol: symbolProp, onBack, onAddToWatchlist }) => {
  // Extract symbol string from prop (could be string or object with symbol property)
  const symbol = typeof symbolProp === 'string' ? symbolProp : symbolProp?.symbol;
  
  const [quote, setQuote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [polytopeScore, setPolytopeScore] = useState(null);
  const [valuations, setValuations] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) {
      setError('No symbol provided');
      setLoading(false);
      return;
    }
    
    const fetchAndAnalyze = async () => {
      // Check cache first for instant display
      const cached = getCachedAnalysis(symbol);
      
      if (cached) {
        // Instant load from cache
        setQuote(cached.quote);
        setProfile(cached.profile);
        setMetrics(cached.metrics);
        setPolytopeScore(cached.polytopeScore);
        setValuations(cached.valuations);
        setBenchmark(cached.benchmark);
        setChartData(cached.chartData);
        setLoading(false);
        return;
      }
      
      // Fallback: fetch and calculate if not cached
      setLoading(true);
      setError(null);
      try {
        const [quoteData, profileData] = await Promise.all([
          getStockQuote(symbol),
          getCompanyProfile(symbol)
        ]);

        setQuote(quoteData);
        setProfile(profileData);

        const calculatedMetrics = calculateFinancialMetrics(quoteData, profileData);
        setMetrics(calculatedMetrics);

        const score = calculatePolytopeScore(calculatedMetrics, quoteData, profileData);
        setPolytopeScore(score);

        const dcf = estimateDCFValuation(quoteData, profileData, calculatedMetrics);
        const assetBased = estimateAssetBasedValuation(profileData, calculatedMetrics);
        const epv = estimateEPV(calculatedMetrics, quoteData);
        setValuations({ dcf, assetBased, epv });

        const benchmarkData = generateBenchmarkComparison(calculatedMetrics, symbol);
        setBenchmark(benchmarkData);

        const priceHistory = generateChartsData(quoteData);
        setChartData(priceHistory);
      } catch (err) {
        console.error('Error in Deep Dive:', err);
        setError('Failed to load analysis data. Please try another stock.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyze();
  }, [symbol]);

  if (loading) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 text-center py-20">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Loading analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quote || !profile) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={onBack}
            className="mb-6 text-blue-400 hover:text-blue-300 font-semibold"
          >
            ← Back
          </button>
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-8 text-center">
            <p className="text-red-400">{error || 'No data available'}</p>
          </div>
        </div>
      </div>
    );
  }

  const isPositive = quote.c >= quote.pc;
  const priceChange = quote.c - quote.pc;
  const percentChange = ((priceChange / quote.pc) * 100).toFixed(2);

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2"
        >
          ← Back to Results
        </button>

        {/* Compact Header with Price */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">{profile?.name || symbol}</h1>
                <p className="text-gray-400 text-sm">{symbol} • {profile?.exchange} • {profile?.finnhubIndustry}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-3 justify-end">
                <span className="text-4xl font-bold text-white">${quote.c.toFixed(2)}</span>
                <span className={`text-xl font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)} ({isPositive ? '+' : ''}{percentChange}%)
                </span>
              </div>
              <button
                onClick={onAddToWatchlist}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg text-white font-semibold text-sm hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
              >
                ⭐ Watchlist
              </button>
            </div>
          </div>
        </div>

        {/* CHARTS SECTION - FIRST & PROMINENT */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Large Price Chart - Takes up 2 columns */}
          {chartData && (
            <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">📈 30-Day Price History</h3>
              <PriceChart data={chartData} symbol={symbol} />
            </div>
          )}
          
          {/* Risk Score - Sidebar */}
          {polytopeScore && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">🎯 Risk Score</h2>
              <RiskScoreChart score={polytopeScore.score} maxScore={10} />
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm">Flags: <span className="text-white font-bold">{polytopeScore.flags?.length || 0}</span></p>
                <p className="text-gray-400 text-sm mt-2">Level: <span className={`font-bold ${polytopeScore.score >= 6 ? 'text-red-400' : polytopeScore.score >= 3 ? 'text-yellow-400' : 'text-green-400'}`}>{polytopeScore.score >= 6 ? 'HIGH' : polytopeScore.score >= 3 ? 'MEDIUM' : 'LOW'}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Valuation Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {chartData && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">💰 Valuation Models</h3>
              <ValuationChart dcf={valuations?.dcf} assetBased={valuations?.assetBased} epv={valuations?.epv} currentPrice={quote?.c} />
            </div>
          )}
          
          {benchmark && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">📊 P/E vs Market</h3>
              <BenchmarkChart peComparison={benchmark.peComparison} pbComparison={benchmark.pbComparison} />
            </div>
          )}
        </div>

        {/* Valuation Summary */}
        {valuations && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">💵 Valuation Analysis</h2>
            <ValuationSummary dcf={valuations?.dcf} assetBased={valuations?.assetBased} epv={valuations?.epv} />
          </div>
        )}

        {/* Metrics Table */}
        {metrics && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">📋 Key Metrics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Market Cap</p>
                <p className="text-white text-2xl font-bold">${(metrics.marketCap / 1000).toFixed(1)}B</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">P/E Ratio</p>
                <p className="text-white text-2xl font-bold">{metrics.peRatio?.toFixed(1) || 'N/A'}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">P/B Ratio</p>
                <p className="text-white text-2xl font-bold">{metrics.pbRatio?.toFixed(1) || 'N/A'}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Volume (M)</p>
                <p className="text-white text-2xl font-bold">{(metrics.volume / 1000000).toFixed(1)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Red Flags */}
        {polytopeScore?.flags && polytopeScore.flags.length > 0 && (
          <div className="bg-red-900/20 border border-red-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-400 mb-6">🚩 Risk Flags ({polytopeScore.flags.length})</h2>
            <div className="space-y-3">
              {polytopeScore.flags.map((flag, idx) => (
                <div key={idx} className="bg-red-900/30 border-l-4 border-red-500 px-6 py-3 rounded">
                  <h4 className="font-bold text-red-300">{flag.category}</h4>
                  <p className="text-red-200 text-sm">{flag.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepDive;
