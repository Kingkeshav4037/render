import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Map, Leaf, Mountain, Utensils, Home, Car, Calendar, 
  Tag, Sparkles, Snowflake, Network, Languages, Image as ImageIcon, Trees 
} from 'lucide-react';

const CMS_MODULES = [
  { name: 'Destinations & Places', path: '/admin/content/places', icon: Map, color: 'text-blue-600', count: '148+ locations' },
  { name: 'Wildlife Species', path: '/admin/content/wildlife', icon: Leaf, color: 'text-emerald-600', count: '36+ species' },
  { name: 'Plants, Trees & Flora', path: '/admin/content/flora', icon: Trees, color: 'text-emerald-700', count: 'Botanical species' },
  { name: 'Activities & Tours', path: '/admin/content/activities', icon: Mountain, color: 'text-purple-600', count: '100+ activities' },
  { name: 'Hiking Trails', path: '/admin/content/trails', icon: Mountain, color: 'text-indigo-600', count: '40+ trails' },
  { name: 'Ski & Winter Resorts', path: '/admin/content/skiresorts', icon: Snowflake, color: 'text-sky-600', count: '25+ resorts' },
  { name: 'Scenic Road Trips', path: '/admin/content/roadtrips', icon: Car, color: 'text-teal-600', count: '20+ routes' },
  { name: 'Aurora Hotspots', path: '/admin/content/aurora', icon: Sparkles, color: 'text-violet-600', count: '15+ observatories' },
  { name: 'Food & Dining', path: '/admin/content/food', icon: Utensils, color: 'text-amber-600', count: '50+ rest. / 30+ foods' },
  { name: 'Accommodations & Stays', path: '/admin/content/stays', icon: Home, color: 'text-cyan-600', count: '50+ stays' },
  { name: 'Events & Festivals', path: '/admin/content/events', icon: Calendar, color: 'text-rose-600', count: '12 active' },
  { name: 'Travel Deals', path: '/admin/content/deals', icon: Tag, color: 'text-orange-600', count: 'Curated deals' },
  { name: 'Content Graph & Relationships', path: '/admin/content/relationships', icon: Network, color: 'text-pink-600', count: 'Entity links' },
  { name: 'Translations & i18n', path: '/admin/content/translations', icon: Languages, color: 'text-amber-700', count: 'Multi-language' },
];

export const AdminContent = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content Management System</h1>
        <p className="text-slate-500 text-sm mt-1">Manage global platform content, Norway directories, entity graphs, and media.</p>
      </div>

      {/* Global Actions */}
      <div className="flex gap-4">
        <Link to="/admin/media" className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors w-64">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-lg">
            <ImageIcon size={24} />
          </div>
          <div>
            <div className="font-bold text-slate-900">Media Library</div>
            <div className="text-xs text-slate-500">425+ assets stored</div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CMS_MODULES.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <Link 
              key={i} 
              to={mod.path} 
              className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-start justify-between min-h-[160px]"
            >
              <div className={`p-3 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors ${mod.color}`}>
                <Icon size={24} />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{mod.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{mod.count}</p>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
};
