import React, { useState } from 'react';

const WatchList = ({ watchlist, onSelectStock, onRemove }) => {
  const [sortBy, setSortBy] = useState('symbol');

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (sortBy === 'symbol') return a.symbol.localeCompare(b.symbol);
    return a.symbol.localeCompare(b.symbol);
  });

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-gray-400">Track and monitor your stocks</p>
        </div>

        {watchlist.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-white mb-2">No stocks in watchlist</h2>
            <p className="text-gray-400 mb-6">Add stocks to your watchlist to keep track of them</p>
          </div>
        ) : (
          <>
            {/* Sort Options */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="symbol">Symbol</option>
                <option value="name">Name</option>
              </select>
              <span className="ml-auto text-gray-400">{watchlist.length} stocks</span>
            </div>

            {/* Table */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Symbol</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Exchange</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {sortedWatchlist.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-white">{stock.symbol}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-300">{stock.description}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400">{stock.displaySymbol}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 text-sm">{stock.type || 'Stock'}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => onSelectStock(stock)}
                              className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-all text-sm font-medium"
                            >
                              Analyze
                            </button>
                            <button
                              onClick={() => onRemove(stock.symbol)}
                              className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-all text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export Data */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  const csv = [
                    ['Symbol', 'Name', 'Exchange', 'Type'],
                    ...watchlist.map(s => [s.symbol, s.description, s.displaySymbol, s.type || 'Stock'])
                  ].map(row => row.join(',')).join('\n');
                  
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'watchlist.csv';
                  a.click();
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all"
              >
                📥 Export as CSV
              </button>
              <button
                onClick={() => {
                  const json = JSON.stringify(watchlist, null, 2);
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'watchlist.json';
                  a.click();
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                📥 Export as JSON
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WatchList;
