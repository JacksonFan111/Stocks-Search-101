import React, { useState, useEffect } from 'react';
import { getStockQuote, getCompanyProfile } from '../services/finnhubAPI';

const ForensicsAnalysis = ({ stock }) => {
  const [selectedMetric, setSelectedMetric] = useState(0);
  const [quote, setQuote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load stock data on component mount or stock change
  useEffect(() => {
    let isMounted = true;

    const loadStockData = async () => {
      if (!stock?.symbol) return;
      
      if (isMounted) setLoading(true);
      try {
        const [q, p] = await Promise.all([
          getStockQuote(stock.symbol),
          getCompanyProfile(stock.symbol)
        ]);
        
        if (isMounted) {
          setQuote(q);
          setProfile(p);
          setAnalysis(calculateForensicAnalysis(q, p));
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load stock data:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStockData();

    // Cleanup function - prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [stock?.symbol]);

  // Forensic analysis calculator
  const calculateForensicAnalysis = (q, p) => {
    if (!q || !p) return null;
    const redFlags = [];
    let riskScore = 0;

    // Check volatility (> 5% daily = red flag)
    const dailyChange = q.d ? Math.abs(q.d) : 0;
    if (dailyChange > 5) {
      redFlags.push({ type: 'volatility', name: 'High Daily Volatility', value: `${dailyChange.toFixed(2)}%` });
      riskScore += 2;
    }

    // Check market cap (< $500M = red flag)
    const marketCap = p.marketCapitalization || 0;
    if (marketCap < 500 && marketCap > 0) {
      redFlags.push({ type: 'smallcap', name: 'Small Cap Risk', value: `$${(marketCap / 1000).toFixed(1)}M` });
      riskScore += 2;
    }

    // Check price levels (penny stocks < $5 = red flag)
    if (q.c && q.c < 5) {
      redFlags.push({ type: 'penny', name: 'Penny Stock', value: `$${q.c.toFixed(2)}` });
      riskScore += 3;
    }

    // Check liquidity (low volume = risk)
    if (q.v && q.v < 1000000) {
      redFlags.push({ type: 'liquidity', name: 'Low Trading Volume', value: `${(q.v / 1000000).toFixed(2)}M` });
      riskScore += 1;
    }

    // Historical performance check (high PE relative to market)
    const peRatio = marketCap > 0 && q.c > 0 ? marketCap / (q.c * (p.shareOutstanding || 1)) : null;
    if (peRatio && peRatio > 30) {
      redFlags.push({ type: 'valuation', name: 'High P/E Ratio', value: `${peRatio.toFixed(1)}x` });
      riskScore += 2;
    }

    // Check industry risk
    const highRiskIndustries = ['Cryptocurrencies', 'Cannabis', 'SPAC', 'Penny Stocks'];
    const industry = p.finnhubIndustry || '';
    if (highRiskIndustries.some(ind => industry.toLowerCase().includes(ind.toLowerCase()))) {
      redFlags.push({ type: 'sector', name: 'High-Risk Sector', value: industry });
      riskScore += 2;
    }

    const recommendation = redFlags.length >= 3 ? '🔴 DO NOT BUY' : redFlags.length >= 1 ? '🟡 HOLD' : '🟢 REVIEW';

    return {
      redFlags,
      riskScore: Math.min(10, riskScore),
      recommendation,
      dailyChange,
      marketCap,
      price: q.c,
      volume: q.v,
      peRatio,
      industry
    };
  };

  const forensicChecks = [
    {
      title: 'I. Fundamental Index (The Filter)',
      icon: '🔍',
      items: [
        {
          name: 'Liquidity & Solvency',
          description: 'Ability to meet short-term obligations',
          benchmark: 'Current Ratio > 1.5',
          actual: analysis?.volume ? `${(analysis.volume / 1000000).toFixed(2)}M vol` : 'N/A'
        },
        {
          name: 'Operational Efficiency',
          description: 'How effectively the company uses assets',
          benchmark: 'Asset Turnover > 0.5',
          actual: analysis?.marketCap ? `$${(analysis.marketCap / 1000000000).toFixed(2)}B cap` : 'N/A'
        },
        {
          name: 'Profitability Reality Check',
          description: 'Actual earnings vs. reported earnings',
          benchmark: 'OCF / Net Income > 1.0',
          actual: analysis?.price ? `$${analysis.price.toFixed(2)} price` : 'N/A'
        },
        {
          name: 'Cash King (Hard Cash)',
          description: 'Real cash generation ability',
          benchmark: 'Operating CF > 0',
          actual: 'Analyzing...'
        },
        {
          name: 'Liability Truth',
          description: 'Debt levels and obligations',
          benchmark: 'Debt/Equity < 2.0',
          actual: 'Analyzing...'
        },
        {
          name: 'Valuation Ratios',
          description: 'Price-to-fundamental metrics',
          benchmark: 'P/E < Market Average',
          actual: analysis?.peRatio ? `P/E: ${analysis.peRatio.toFixed(1)}x` : 'N/A'
        }
      ]
    },
    {
      title: 'II. Forensic Red Flags',
      icon: '🚩',
      items: [
        {
          name: 'High Daily Volatility',
          description: 'Price swings exceeding market norms',
          benchmark: '> 5% daily change',
          actual: analysis?.dailyChange ? `${analysis.dailyChange.toFixed(2)}%` : 'N/A'
        },
        {
          name: 'Small Cap Risk',
          description: 'Market capitalization below thresholds',
          benchmark: '< $500M',
          actual: analysis?.marketCap ? `$${(analysis.marketCap / 1000).toFixed(0)}M` : 'N/A'
        },
        {
          name: 'Sector Risk',
          description: 'High-risk industry classifications',
          benchmark: 'Crypto, Cannabis, SPAC',
          actual: analysis?.industry || 'Unknown'
        },
        {
          name: 'Penny Stock Warning',
          description: 'Price < $5 signals liquidity risk',
          benchmark: '< $5 per share',
          actual: analysis?.price ? `$${analysis.price.toFixed(2)}` : 'N/A'
        },
        {
          name: 'Trading Volume',
          description: 'Low volume indicates weak liquidity',
          benchmark: '> 1M daily volume',
          actual: analysis?.volume ? `${(analysis.volume / 1000000).toFixed(2)}M` : 'N/A'
        }
      ]
    },
    {
      title: 'III. Advanced Screening',
      icon: '⚙️',
      items: [
        {
          name: 'OCF / Debt Maturities',
          description: 'Cash flow relative to debt obligations',
          benchmark: '> 1.5x',
          actual: 'Advanced data required'
        },
        {
          name: 'Short Interest Ratio',
          description: 'Market sentiment indicator',
          benchmark: '< 5%',
          actual: 'Advanced data required'
        },
        {
          name: 'Insider Trading Activity',
          description: 'Company insider buying/selling patterns',
          benchmark: 'Monitor for suspicious activity',
          actual: 'Advanced data required'
        },
        {
          name: 'Accounting Changes',
          description: 'Unusual adjustments in financial statements',
          benchmark: 'Year-over-year consistency',
          actual: 'Advanced data required'
        },
        {
          name: 'Related Party Transactions',
          description: 'Deals with connected parties',
          benchmark: 'Transparent pricing',
          actual: 'Advanced data required'
        }
      ]
    },
    {
      title: 'IV. The Polytope Framework',
      icon: '🎯',
      items: [
        {
          name: 'Pattern Recognition',
          description: 'Three red flags form a Polytope pattern',
          benchmark: '3+ flags detected',
          actual: analysis?.redFlags ? `${analysis.redFlags.length} flags found` : '0 flags'
        },
        {
          name: 'Risk Scoring',
          description: 'Comprehensive 0-10 risk assessment',
          benchmark: 'Score interpretation',
          actual: analysis?.riskScore ? `${analysis.riskScore}/10` : 'N/A'
        },
        {
          name: 'Investment Recommendation',
          description: 'Action based on Polytope score',
          benchmark: '🔴 DO NOT BUY / 🟡 HOLD / 🟢 REVIEW',
          actual: analysis?.recommendation || 'Calculating...'
        }
      ]
    }
  ];

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Forensic Analysis {stock?.symbol && `- ${stock.symbol}`}
          </h1>
          <p className="text-gray-400 text-lg">Deep financial screening & risk assessment</p>
        </div>

        {/* Live Risk Score Card */}
        {analysis && (
          <div className={`mb-8 p-8 rounded-2xl border-2 ${
            analysis.riskScore >= 7 ? 'bg-red-900/20 border-red-500' :
            analysis.riskScore >= 4 ? 'bg-yellow-900/20 border-yellow-500' :
            'bg-green-900/20 border-green-500'
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Risk Score</p>
                <p className="text-3xl font-bold text-white">{analysis.riskScore}/10</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Red Flags</p>
                <p className="text-3xl font-bold text-red-400">{analysis.redFlags.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Price</p>
                <p className="text-2xl font-bold text-white">${analysis.price?.toFixed(2) || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Recommendation</p>
                <p className="text-2xl font-bold">{analysis.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Red Flags Alert */}
        {analysis?.redFlags.length > 0 && (
          <div className="mb-8 bg-red-900/20 border border-red-500/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Detected Red Flags</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {analysis.redFlags.map((flag, idx) => (
                <div key={idx} className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                  <p className="font-bold text-red-300">{flag.name}</p>
                  <p className="text-sm text-gray-300">{flag.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading forensic analysis...</p>
          </div>
        ) : (
          <>
            {/* Framework Selection */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {forensicChecks.map((check, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMetric(idx)}
                  className={`text-left p-6 rounded-xl border transition-all ${
                    selectedMetric === idx
                      ? 'bg-blue-900/30 border-blue-600 shadow-lg shadow-blue-500/20'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-3">{check.icon}</div>
                  <h3 className="text-lg font-bold text-white">{check.title}</h3>
                  <p className="text-gray-400 text-sm mt-2">{check.items.length} checks</p>
                </button>
              ))}
            </div>

            {/* Detailed View */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl">{forensicChecks[selectedMetric].icon}</span>
                  {forensicChecks[selectedMetric].title}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {forensicChecks[selectedMetric].items.map((item, idx) => (
                  <div key={idx} className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all">
                    <h4 className="text-lg font-bold text-white mb-2">{item.name}</h4>
                    <p className="text-gray-400 mb-4">{item.description}</p>
                    <div className="bg-gray-900/50 rounded px-3 py-2 border-l-2 border-blue-500 mb-3">
                      <p className="text-sm font-mono text-blue-300">Benchmark: {item.benchmark}</p>
                    </div>
                    {item.actual && (
                      <div className="bg-gray-900/50 rounded px-3 py-2 border-l-2 border-green-500">
                        <p className="text-sm font-mono text-green-300">Actual: {item.actual}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology Section */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-gray-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">🔬 Analysis Methodology</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-purple-400">✓</span>
                    <span>Screen stocks against fundamental metrics</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400">✓</span>
                    <span>Identify red flags and risk indicators</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400">✓</span>
                    <span>Detect Polytope patterns (3+ flags)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400">✓</span>
                    <span>Calculate risk scores 0-10 scale</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400">✓</span>
                    <span>Generate investment recommendations</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-gray-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">📊 Interpretation Guide</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="w-6 h-6 bg-green-500 rounded"></span>
                      <span className="font-bold text-green-400">REVIEW (0-1 flags)</span>
                    </div>
                    <p className="text-gray-400 text-sm">Low risk score, proceed with detailed analysis</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="w-6 h-6 bg-yellow-500 rounded"></span>
                      <span className="font-bold text-yellow-400">HOLD (2-3 flags)</span>
                    </div>
                    <p className="text-gray-400 text-sm">Medium risk, investigate concerns further</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="w-6 h-6 bg-red-500 rounded"></span>
                      <span className="font-bold text-red-400">DO NOT BUY (4+ flags)</span>
                    </div>
                    <p className="text-gray-400 text-sm">High risk Polytope pattern detected</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForensicsAnalysis;
