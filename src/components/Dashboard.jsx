import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  sampleStocks,
  generateSampleChartData,
  generateSampleValuations,
  generateSampleMetrics,
  generateSampleRiskScore,
  generateSampleBenchmark
} from '../services/sampleData';

const Dashboard = ({ onSelectStock }) => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  
  const chartData = generateSampleChartData(selectedSymbol);
  const valuations = generateSampleValuations(selectedSymbol);
  const metrics = generateSampleMetrics(selectedSymbol);
  const riskScore = generateSampleRiskScore(selectedSymbol);
  const benchmark = generateSampleBenchmark(selectedSymbol);

  const valuationChartData = [
    { name: 'DCF', value: valuations.dcf },
    { name: 'Asset-Based', value: valuations.asset },
    { name: 'EPV', value: valuations.epv },
    { name: 'Current', value: selectedSymbol === 'AAPL' ? 230 : selectedSymbol === 'MSFT' ? 425 : 200 }
  ];

  const benchmarkChartData = [
    { name: 'P/E Ratio', stock: benchmark.stockPE, market: benchmark.marketPE },
    { name: 'P/B Ratio', stock: benchmark.stockPB, market: benchmark.marketPB }
  ];

  const riskColors = {
    0: '#22C55E',
    1: '#22C55E',
    2: '#84CC16',
    3: '#FBBF24',
    4: '#FB923C',
    5: '#EF4444',
    6: '#DC2626',
    7: '#7F1D1D',
    8: '#7F1D1D',
    9: '#7F1D1D',
    10: '#7F1D1D'
  };

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Analysis Dashboard</h1>
          <p className="text-gray-400">Real-time stock analysis with comprehensive visualizations</p>
        </div>

        {/* Quick Stock Selector */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {sampleStocks.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => setSelectedSymbol(stock.symbol)}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                selectedSymbol === stock.symbol
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {stock.symbol}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Price Chart */}
          <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">30-Day Price Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="ma20" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Score Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Risk Score</h3>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Risk', value: riskScore.score },
                      { name: 'Safety', value: 10 - riskScore.score }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    <Cell fill={riskColors[riskScore.score]} />
                    <Cell fill="#374151" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <div className="text-4xl font-bold text-white">{riskScore.score}</div>
                <div className="text-gray-400 text-sm">/ 10</div>
                <div className="text-xs text-gray-500 mt-2">
                  {riskScore.flags} flag{riskScore.flags !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Valuation Methods */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Valuation Methods</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={valuationChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Bar dataKey="value" fill="#06B6D4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Benchmark Comparison */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">vs Market Benchmark</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={benchmarkChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="stock" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="market" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">P/E Ratio</p>
            <p className="text-3xl font-bold text-blue-400">{metrics.peRatio.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">vs Market: 18.5</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-800/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">P/B Ratio</p>
            <p className="text-3xl font-bold text-purple-400">{metrics.pbRatio.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">vs Market: 2.8</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Market Cap</p>
            <p className="text-3xl font-bold text-green-400">${metrics.marketCap}B</p>
            <p className="text-xs text-gray-500 mt-2">Trillion USD</p>
          </div>
          <div className={`bg-gradient-to-br ${metrics.percentChange >= 0 ? 'from-green-900/20 to-green-800/10 border-green-800/30' : 'from-red-900/20 to-red-800/10 border-red-800/30'} border rounded-xl p-6`}>
            <p className="text-gray-400 text-sm mb-2">Daily Change</p>
            <p className={`text-3xl font-bold ${metrics.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics.percentChange >= 0 ? '+' : ''}{metrics.percentChange.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 mt-2">24 Hour</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-gray-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready for Full Analysis?</h2>
          <p className="text-gray-400 mb-6">Access comprehensive forensic analysis, red flag detection, and expert insights</p>
          <button
            onClick={() => onSelectStock({ symbol: selectedSymbol })}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            Deep Dive Analysis →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
