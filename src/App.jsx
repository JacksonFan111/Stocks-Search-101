import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import WatchList from './components/WatchList';
import DeepDive from './components/DeepDive';
import ForensicsAnalysis from './components/ForensicsAnalysis';
import APIManager from './components/APIManager';
import About from './components/About';
import { searchStocks } from './services/finnhubAPI';
import { preloadAnalysis } from './services/analysisCache';
import './index.css';

function App() {
  // Pre-load all analysis in background on mount
  useEffect(() => {
    preloadAnalysis();
  }, []);
  const [results, setResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchStocks(query);
      const filteredResults = data.result
        ?.filter(stock => 
          stock.type === 'Common Stock' && 
          ['US', 'NASDAQ', 'NYSE', 'AMEX'].some(ex => stock.displaySymbol.includes(ex) || stock.symbol.length <= 5)
        )
        .slice(0, 20) || [];
      
      setResults(filteredResults);
      setCurrentView('results');
      
      if (filteredResults.length === 0) {
        setError('No stocks found. Try searching for symbols like AAPL, TSLA, or GOOGL.');
      }
    } catch (err) {
      setError('Failed to search stocks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStock = (symbolOrStock) => {
    // Handle both symbol string and stock object
    let stock;
    if (typeof symbolOrStock === 'string') {
      // Find stock from results or create minimal object
      stock = results.find(s => s.symbol === symbolOrStock) || { symbol: symbolOrStock };
    } else {
      stock = symbolOrStock;
    }
    setSelectedStock(stock);
    setCurrentView('deepdive');
  };

  const addToWatchlist = (stock) => {
    if (!watchlist.find(s => s.symbol === stock.symbol)) {
      setWatchlist([...watchlist, stock]);
      showToast(`${stock.symbol} added to watchlist ⭐`, 'success');
    } else {
      showToast(`${stock.symbol} already in watchlist`, 'info');
    }
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(s => s.symbol !== symbol));
  };

  const handleBack = () => {
    setCurrentView('results');
    setSelectedStock(null);
  };

  const handleNavigate = (view, stock = null) => {
    if (stock) {
      setSelectedStock(stock);
      setCurrentView('deepdive');
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black pointer-events-none" />
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 animate-slide-in-right">
          <div className={`px-6 py-3 rounded-lg shadow-lg border ${
            toast.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-200' :
            toast.type === 'info' ? 'bg-blue-900/90 border-blue-700 text-blue-200' :
            'bg-red-900/90 border-red-700 text-red-200'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
      
      <Navigation currentView={currentView} setCurrentView={setCurrentView} watchlistCount={watchlist.length} />

      <main className="relative z-10 pt-20">
        {currentView === 'landing' && (
          <LandingPage setCurrentView={handleNavigate} />
        )}

        {currentView === 'dashboard' && (
          <Dashboard onSelectStock={handleSelectStock} />
        )}
        
        {currentView === 'search' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-white mb-2">Search Stocks</h1>
              <p className="text-gray-400">Find any stock and access comprehensive analysis</p>
            </div>
            <SearchBar onSearch={handleSearch} loading={loading} />
            {error && (
              <div className="mt-8 bg-red-900/20 border border-red-800 rounded-xl p-6 text-red-300">
                {error}
              </div>
            )}
          </div>
        )}

        {currentView === 'results' && results.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <SearchResults 
              results={results} 
              onSelectStock={handleSelectStock}
              onAddToWatchlist={addToWatchlist}
              loading={loading}
            />
          </div>
        )}

        {currentView === 'deepdive' && selectedStock && (
          <DeepDive 
            symbol={selectedStock.symbol} 
            onBack={handleBack}
            onAddToWatchlist={() => addToWatchlist(selectedStock)}
          />
        )}

        {currentView === 'watchlist' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <WatchList 
              watchlist={watchlist} 
              onSelectStock={handleSelectStock}
              onRemove={removeFromWatchlist}
            />
          </div>
        )}

        {currentView === 'forensics' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <ForensicsAnalysis stock={selectedStock} />
          </div>
        )}

        {currentView === 'apis' && <APIManager />}

        {currentView === 'about' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <About />
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>© 2026 PolyScan • Investment Intelligence Platform</p>
          <p className="mt-2">Data provided by Finnhub API • Built with React, Vite & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
