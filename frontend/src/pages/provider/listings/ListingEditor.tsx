import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  ImageIcon, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  Users, 
  Star, 
  BarChart2,
  Save,
  Eye,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'content', label: 'Content', icon: Settings },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'availability', label: 'Availability', icon: Calendar },
  { id: 'policies', label: 'Policies', icon: ShieldCheck },
  { id: 'bookings', label: 'Bookings', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

export const ListingEditor = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Changes saved successfully');
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/provider/listings" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">Lofoten Panoramic Cabin</h1>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to={`/provider/listings/${id}/preview`} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <Eye size={16} /> Preview
              </Link>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                {isSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-1 border-b border-transparent">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors
                      ${isActive 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }
                    `}
                  >
                    <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'overview' && (
          <div className="animate-in fade-in space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Listing Status</h2>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div>
                  <div className="font-bold text-emerald-800 mb-1">Published</div>
                  <div className="text-sm text-emerald-600">Your listing is live and accepting bookings.</div>
                </div>
                <button className="px-4 py-2 bg-white text-emerald-700 text-sm font-bold rounded-lg shadow-sm border border-emerald-200 hover:bg-emerald-50">
                  Pause Listing
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-500 mb-2">Total Views</div>
                <div className="text-3xl font-bold text-slate-900">12,500</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-500 mb-2">Bookings (YTD)</div>
                <div className="text-3xl font-bold text-slate-900">142</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-500 mb-2">Revenue (YTD)</div>
                <div className="text-3xl font-bold text-slate-900">NOK 125K</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="animate-in fade-in space-y-6 max-w-3xl">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Content Details</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input type="text" defaultValue="Lofoten Panoramic Cabin" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea rows={6} defaultValue="Experience the magic of Lofoten in our panoramic glass-front cabin..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {['media', 'pricing', 'availability', 'policies', 'bookings', 'reviews', 'analytics'].includes(activeTab) && (
          <div className="animate-in fade-in flex items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="text-center max-w-md">
              <h3 className="text-lg font-bold text-slate-900 mb-2 capitalize">{activeTab} Management</h3>
              <p className="text-slate-500 text-sm">This section handles the {activeTab} logic. The backend integration and complex UI for this module will be implemented in a subsequent phase.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
