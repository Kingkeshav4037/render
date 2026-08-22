import React, { useState } from 'react';
import { AlertOctagon, MessageSquare, Flag, EyeOff, CheckSquare, RefreshCcw } from 'lucide-react';

export const AdminModeration = () => {
  const [activeTab, setActiveTab] = useState('reviews');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Moderation Center</h1>
        <p className="text-slate-500 text-sm mt-1">Review flagged content, reported users, and suspicious reviews.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {[
          { id: 'reviews', label: 'Reported Reviews', count: 4 },
          { id: 'listings', label: 'Flagged Listings', count: 1 },
          { id: 'users', label: 'User Reports', count: 2 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-semibold transition-colors relative
              ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] 
                ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {activeTab === 'reviews' && (
          <div className="divide-y divide-slate-100">
            {[
              { id: 'rev-8412', target: 'Lofoten Panoramic Cabin', author: 'User usr-103', date: '2 hours ago', reason: 'Inappropriate Language', text: 'The cabin was great but the owner was a [REDACTED]. Do not book here!!!' },
              { id: 'rev-8399', target: 'Tromsø City Tour', author: 'User usr-422', date: '1 day ago', reason: 'Suspected Spam/Fake', text: 'Very good buy cheap followers here www.spam.com!!!' },
            ].map(item => (
              <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
                      <Flag size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.reason}</div>
                      <div className="text-xs text-slate-500">Reported {item.date} • Review on {item.target}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{item.id}</span>
                </div>
                
                <div className="ml-13 mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-serif italic">
                  "{item.text}"
                </div>

                <div className="ml-13 flex gap-3">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors border border-red-200">
                    <EyeOff size={14} /> Remove Review
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">
                    <AlertOctagon size={14} /> Warn User
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors ml-auto">
                    <CheckSquare size={14} /> Dismiss Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab !== 'reviews' && (
           <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
             <MessageSquare size={48} className="mb-4 opacity-20" />
             <p>Select a report to view details.</p>
           </div>
        )}
      </div>

    </div>
  );
};
