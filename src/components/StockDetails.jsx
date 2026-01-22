import React, { useEffect, useState } from 'react';
import { getStockQuote, getCompanyProfile } from '../services/finnhubAPI';

const StockDetails = ({ symbol, onClose }) => {
  const [quote, setQuote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [quoteData, profileData] = await Promise.all([
          getStockQuote(symbol),
          getCompanyProfile(symbol)
        ]);
        setQuote(quoteData);
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load stock data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchStockData();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="stock-card">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="stock-card bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button onClick={onClose} className="btn-primary mt-4">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  if (!quote || !profile || Object.keys(profile).length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="stock-card">
          <p className="text-gray-600 dark:text-gray-400">No data available for {symbol}</p>
          <button onClick={onClose} className="btn-primary mt-4">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const priceChange = quote.c - quote.pc;
  const percentChange = ((priceChange / quote.pc) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <button
        onClick={onClose}
        className="mb-4 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
      >
        ← Back to Search
      </button>

      <div className="stock-card">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {profile.name || symbol}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">
                {symbol}
              </p>
              {profile.exchange && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {profile.exchange}
                </p>
              )}
            </div>
            {profile.logo && (
              <img
                src={profile.logo}
                alt={profile.name}
                className="w-16 h-16 rounded-lg object-contain"
              />
            )}
          </div>
        </div>

        {/* Price Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              ${quote.c.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Change</p>
            <div className="flex items-baseline gap-3">
              <p
                className={`text-3xl font-bold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? '+' : ''}
                ${priceChange.toFixed(2)}
              </p>
              <p
                className={`text-xl font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ({isPositive ? '+' : ''}
                {percentChange}%)
              </p>
            </div>
          </div>
        </div>

        {/* Stock Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">High</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${quote.h.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Low</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${quote.l.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Open</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${quote.o.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Previous Close</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${quote.pc.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Company Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.country && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
                <p className="text-base text-gray-900 dark:text-white font-medium">
                  {profile.country}
                </p>
              </div>
            )}
            {profile.currency && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Currency</p>
                <p className="text-base text-gray-900 dark:text-white font-medium">
                  {profile.currency}
                </p>
              </div>
            )}
            {profile.finnhubIndustry && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                <p className="text-base text-gray-900 dark:text-white font-medium">
                  {profile.finnhubIndustry}
                </p>
              </div>
            )}
            {profile.marketCapitalization && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                <p className="text-base text-gray-900 dark:text-white font-medium">
                  ${profile.marketCapitalization.toFixed(2)}M
                </p>
              </div>
            )}
            {profile.ipo && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">IPO Date</p>
                <p className="text-base text-gray-900 dark:text-white font-medium">
                  {profile.ipo}
                </p>
              </div>
            )}
            {profile.shareOutstanding && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shares Outstanding</p>
                <p className="text-base text-gray-900 dark:text-white font-medium">
                  {profile.shareOutstanding.toFixed(2)}M
                </p>
              </div>
            )}
          </div>

          {profile.weburl && (
            <div className="mt-4">
              <a
                href={profile.weburl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Visit Company Website →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
