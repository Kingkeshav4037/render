import React, { useState } from 'react';
import { Star, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Reviews = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');

  const pending = [
    { id: 1, type: 'Hotel', name: 'Juvet Landscape Hotel', date: 'Stayed 12-14 Sep', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80' },
    { id: 2, type: 'Activity', name: 'Fjord Safari Flåm', date: 'Visited 13 Sep', image: 'https://images.unsplash.com/photo-1620215905096-7f4c51478c93?auto=format&fit=crop&q=80' }
  ];

  const published = [
    { id: 3, type: 'Restaurant', name: 'Maaemo', rating: 5, date: 'Reviewed 2 months ago', text: 'An unforgettable culinary journey through Norwegian nature. The service was impeccable.', verified: true }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      {/* Editorial Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-display font-light text-navy-900 tracking-tight flex items-center gap-4">
          <Star size={40} className="text-amber-400" />
          Your <span className="font-bold">Reviews</span>.
        </h1>
        <p className="mt-4 text-lg text-gray-500">Share your experiences and help fellow travelers.</p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3">
          <div className="sticky top-32 space-y-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 flex justify-between items-center ${
                activeTab === 'pending'
                  ? 'bg-navy-900 text-white shadow-lg'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-navy-900'
              }`}
            >
              Needs Review <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeTab === 'pending' ? 'bg-white text-navy-900' : 'bg-gray-200 text-gray-500'}`}>{pending.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 ${
                activeTab === 'published'
                  ? 'bg-navy-900 text-white shadow-lg'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-navy-900'
              }`}
            >
              Published ({published.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-9 space-y-6">
          {activeTab === 'pending' && pending.map(item => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{item.type} · {item.date}</p>
                <h3 className="text-2xl font-display font-bold text-navy-900 mb-4">{item.name}</h3>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} className="text-gray-200 hover:text-amber-400 transition-colors">
                      <Star size={32} className={star === 1 ? 'fill-current text-amber-400' : ''} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <button className="px-6 py-3 bg-gray-50 hover:bg-navy-900 hover:text-white text-navy-900 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors w-full md:w-auto">
                  Write Review
                </button>
              </div>
            </div>
          ))}

          {activeTab === 'published' && published.map(item => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-display font-bold text-navy-900 mb-1">{item.name}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.date}</p>
                </div>
                <div className="flex gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => <Star key={i} size={16} className="fill-current" />)}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">"{item.text}"</p>
              {item.verified && (
                <div className="flex items-center gap-2 text-xs font-bold text-aurora-green uppercase tracking-widest">
                  <ShieldCheck size={16} /> Verified Booking
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
