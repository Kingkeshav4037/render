import React, { useState } from 'react';
import { Star, MessageCircle, Reply, ThumbsUp, Filter, Search } from 'lucide-react';

const MOCK_REVIEWS = [
  { id: 1, customer: 'Sarah Jenkins', listing: 'Lofoten Panoramic Cabin', rating: 5, date: 'Oct 18, 2026', text: 'Absolutely breathtaking. The cabin was spotless, and watching the northern lights from the bed was a once in a lifetime experience.', response: null },
  { id: 2, customer: 'Marcus Voller', listing: 'Midnight Sun Kayaking', rating: 4, date: 'Oct 15, 2026', text: 'Great tour, our guide was very knowledgeable. Only 4 stars because the equipment pickup process was a bit chaotic.', response: 'Thank you for your feedback Marcus! We are actively working on improving our equipment distribution process for next season.' },
  { id: 3, customer: 'Emma Thompson', listing: 'Arctic View Suite', rating: 5, date: 'Oct 15, 2026', text: 'Perfect stay. Will definitely return next year.', response: null },
];

export const ProviderReviews = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reviews</h1>
          <p className="text-slate-500 text-sm mt-1">Manage guest feedback and maintain your reputation.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <Star size={24} className="fill-current" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">Average Rating</div>
            <div className="text-2xl font-bold text-slate-900">4.8 <span className="text-sm text-slate-400 font-medium">/ 5.0</span></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <MessageCircle size={24} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">Total Reviews</div>
            <div className="text-2xl font-bold text-slate-900">842</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
            <Reply size={24} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">Response Rate</div>
            <div className="text-2xl font-bold text-slate-900">92%</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search reviews..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {MOCK_REVIEWS.map(review => (
          <div key={review.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {review.customer.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{review.customer}</div>
                  <div className="text-xs text-slate-500">{review.date} • {review.listing}</div>
                </div>
              </div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < review.rating ? 'fill-current' : 'text-slate-200'} />
                ))}
              </div>
            </div>
            
            <p className="text-slate-700 text-sm mb-4">{review.text}</p>
            
            {review.response ? (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 ml-14">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Your Response</span>
                </div>
                <p className="text-sm text-slate-600">{review.response}</p>
              </div>
            ) : (
              <div className="ml-14">
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors">
                  <Reply size={16} /> Reply to guest
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
