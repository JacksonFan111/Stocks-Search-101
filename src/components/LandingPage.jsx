import React, { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { sampleStocks, generateSampleChartData, generateSampleMetrics } from '../services/sampleData';

const LandingPage = ({ setCurrentView }) => {
  const [hoveredStock, setHoveredStock] = useState(null);

  const handleSelectStock = (stock) => {
    setCurrentView('deepdive', stock);
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Investment Intelligence Platform
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover deep insights into stock performance with forensic analysis, benchmarking, and intelligent risk assessment powered by the Polytope Framework.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setCurrentView('search')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              Start Analyzing
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className="px-8 py-3 border border-gray-700 rounded-lg text-gray-300 font-semibold hover:border-gray-600 hover:text-white transition-all"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 my-20">
          {[
            {
              icon: '🔬',
              title: 'Forensic Analysis',
              description: 'Deep dive into financial metrics and identify red flags with advanced screening'
            },
            {
              icon: '📊',
              title: 'Benchmarking',
              description: 'Compare stocks against market averages and peer companies'
            },
            {
              icon: '⚠️',
              title: 'Risk Assessment',
              description: 'Polytope-based risk scoring identifies investment patterns and vulnerabilities'
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all group"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 py-12 border-t border-gray-800 mt-16">
          {[
            { label: 'Stocks Analyzed', value: '15K+' },
            { label: 'Daily Updates', value: 'Real-time' },
            { label: 'Metrics Tracked', value: '200+' },
            { label: 'Years of Data', value: '10+' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-gray-800 rounded-2xl max-w-4xl mx-auto px-8 py-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to analyze?</h2>
        <p className="text-gray-400 mb-8">Start by searching for any stock symbol to unlock comprehensive insights.</p>
        <button
          onClick={() => setCurrentView('search')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
        >
          Begin Analysis
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
