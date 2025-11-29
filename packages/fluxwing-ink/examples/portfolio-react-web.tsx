/**
 * Portfolio Overview - React Web Output
 *
 * This is what the design JSX would transform into for web production.
 * Same design, different renderer target.
 */

import React from 'react';

// Transformed components map to web equivalents
const PortfolioOverview: React.FC = () => {
  const holdings = [
    { symbol: 'AAPL', shares: '245', value: '$142,847', change: '+2.3%' },
    { symbol: 'MSFT', shares: '312', value: '$128,442', change: '+1.9%' },
    { symbol: 'GOOGL', shares: '142', value: '$98,221', change: '+0.9%' },
    { symbol: 'BRK.B', shares: '87', value: '$87,442', change: '-0.2%' },
    { symbol: 'VTI', shares: '285', value: '$76,891', change: '+1.1%' },
  ];

  const activities = [
    { icon: '💰', desc: 'AAPL Dividend', amount: '+$847', time: 'Today' },
    { icon: '📈', desc: 'Buy VTI', amount: '-$3,631', time: '1d' },
    { icon: '📉', desc: 'Sell TSLA', amount: '+$3,528', time: '2d' },
    { icon: '⬇️', desc: 'Deposit', amount: '+$5,000', time: '4d' },
    { icon: '💰', desc: 'MSFT Dividend', amount: '+$412', time: '1w' },
  ];

  return (
    <div className="portfolio-container p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <header className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Total Portfolio Value</p>
            <div className="flex items-baseline gap-4">
              <h1 className="text-3xl font-bold text-gray-900">$1,247,832.41</h1>
              <span className="text-green-600 text-lg">
                ▲ $12,847.23 (+1.04%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              ● Live
            </span>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Deposit
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Trade
            </button>
          </div>
        </div>
      </header>

      {/* STATS BAR */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Cash', value: '$84,221' },
          { label: "Day P&L", value: '+$12.8K', color: 'text-green-600' },
          { label: 'Buying Power', value: '$168K' },
          { label: 'Positions', value: '23' },
        ].map((stat, i) => (
          <div key={i} className="text-center py-3 border-r last:border-r-0 border-gray-200">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-xl font-semibold ${stat.color || 'text-gray-900'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* THREE COLUMNS */}
      <div className="grid grid-cols-3 gap-6">
        {/* LEFT: Holdings */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Top Holdings</h2>
          <table className="w-full">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="text-left py-2">Symbol</th>
                <th className="text-left py-2">Shares</th>
                <th className="text-right py-2">Value</th>
                <th className="text-right py-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-2 font-medium">{h.symbol}</td>
                  <td className="py-2 text-gray-500">{h.shares}</td>
                  <td className="py-2 text-right">{h.value}</td>
                  <td className={`py-2 text-right ${
                    h.change.startsWith('-') ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {h.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <a href="#" className="text-sm text-blue-600 hover:underline mt-3 block">
            View all 23 →
          </a>
        </div>

        {/* CENTER: Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Performance</h2>
          {/* This would be a real chart component like Recharts */}
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <polyline
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                points="0,60 30,50 60,70 90,30 120,40 150,45 180,35"
              />
            </svg>
          </div>
          <div className="flex justify-around mt-4 text-sm">
            <span>Week: <span className="text-green-600">+4.3%</span></span>
            <span>Month: <span className="text-green-600">+8.7%</span></span>
            <span>YTD: <span className="text-green-600">+24.7%</span></span>
          </div>
        </div>

        {/* RIGHT: Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{a.icon}</span>
                  <span>{a.desc}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={
                    a.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }>
                    {a.amount}
                  </span>
                  <span className="text-gray-400 text-sm">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
          <a href="#" className="text-sm text-blue-600 hover:underline mt-3 block">
            View all →
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-6 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500">
        <span>Individual Brokerage ****4847</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-700">Statements</a>
          <a href="#" className="hover:text-gray-700">Tax Docs</a>
          <a href="#" className="hover:text-gray-700">Settings</a>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioOverview;
