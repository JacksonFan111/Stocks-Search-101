import React from 'react';

const About = () => {
  return (
    <div className="pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">About PolyScan</h1>
          <p className="text-xl text-gray-400">Advanced investment intelligence platform combining forensic analysis with machine learning</p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-gray-800 rounded-2xl p-12 mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            To democratize sophisticated financial analysis by providing individual investors with institutional-grade tools and insights. We believe that rigorous forensic analysis and intelligent pattern recognition can help identify investment opportunities while minimizing risk.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Data Collection',
                description: 'Real-time stock data, financial metrics, and market indicators aggregated from trusted sources'
              },
              {
                number: '02',
                title: 'Forensic Analysis',
                description: 'Multi-layer screening detecting anomalies, red flags, and risk patterns across the entire stock universe'
              },
              {
                number: '03',
                title: 'Intelligence Output',
                description: 'Actionable insights and investment recommendations powered by the Polytope Framework'
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Polytope Framework */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">The Polytope Framework</h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-10">
            <p className="text-gray-300 mb-6 leading-relaxed">
              The Polytope Framework is a proprietary multi-dimensional risk assessment model that identifies investment patterns requiring deeper investigation.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-lg font-bold text-blue-400 mb-3">🎯 The Core Concept</h4>
                <p className="text-gray-400">A "Polytope" is formed when three or more red flags are detected across different risk dimensions. This pattern indicates a stock requires immediate caution.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-purple-400 mb-3">📊 Five Risk Dimensions</h4>
                <ul className="text-gray-400 space-y-2 text-sm">
                  <li>• Volatility Assessment</li>
                  <li>• Market Capitalization Risk</li>
                  <li>• Valuation Metrics</li>
                  <li>• Industry Classification</li>
                  <li>• Momentum Indicators</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-800/50 rounded-lg p-6">
              <h4 className="text-lg font-bold text-red-300 mb-2">⚠️ The Polytope Rule</h4>
              <p className="text-gray-300">When a stock exhibits 3 or more red flags, it forms a Polytope pattern. This is a strong signal to avoid the investment or proceed with extreme caution.</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🔍', title: 'Stock Search', desc: 'Find and analyze any stock instantly' },
              { icon: '📊', title: 'Deep Dive Analysis', desc: 'Comprehensive financial metrics and charts' },
              { icon: '🚩', title: 'Forensic Screening', desc: 'Multi-layer red flag detection' },
              { icon: '⭐', title: 'Watchlist', desc: 'Track and export your portfolio' },
              { icon: '📈', title: 'Valuation Models', desc: 'DCF, Asset-Based, and EPV methods' },
              { icon: '📥', title: 'Data Export', desc: 'Export analysis to CSV and JSON' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-2xl p-8 mb-16">
          <h3 className="text-lg font-bold text-yellow-300 mb-3">⚖️ Important Disclaimer</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            PolyScan is an analytical tool providing insights and research assistance only. It is not financial advice. Investment decisions should be made after consultation with qualified financial advisors. Past performance does not guarantee future results. The Polytope Framework and red flag detection are based on historical patterns and may not predict future market behavior. Always conduct your own due diligence before making investment decisions.
          </p>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Built With</h2>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            {[
              { name: 'React', icon: '⚛️' },
              { name: 'Vite', icon: '⚡' },
              { name: 'Tailwind CSS', icon: '🎨' },
              { name: 'Finnhub API', icon: '📡' }
            ].map((tech, idx) => (
              <div key={idx} className="p-4">
                <div className="text-3xl mb-2">{tech.icon}</div>
                <p className="text-gray-400 font-medium">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
