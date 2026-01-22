import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Autofocus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const suggestions = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'META', 'NVDA'];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              placeholder="Search stocks (e.g., AAPL, TSLA, GOOGL)..."
              className="input-field pr-10"
              disabled={loading}
              autoComplete="off"
              aria-label="Search stocks"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[120px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⟳</span> Searching...
              </span>
            ) : (
              'Search 🔍'
            )}
          </button>
        </div>
      </form>
      {!query && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-400">Quick search:</span>
          {suggestions.map((sym) => (
            <button
              key={sym}
              onClick={() => {
                setQuery(sym);
                onSearch(sym);
              }}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-all text-sm"
            >
              {sym}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
