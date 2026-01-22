import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { sampleStocks, generateSampleChartData, generateSampleMetrics } from '../services/sampleData';

const Sidebar = ({ onSelectStock }) => {
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [marketStats, setMarketStats] = useState({
    marketMood: 'Bullish',
    topGainer: { symbol: 'NVDA', change: 5.28 },
    topLoser: { symbol: 'META', change: -2.15 },
    avgVolume: '2.3B',
    volatility: 'Moderate'
  });
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    // Load sample trending stocks
    setTrendingStocks(sampleStocks.slice(0, 5));
  }, []);

  const getChartData = (symbol) => {
    return generateSampleChartData(symbol).slice(-7);
  };

  return (
    <div className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-80 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 overflow-y-auto z-40">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900/90 backdrop-blur border-b border-gray-800 p-4 z-50">
        <h2 className="text-lg font-bold text-white mb-4">📊 Analytics</h2>
        
        {/* Tab Navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'trending'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            🔥 Trending
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'market'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            🌍 Market
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Top Performing Stocks</h3>
            {trendingStocks.map((stock) => {
              const metrics = generateSampleMetrics(stock.symbol);
              const chartData = getChartData(stock.symbol);
              const isUp = metrics.percentChange >= 0;

              return (
                <div
                  key={stock.symbol}
                  onClick={() => onSelectStock(stock)}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:bg-gray-800 hover:border-blue-600 cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{stock.symbol}</p>
                      <p className="text-xs text-gray-400">{stock.name}</p>
                    </div>
                    <div className={`text-sm font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                      {isUp ? '+' : ''}{metrics.percentChange.toFixed(2)}%
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-12 -mx-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id={`grad-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isUp ? '#10B981' : '#EF4444'} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={isUp ? '#10B981' : '#EF4444'} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={isUp ? '#10B981' : '#EF4444'}
                          fill={`url(#grad-${stock.symbol})`}
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex gap-2 mt-2 text-xs">
                    <div className="flex-1 bg-gray-700/50 rounded px-2 py-1">
                      <p className="text-gray-400">P/E</p>
                      <p className="text-blue-400 font-semibold">{metrics.peRatio.toFixed(1)}</p>
                    </div>
                    <div className="flex-1 bg-gray-700/50 rounded px-2 py-1">
                      <p className="text-gray-400">Cap</p>
                      <p className="text-purple-400 font-semibold">${metrics.marketCap}B</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Market Tab */}
        {activeTab === 'market' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300">Market Overview</h3>

            {/* Market Mood */}
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Market Sentiment</p>
              <p className="text-lg font-bold text-green-400">{marketStats.marketMood}</p>
              <p className="text-xs text-gray-500 mt-1">Strong buying interest</p>
            </div>

            {/* Top Gainer */}
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Top Gainer</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-blue-400">{marketStats.topGainer.symbol}</p>
                <p className="text-green-400 font-bold">+{marketStats.topGainer.change}%</p>
              </div>
              <div className="mt-2 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateSampleChartData(marketStats.topGainer.symbol).slice(-5)}>
                    <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Loser */}
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Top Loser</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-red-400">{marketStats.topLoser.symbol}</p>
                <p className="text-red-400 font-bold">{marketStats.topLoser.change}%</p>
              </div>
              <div className="mt-2 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateSampleChartData(marketStats.topLoser.symbol).slice(-5)}>
                    <Line type="monotone" dataKey="price" stroke="#EF4444" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Market Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Avg Volume</p>
                <p className="text-sm font-bold text-white">{marketStats.avgVolume}</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Volatility</p>
                <p className="text-sm font-bold text-yellow-400">{marketStats.volatility}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">S&P 500</span>
                <span className="text-green-400 font-bold">+0.84%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">NASDAQ</span>
                <span className="text-green-400 font-bold">+1.23%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Dow Jones</span>
                <span className="text-green-400 font-bold">+0.45%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Crypto (BTC)</span>
                <span className="text-red-400 font-bold">-1.50%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="sticky bottom-0 bg-gradient-to-t from-gray-900 to-gray-900/0 p-4">
        <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
          📈 View All Analysis
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
