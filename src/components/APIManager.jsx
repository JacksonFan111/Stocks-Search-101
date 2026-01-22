import React, { useState } from 'react';
import { apiConfiguration, getImplementedAPIs, getRecommendedAPIs } from '../services/apiConfig';

const APIManager = () => {
  const [activeTab, setActiveTab] = useState('implemented');
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const implementedAPIs = getImplementedAPIs();
  const recommendedAPIs = getRecommendedAPIs();

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">🔌 API Configuration</h1>
          <p className="text-gray-400">Manage data sources and API integrations</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('implemented')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'implemented'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            ✅ Active APIs ({implementedAPIs.length})
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'recommended'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🚀 Recommended ({recommendedAPIs.length})
          </button>
        </div>

        {/* Implemented APIs */}
        {activeTab === 'implemented' && (
          <div className="space-y-6">
            {implementedAPIs.map(({ key, ...api }) => (
              <div
                key={key}
                className="bg-gray-900/50 border border-green-800/30 rounded-2xl p-8 hover:border-green-700/50 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{api.name}</h3>
                    <p className="text-green-400 text-sm font-semibold">✓ Active</p>
                  </div>
                  <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-semibold">
                    {api.endpoints} Endpoints
                  </span>
                </div>

                {/* Type Badge */}
                <p className="text-gray-400 text-sm mb-6 bg-gray-800/50 w-fit px-3 py-1 rounded">
                  {api.type}
                </p>

                {/* Features Grid */}
                <div className="mb-6">
                  <p className="text-gray-300 font-semibold mb-3">Features</p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {api.features.map((feature, i) => (
                      <div
                        key={i}
                        className="bg-green-900/10 border border-green-800/30 rounded px-3 py-2 text-sm text-green-300"
                      >
                        ✓ {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Docs */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Pricing</p>
                    <p className="text-white font-semibold">{api.pricing}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">API Key</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-gray-900 text-green-400 text-xs px-2 py-1 rounded truncate font-mono">
                        {api.apiKey}
                      </code>
                      <button
                        onClick={() => copyToClipboard(api.apiKey, `${key}-key`)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-500 transition"
                      >
                        {copied === `${key}-key` ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Link */}
                <div className="mt-4">
                  <a
                    href={api.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-2"
                  >
                    📚 View Documentation →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommended APIs */}
        {activeTab === 'recommended' && (
          <div className="space-y-6">
            {recommendedAPIs.map(([key, api]) => (
              <div
                key={key}
                className="bg-gray-900/50 border border-purple-800/30 rounded-2xl p-8 hover:border-purple-700/50 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{api.name}</h3>
                    <p className="text-purple-400 text-sm font-semibold">🚀 Recommended for Integration</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-sm font-semibold">
                    {api.endpoints} Endpoints
                  </span>
                </div>

                {/* Type Badge */}
                <p className="text-gray-400 text-sm mb-6 bg-gray-800/50 w-fit px-3 py-1 rounded">
                  {api.type}
                </p>

                {/* Features Grid */}
                <div className="mb-6">
                  <p className="text-gray-300 font-semibold mb-3">Features</p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {api.features.map((feature, i) => (
                      <div
                        key={i}
                        className="bg-purple-900/10 border border-purple-800/30 rounded px-3 py-2 text-sm text-purple-300"
                      >
                        ◆ {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Notes */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Pricing</p>
                    <p className="text-white font-semibold">{api.pricing}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Integration Status</p>
                    <p className="text-yellow-400 font-semibold">{api.notes}</p>
                  </div>
                </div>

                {/* Link */}
                <div className="flex gap-4">
                  <a
                    href={api.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-2"
                  >
                    📚 Documentation →
                  </a>
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center gap-2">
                    🔗 Queue for Implementation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-gray-800">
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Active Data Sources</p>
            <p className="text-4xl font-bold text-green-400">{implementedAPIs.length}</p>
            <p className="text-xs text-gray-500 mt-2">APIs actively integrated</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Total Endpoints</p>
            <p className="text-4xl font-bold text-blue-400">
              {implementedAPIs.reduce((acc, api) => acc + api.endpoints, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">Available endpoints</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-800/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Data Coverage</p>
            <p className="text-4xl font-bold text-purple-400">99%</p>
            <p className="text-xs text-gray-500 mt-2">Market data coverage</p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-gray-800 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">🚀 Getting Started</h2>
          <div className="space-y-3 text-gray-300">
            <p>✓ <span className="font-semibold">Finnhub</span> - Your primary real-time stock data source</p>
            <p>✓ <span className="font-semibold">Yahoo Finance</span> - Free trending stocks & market data</p>
            <p>✓ <span className="font-semibold">Alpha Vantage</span> - Technical analysis & time series</p>
            <p>✓ <span className="font-semibold">Financial Modeling Prep</span> - Financial statements & ratios</p>
            <p className="text-yellow-400 font-semibold mt-4">Next: Add IEX Cloud for even more comprehensive coverage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIManager;
