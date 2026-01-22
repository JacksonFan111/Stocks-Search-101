import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';

export const PriceChart = ({ data, symbol }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No price data available</p>
      </div>
    );
  }

  // Calculate min and max for better Y-axis scaling
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1; // 10% padding

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={true} />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            domain={[minPrice - padding, maxPrice + padding]}
            label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: '#f3f4f6'
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
            labelStyle={{ color: '#9CA3AF' }}
            cursor={{ stroke: '#60a5fa', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={3}
            name="Price"
            isAnimationActive={false}
            animationDuration={0}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


export const ValuationChart = ({ dcf, assetBased, epv, currentPrice }) => {
  const valuationData = [
    { name: 'Current', value: currentPrice || 0, fill: '#6366f1' },
    { name: 'DCF', value: dcf?.fairValue || 0, fill: '#3b82f6' },
    { name: 'Asset-Based', value: assetBased?.tangibleValuePerShare || 0, fill: '#10b981' },
    { name: 'EPV', value: epv?.epvPerShare || 0, fill: '#f59e0b' }
  ].filter(item => item.value > 0);

  const maxValue = Math.max(...valuationData.map(d => d.value));
  const padding = maxValue * 0.15;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={valuationData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={true} />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          stroke="#9CA3AF"
          domain={[0, maxValue + padding]}
          label={{ value: 'Valuation ($)', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `$${value.toFixed(0)}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
            borderRadius: '8px',
            color: '#f3f4f6'
          }}
          formatter={(value) => `$${value.toFixed(2)}`}
          labelStyle={{ color: '#9CA3AF' }}
        />
        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
          {valuationData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const RiskScoreChart = ({ score, maxScore = 10 }) => {
  const percentage = (score / maxScore) * 100;
  const color = percentage < 30 ? '#10b981' : percentage < 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Polytope Risk Score
      </h3>
      <div className="flex items-center justify-between">
        <div className="relative w-40 h-40">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Risk', value: score },
                  { name: 'Safe', value: maxScore - score }
                ]}
                cx={80}
                cy={80}
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
              >
                <Cell fill={color} />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color }}>
                {score.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">/10</div>
            </div>
          </div>
        </div>
        <div className="flex-1 ml-8">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Risk Level</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${percentage}%`, backgroundColor: color }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {percentage < 30 ? 'Low Risk' : percentage < 60 ? 'Medium Risk' : 'High Risk'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BenchmarkChart = ({ peComparison, pbComparison }) => {
  const data = [
    {
      name: 'P/E Ratio',
      stock: peComparison?.value || 0,
      market: peComparison?.benchmark || 18.5
    },
    {
      name: 'P/B Ratio',
      stock: pbComparison?.value || 0,
      market: pbComparison?.benchmark || 2.8
    }
  ];

  const maxValue = Math.max(...data.map(d => Math.max(d.stock, d.market))) * 1.2;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={true} />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#9CA3AF"
          domain={[0, maxValue]}
          label={{ value: 'Ratio Value', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => value.toFixed(1)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
            borderRadius: '8px',
            color: '#f3f4f6'
          }}
          formatter={(value) => value.toFixed(2)}
          labelStyle={{ color: '#9CA3AF' }}
        />
        <Legend />
        <Bar dataKey="stock" fill="#3b82f6" name="Stock" radius={[8, 8, 0, 0]} />
        <Bar dataKey="market" fill="#8b5cf6" name="Market Avg" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};


export const ValuationSummary = ({ dcf, assetBased, epv }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* DCF */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
        <h4 className="font-bold text-blue-300 mb-3">🎯 DCF Valuation</h4>
        <div className="text-3xl font-bold text-blue-400 mb-2">
          ${dcf?.fairValue?.toFixed(2) || 'N/A'}
        </div>
        <p className="text-sm text-gray-400 mb-3">Fair Value per Share</p>
        <div className={`text-sm font-semibold mb-2 ${dcf?.upside > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {dcf?.upside > 0 ? '📈' : '📉'} {dcf?.upside > 0 ? '+' : ''}{dcf?.upside?.toFixed(1)}% Upside
        </div>
        <p className={`text-xs font-bold ${dcf?.status === 'Undervalued' ? 'text-green-400' : dcf?.status === 'Overvalued' ? 'text-red-400' : 'text-yellow-400'}`}>
          {dcf?.status || 'Fair'}
        </p>
      </div>

      {/* Asset-Based */}
      <div className="bg-green-900/30 border border-green-700 rounded-lg p-6">
        <h4 className="font-bold text-green-300 mb-3">🏢 Asset-Based</h4>
        <div className="text-3xl font-bold text-green-400 mb-2">
          ${assetBased?.tangibleValuePerShare?.toFixed(2) || 'N/A'}
        </div>
        <p className="text-sm text-gray-400 mb-3">Tangible Value per Share</p>
        <div className={`text-sm font-semibold ${assetBased?.discount > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {assetBased?.discount > 0 ? '✓' : '✗'} {assetBased?.discount > 0 ? '+' : ''}{assetBased?.discount?.toFixed(1)}% Discount
        </div>
      </div>

      {/* EPV */}
      <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-6">
        <h4 className="font-bold text-purple-300 mb-3">💼 EPV</h4>
        <div className="text-3xl font-bold text-purple-400 mb-2">
          ${epv?.epvPerShare?.toFixed(2) || 'N/A'}
        </div>
        <p className="text-sm text-gray-400 mb-3">Earnings Power Value</p>
        <div className={`text-sm font-semibold ${epv?.margin > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {epv?.margin > 0 ? '📊' : ''} {epv?.margin > 0 ? '+' : ''}{epv?.margin?.toFixed(1)}% Margin
        </div>
      </div>
    </div>
  );
};
