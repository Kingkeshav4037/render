import React from 'react';
import { Receipt, Coffee, Train, Hotel, Download } from 'lucide-react';
import { toast } from 'sonner';

export const Expenses = () => {
  const total = 12450;
  const budget = 15000;
  const pct = (total / budget) * 100;

  const expenses = [
    { id: 1, name: 'Aurora Lodge', category: 'Accommodation', amount: 4500, date: '12 Sep 2026', icon: <Hotel size={16} /> },
    { id: 2, type: 'Transport', name: 'Vy Train Ticket', amount: 850, date: '10 Sep 2026', icon: <Train size={16} /> },
    { id: 3, type: 'Dining', name: 'Børsen Spiseri', amount: 1200, date: '13 Sep 2026', icon: <Coffee size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      {/* Editorial Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-light text-navy-900 tracking-tight flex items-center gap-4">
            <Receipt size={40} className="text-gray-300" />
            Expense <span className="font-bold">Tracker</span>.
          </h1>
          <p className="mt-4 text-lg text-gray-500">Monitor your spending across all your trips.</p>
        </div>
        <button onClick={() => toast.success('Expense report downloaded')} className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-navy-900 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Overview */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-navy-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-aurora-green/20 blur-2xl rounded-full"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-aurora-green mb-6">Total Spent</h3>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-display font-black">12,450</span>
              <span className="text-white/60 mb-2 font-bold">NOK</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/60">
                <span>Budget: 15,000 NOK</span>
                <span>{pct.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-aurora-green rounded-full" style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-display font-bold text-navy-900 mb-6">Recent Transactions</h2>
          <div className="bg-white border border-gray-100 rounded-[32px] p-2 shadow-sm">
            {expenses.map((exp, idx) => (
              <div key={exp.id} className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-colors rounded-3xl ${idx !== expenses.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                    {exp.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900">{exp.name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{exp.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-navy-900">- {exp.amount} NOK</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
