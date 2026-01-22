import React from 'react';

const PolytopeFramework = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4">
          Global Value Investment Framework V3
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
          The Polytope Model
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
          Find solid, undervalued stocks (or equivalent assets) globally after deep research.
        </p>
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
          <p className="text-red-700 dark:text-red-300 font-semibold">
            Primary Directive: Do not tolerate "makeup data." Use the Polytope Fraud Theory to identify the shape of fraud before verifying value.
          </p>
        </div>
      </div>

      {/* Context */}
      <div className="stock-card mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Context</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li><strong>Role:</strong> Senior Analyst managing 30% of total assets (Buffett Style).</li>
          <li><strong>Task:</strong> Research 20+ items/day. Focus on "Business, Not Ticker."</li>
        </ul>
      </div>

      {/* I. Fundamental Index (The Filter) */}
      <div className="stock-card mb-8">
        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          I. Fundamental Index (The Filter)
        </h2>
        <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-6">
          Must pass these checks to even be considered for Valuation.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { num: 1, title: "Liquidity & Solvency", desc: "Can they survive a 2-year winter?" },
            { num: 2, title: "Operational Efficiency", desc: "Is the 'machine' actually working (Asset Turnover)?" },
            { num: 3, title: "Profitability Reality Check", desc: "Does Net Income match Operating Cash Flow (OCF)?" },
            { num: 4, title: "Cash King (Hard Cash)", desc: "Do equivalents exist (verify existence)." },
            { num: 5, title: "Liability Truth", desc: "Accounts Payable & 'Off-Balance Sheet' obligations." },
            { num: 6, title: "Valuation Ratios", desc: "EV/EBITDA, FCF/P/E, Price/FCF." }
          ].map((check) => (
            <div key={check.num} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  {check.num}
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{check.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{check.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* II. Polytope 10-Point Alarm System */}
      <div className="stock-card mb-8 bg-yellow-50 dark:bg-yellow-900/10">
        <h2 className="text-3xl font-bold text-yellow-700 dark:text-yellow-400 mb-4">
          II. Key Custom Metrics: The Polytope 10-Point Alarm System
        </h2>
        <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-6">
          Reorganized to align with Short Seller Forensic Methods.
        </p>

        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">A. The "Cash Flow Payable" Disconnect (P/T Alarms: Profitability & Accruals)</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><strong>Debt-Fueled Growth vs. Organic:</strong> Is growth funded by OCF or new debt?</li>
              <li><strong>The "Pay Day Loan" Test:</strong> Is (Net Income - OCF) / Total Assets &gt; 5% REJECT.</li>
              <li><strong>GAAP vs. Non-GAAP "Text Shredding":</strong> Reject if Adjusted EPS is &gt;40% higher than GAAP EPS (Sign of "Income Statement Bubbles").</li>
            </ol>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">B. Balance Sheet "Rot" (Detect Hidden Risk)</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300" start="4">
              <li><strong>R&D vs. Capitalization Shift:</strong> Increasing Cap Ex as R&D declines = potential ROI.</li>
              <li><strong>Inventory/Receivables Stretch:</strong> If Days Sales Outstanding (DSO) or Days Inventory Outstanding (DIO) rises faster than Sales, they are stuffing the channel.</li>
              <li><strong>Supply Chain or Financing Hidden Backdoor:</strong> [check "Other Payables"].</li>
              <li><strong>Digital/Crypto Valuation Gaps:</strong> Verify proof of reserves for any crypto/DeFi exposure.</li>
            </ol>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">C. The "Smart Money" & Contagion Check (P/T Alarms: Short Selling & Clustering)</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300" start="8">
              <li><strong>The Short Seller Signal:</strong> Check Short Interest. If Short Interest % of Float &gt; 15% OR Borrowing Costs &gt; 10%, Assume Guilty until proven innocent.</li>
              <li><strong>Industry Contagion:</strong> If the company in a "Hot" sector (e.g., AI SPACs, DePin)? If a peer has committed fraud recently, downgrade the entire sector's trust score.</li>
              <li><strong>The "Big Bath" Watch:</strong> Be wary of new CEOs taking massive one-time write-downs to "reset" the baseline.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* III. Critical Forensic Analysis Framework */}
      <div className="stock-card mb-8">
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
          III. Critical Forensic Analysis Framework (The Table)
        </h2>
        <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-6">
          Updated with Polytope Thresholds.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-3 text-left font-bold">Test Metric</th>
                <th className="px-4 py-3 text-left font-bold">Healthy Signal</th>
                <th className="px-4 py-3 text-left font-bold">Fraud/Risk Indicator (The Polytope)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 font-semibold">1. OCF / Debt Maturities</td>
                <td className="px-4 py-3 text-green-600">&gt; 1.5x</td>
                <td className="px-4 py-3 text-red-600">&lt; 0.8x (Liquidity Crisis Risk)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">2. R&D Capitalization Rate</td>
                <td className="px-4 py-3 text-green-600">&lt; 30%</td>
                <td className="px-4 py-3 text-red-600">&gt; 60% (Hiding Expenses as Assets)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">3. GAAP vs Non-GAAP Var</td>
                <td className="px-4 py-3 text-green-600">&lt; 15%</td>
                <td className="px-4 py-3 text-red-600">&gt; 40% (Fabricated Profitability)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">4. Supply Chain Payable Days</td>
                <td className="px-4 py-3 text-green-600">&lt; 120 days</td>
                <td className="px-4 py-3 text-red-600">&gt; 300 days (Unpaid Suppliers/Artificial Cash)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">5. Short Interest Ratio</td>
                <td className="px-4 py-3 text-green-600">&lt; 5%</td>
                <td className="px-4 py-3 text-red-600">&gt; 15-20% (Smart Money detects trouble)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">6. Asset Turnover Trend</td>
                <td className="px-4 py-3 text-green-600">Stable/Rising</td>
                <td className="px-4 py-3 text-red-600">Declining (while Sales reported as Rising)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">7. Digital/Intangible Gap</td>
                <td className="px-4 py-3 text-green-600">&lt; 5%</td>
                <td className="px-4 py-3 text-red-600">&gt; 20% (Asset Bloating)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* IV. Valuation Method */}
      <div className="stock-card mb-8 bg-green-50 dark:bg-green-900/10">
        <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
          IV. Valuation Method
        </h2>
        <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-6">
          Only apply these AFTER the company passes the Forensic Framework above.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-500">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">1. Discounted Cash Flow (DCF)</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Use a high discount rate (margin of safety).</p>
            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded font-mono text-xs">
              DCF = Σ(FCF<sub>t</sub> / (1+r)<sup>t</sup>)
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-500">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">2. Asset-Based Valuation</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Tangible Book Value Only (strip out Goodwill).</p>
            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded font-mono text-xs">
              NAV = Assets - Intangibles - Liabilities
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-500">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">3. Earning Power Value (EPV)</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Sustainable earnings excluding growth.</p>
            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded font-mono text-xs">
              EPV = Adjusted Earnings / WACC
            </div>
          </div>
        </div>
      </div>

      {/* V. Philosophy & Execution */}
      <div className="stock-card mb-8 bg-purple-50 dark:bg-purple-900/10">
        <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">
          V. Philosophy & Execution
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">1. The Polytope Rule</h4>
            <p className="text-gray-700 dark:text-gray-300">
              One red flag might be an error; <span className="text-red-600 font-bold">Three red flags is a pattern (a Polytope)</span>. Do not buy.
            </p>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">2. Wait... be the Polypus</h4>
            <p className="text-gray-700 dark:text-gray-300">
              Let the "Big Bath" happen. Buy when the bad news is fully priced in, not before.
            </p>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">3. Verify, Don't Trust</h4>
            <p className="text-gray-700 dark:text-gray-300">
              Assume all Non-GAAP metrics are marketing materials until reconciled with the Cash Flow Statement.
            </p>
          </div>
        </div>
      </div>

      {/* VI. Research Scope & Valid Sectors */}
      <div className="stock-card mb-8">
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          VI. Research Scope & Valid Sectors
        </h2>
        
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Markets: US, China, Germany, Japan, UK, France + Oddball opportunities.</h4>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Instruments: Stocks, ETFs, Bonds, Commodities (Gold/Silver). Carefully selected Crypto.</h4>
        </div>

        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Focus Sectors:</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { sector: "Information Technology", desc: "(Hardware/Software) - Watch for AI hype bubbles." },
            { sector: "Consumer Staples", desc: "(Food/Bev) - Inflation resilience." },
            { sector: "Energy/Utilities", desc: "(Oil/Gas/Electric) - Real assets." },
            { sector: "Healthcare", desc: "(Pharma) - Check patent cliffs." },
            { sector: "Industrials", desc: "(Manufacturing) - Supply chain health." }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h5 className="font-bold text-gray-900 dark:text-white mb-1">{item.sector}</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-bold text-gray-900 dark:text-white mb-2">Expectation</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>Convert all values to USD for comparison.</li>
            <li><strong>Output:</strong> Ticker, Price, "Why Undervalued," "Polytope Risk Score (Low/Med/High)," 1-Sentence Recommendation.</li>
          </ul>
        </div>
      </div>

      {/* Output Format */}
      <div className="stock-card mb-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Table Format for Output (V3)
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-600">
                <th className="border border-gray-300 dark:border-gray-500 px-3 py-2">Date</th>
                <th className="border border-gray-300 dark:border-gray-500 px-3 py-2">Ticker</th>
                <th className="border border-gray-300 dark:border-gray-500 px-3 py-2">Exchange</th>
                <th className="border border-gray-300 dark:border-gray-500 px-3 py-2">Company</th>
                <th className="border border-gray-300 dark:border-gray-500 px-3 py-2">Sector</th>
                <th className="border border-gray-300 dark:border-gray-500 px-3 py-2">Local Price</th>
                <th className="border border-gray-300 dark:border-gray-500 px-3 py-2">USD Price</th>
                <th className="border border-gray-300 dark:border-gray-500 px-3 py-2">What They Sell</th>
                <th className="border border-gray-300 dark:border-gray-500 px-3 py-2">Why Undervalued</th>
                <th className="border border-gray-300 dark:border-gray-500 px-3 py-2">Polytope Risk</th>
                <th className="border border-gray-300 dark:border-gray-500 px-3 py-2">Reco</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white dark:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-500 px-3 py-2 text-gray-500">YYYY-MM-DD</td>
                <td className="border border-gray-300 dark:border-gray-500 px-3 py-2 text-gray-500">XYZ</td>
                <td className="border border-gray-300 dark:border-gray-500 px-3 py-2 text-gray-500">NYSE</td>
                <td className="border border-gray-300 dark:border-gray-500 px-3 py-2 text-gray-500">...</td>
                <td className="border border-gray-300 dark:border-gray-500 px-3 py-2 text-gray-500">Tech</td>
                <td className="border border-gray-300 dark:border-gray-500 px-3 py-2 text-gray-500">...</td>
                <td className="border border-gray-300 dark:border-gray-500 px-3 py-2 text-gray-500">...</td>
                <td className="border border-gray-300 dark:border-gray-500 px-3 py-2 text-gray-500">...</td>
                <td className="border border-gray-300 dark:border-gray-500 px-3 py-2 text-gray-500">Strong FCF, weak sentiment</td>
                <td className="border border-gray-300 dark:border-gray-500 px-3 py-2">
                  <span className="text-green-600 font-semibold">Low</span> (Short Interest &gt;20%)
                </td>
                <td className="border border-gray-300 dark:border-gray-500 px-3 py-2 text-gray-500">Avoid</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default PolytopeFramework;
