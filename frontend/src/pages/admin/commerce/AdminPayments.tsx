import React from 'react';
import { CreditCard, DollarSign, Download, ArrowUpRight } from 'lucide-react';

const MOCK_PAYMENTS = [
  { id: 'txn_109284', ref: 'NSL-8201', amount: 'NOK 4,500', provider: 'Stripe', status: 'SUCCEEDED', date: 'Today, 09:41 AM' },
  { id: 'txn_109283', ref: 'NSL-8200', amount: 'NOK 1,200', provider: 'Vipps', status: 'SUCCEEDED', date: 'Today, 08:22 AM' },
  { id: 'txn_109282', ref: 'NSL-8199', amount: 'NOK 8,900', provider: 'Stripe', status: 'FAILED', date: 'Yesterday, 14:15 PM' },
  { id: 'txn_109281', ref: 'NSL-8198', amount: 'NOK -1,200', provider: 'Stripe (Refund)', status: 'SUCCEEDED', date: 'Yesterday, 11:05 AM' },
];

export const AdminPayments = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="text-emerald-600" /> Payments & Finance
          </h1>
          <p className="text-slate-500 text-sm mt-1">Transaction logs, refunds, and financial reporting.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Gross Volume (30d)', val: 'NOK 2.4M', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Stripe Share', val: '68%', icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Vipps Share', val: '32%', icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Refund Rate', val: '1.2%', icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{stat.val}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-900">Transaction Log</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Booking Ref</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold">Gateway</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_PAYMENTS.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{txn.id}</td>
                  <td className="px-6 py-4 font-mono text-blue-600 hover:underline cursor-pointer">{txn.ref}</td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${txn.amount.includes('-') ? 'text-red-600' : 'text-slate-900'}`}>
                    {txn.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-700">{txn.provider}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${txn.status === 'SUCCEEDED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}
                    `}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
