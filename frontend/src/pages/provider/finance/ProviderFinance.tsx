import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Download, CreditCard, CheckCircle2, Clock } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', date: 'Oct 15, 2026', desc: 'Booking NSL-8201', amount: 4500, type: 'CREDIT', status: 'COMPLETED' },
  { id: 'TXN-002', date: 'Oct 14, 2026', desc: 'Platform Fee (Monthly)', amount: -250, type: 'DEBIT', status: 'COMPLETED' },
  { id: 'TXN-003', date: 'Oct 12, 2026', desc: 'Payout to Bank ****4242', amount: -15000, type: 'PAYOUT', status: 'COMPLETED' },
  { id: 'TXN-004', date: 'Oct 10, 2026', desc: 'Booking NSL-8190', amount: 3200, type: 'CREDIT', status: 'COMPLETED' },
  { id: 'TXN-005', date: 'Oct 09, 2026', desc: 'Refund NSL-8185', amount: -1200, type: 'DEBIT', status: 'COMPLETED' },
];

export const ProviderFinance = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Track your earnings, payouts, and platform fees.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2">
            Request Payout
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-[60px] opacity-20 rounded-full"></div>
          <div className="relative z-10">
            <div className="text-slate-400 text-sm font-medium mb-1">Available Balance</div>
            <div className="text-4xl font-bold tracking-tight">NOK 24,500</div>
            <div className="mt-4 text-sm text-slate-400 flex items-center gap-1">
              <Clock size={14} /> Next scheduled payout: Oct 20
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-slate-500 text-sm font-semibold mb-1">Gross Earnings (YTD)</div>
            <div className="text-2xl font-bold text-slate-900">NOK 452,000</div>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold mt-4">
            <ArrowUpRight size={16} /> +12.5% vs last year
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-slate-500 text-sm font-semibold mb-1">Platform Fees (YTD)</div>
            <div className="text-2xl font-bold text-slate-900">NOK 22,600</div>
          </div>
          <div className="text-slate-400 text-sm mt-4">
            Effective rate: 5.0%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-900">Recent Transactions</h2>
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
              <Download size={16} /> Export
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_TRANSACTIONS.map(txn => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{txn.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{txn.desc}</div>
                      <div className="text-xs text-slate-400 font-mono">{txn.id}</div>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${txn.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()} NOK
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-slate-600 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 size={14} className="text-emerald-500" /> {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout Settings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Payout Settings</h2>
          
          <div className="p-4 border border-slate-200 rounded-lg flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
              <CreditCard size={24} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900">Nordea Bank Abp</div>
              <div className="text-sm text-slate-500">**** **** **** 4242</div>
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 font-medium">Payout Schedule</span>
              <span className="text-sm font-bold text-slate-900">Weekly (Tuesdays)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 font-medium">Currency</span>
              <span className="text-sm font-bold text-slate-900">NOK</span>
            </div>
          </div>
          
          <button className="w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 transition-colors">
            Manage Payout Methods
          </button>
        </div>
      </div>

    </div>
  );
};
