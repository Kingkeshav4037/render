import React from 'react';
import { Wallet } from 'lucide-react';

interface Props {
  spending: {
    totalBudget: number;
    spent: number;
    remaining: number;
    categories: Record<string, number>;
  };
}

export const TravelSpendingWidget: React.FC<Props> = ({ spending }) => {
  const percentSpent = Math.min(100, Math.round((spending.spent / spending.totalBudget) * 100));

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <Wallet size={20} className="text-blue-500" />
          Travel Spending
        </h3>
        <button className="text-sm text-blue-500 font-semibold hover:text-blue-600 transition-colors">Details</button>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-500 font-medium mb-1">Total Trip Budget</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-navy-900">{spending.totalBudget.toLocaleString()}</span>
          <span className="text-gray-500 font-medium pb-1">NOK</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-gray-700">Spent: {spending.spent.toLocaleString()} NOK</span>
          <span className="font-semibold text-aurora-green">Remaining: {spending.remaining.toLocaleString()} NOK</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-3 rounded-full ${percentSpent > 90 ? 'bg-red-500' : 'bg-navy-900'}`} 
            style={{ width: `${percentSpent}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-auto">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Top Categories</p>
        <div className="space-y-3">
          {Object.entries(spending.categories).map(([category, amount], i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-aurora-green' : 'bg-purple-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">{category}</span>
              </div>
              <span className="text-sm font-bold text-navy-900">{amount.toLocaleString()} NOK</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
