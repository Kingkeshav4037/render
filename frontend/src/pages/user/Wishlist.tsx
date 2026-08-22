import React from 'react';
import { Bookmark, AlertCircle, ArrowRight, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Wishlist = () => {
  const navigate = useNavigate();

  const collections = [
    {
      name: 'My Northern Norway',
      count: 4,
      image: 'https://images.unsplash.com/photo-1513519107127-1ea506ce3c53?auto=format&fit=crop&q=80',
      items: [
        { name: 'Tromsø Ice Domes', type: 'Hotel', alert: { type: 'price', msg: 'Price dropped by 15%' } },
        { name: 'Fjord Safari', type: 'Activity', alert: { type: 'availability', msg: 'Almost Full' } }
      ]
    },
    {
      name: 'Dream Hotels',
      count: 8,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
      items: [
        { name: 'Juvet Landscape Hotel', type: 'Hotel', alert: null },
        { name: 'The Bolder', type: 'Hotel', alert: { type: 'offer', msg: 'New Breakfast Offer' } }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      {/* Editorial Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-display font-light text-navy-900 tracking-tight flex items-center gap-4">
          <Bookmark size={40} className="text-gray-300" />
          Curated <span className="font-bold">Collections</span>.
        </h1>
        <p className="mt-4 text-lg text-gray-500">Your saved places, organized for your next adventure.</p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {collections.map((collection, idx) => (
          <div key={idx} className="group relative rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-shadow bg-white border border-gray-100 min-h-[400px]">
            {/* Header / Hero */}
            <div className="h-48 relative overflow-hidden">
              <img src={collection.image} alt={collection.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 to-transparent"></div>
              <div className="absolute bottom-6 left-8">
                <h3 className="text-3xl font-display font-bold text-white">{collection.name}</h3>
                <p className="text-white/80 text-sm font-bold uppercase tracking-widest">{collection.count} Saved Items</p>
              </div>
            </div>

            {/* List */}
            <div className="p-8 space-y-4">
              {collection.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl cursor-pointer transition-colors" onClick={() => navigate('/explore')}>
                  <div>
                    <h4 className="font-bold text-navy-900">{item.name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.type}</p>
                  </div>
                  {item.alert && (
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                      item.alert.type === 'price' ? 'bg-aurora-green/20 text-navy-900' :
                      item.alert.type === 'availability' ? 'bg-red-50 text-red-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {item.alert.type === 'price' && <TrendingDown size={12} />}
                      {item.alert.type === 'availability' && <AlertCircle size={12} />}
                      {item.alert.msg}
                    </span>
                  )}
                </div>
              ))}
              
              <button className="w-full py-4 mt-2 text-sm font-bold text-navy-900 flex justify-center items-center gap-2 group/btn">
                View Collection <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};
