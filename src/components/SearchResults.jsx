import React, { useState } from 'react';

const SearchResults = ({ results, onSelectStock, onAddToWatchlist, loading }) => {
  const [hoveredStock, setHoveredStock] = useState(null);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto mb-8">
        <div className="h-8 bg-gray-800 rounded w-48 mb-4 animate-pulse"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-3 animate-pulse">
            <div className="h-6 bg-gray-800 rounded w-24 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-64 mb-2"></div>
            <div className="h-3 bg-gray-800 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          Search Results ({results.length})
        </h2>
        <span className="text-sm text-gray-400">Click any stock for analysis</span>
      </div>
      <div className="grid gap-3">
        {results.map((stock) => (
          <div
            key={stock.symbol}
            className="stock-card group hover:scale-[1.01] transition-all"
            onMouseEnter={() => setHoveredStock(stock.symbol)}
            onMouseLeave={() => setHoveredStock(null)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 cursor-pointer" onClick={() => onSelectStock(stock.symbol)}>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-blue-400 group-hover:text-blue-300">
                    {stock.symbol}
                  </h3>
                  <span className="text-xs bg-blue-900/50 border border-blue-700 text-blue-300 px-2 py-1 rounded">
                    {stock.displaySymbol}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mt-2">
                  {stock.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stock.type}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                {onAddToWatchlist && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWatchlist(stock);
                    }}
                    className="px-3 py-2 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-600/30 transition-all text-sm font-medium opacity-0 group-hover:opacity-100"
                    title="Add to Watchlist"
                    aria-label="Add to watchlist"
                  >
                    ⭐
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStock(stock.symbol);
                  }}
                  className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-all text-sm font-medium"
                  aria-label="Analyze stock"
                >
                  Analyze →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
