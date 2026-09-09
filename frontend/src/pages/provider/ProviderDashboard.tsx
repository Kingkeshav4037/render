import React from 'react';
import { 
  Building2, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

// Mock Data
const QUICK_STATS = [
  { title: "Today's Revenue", value: 'NOK 48,250', trend: '+12.5%', isPositive: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { title: 'Bookings Today', value: '126', trend: '+4.2%', isPositive: true, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'Occupancy / Capacity', value: '82%', trend: '-2.1%', isPositive: false, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
  { title: 'Pending Requests', value: '8', trend: null, isPositive: null, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const TODAY_OPERATIONS = [
  { id: 1, type: 'CHECK_IN', customer: 'Sarah Jenkins', item: 'Lofoten Cabin - Standard', time: '14:00', status: 'PENDING' },
  { id: 2, type: 'ACTIVITY', customer: 'Marcus Voller', item: 'Fjord Kayak Tour', time: '15:30', status: 'CONFIRMED' },
  { id: 3, type: 'CHECK_OUT', customer: 'Emma Thompson', item: 'Arctic View Suite', time: '11:00', status: 'COMPLETED' },
];

const TASKS = [
  { id: 1, title: '3 listings need attention', type: 'WARNING', action: 'Review Listings' },
  { id: 2, title: '2 reservations require confirmation', type: 'URGENT', action: 'Confirm Bookings' },
  { id: 3, title: 'New review received: 5 stars', type: 'INFO', action: 'Read Review' },
];

export const ProviderDashboard = () => {
  const { profile } = useAuthStore();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {profile?.fullName?.split(' ')[0] || 'Provider'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening today.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link to="/provider/listings/new" className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm text-center">
            Create Listing
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {QUICK_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={20} />
                </div>
                {stat.trend && (
                  <span className={`flex items-center text-xs font-semibold ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                    {stat.isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingUp size={14} className="mr-1 rotate-180" />}
                    {stat.trend}
                  </span>
                )}
              </div>
              <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Operations & Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900">Today's Operations</h2>
              <Link to="/provider/bookings" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="divide-y divide-slate-100">
              {TODAY_OPERATIONS.map(op => (
                <div key={op.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-lg text-slate-600 font-bold text-sm">
                      {op.time.split(':')[0]}<span className="text-[10px] text-slate-400 font-normal">{op.time.split(':')[1]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{op.customer}</p>
                      <p className="text-sm text-slate-500">{op.item}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase hidden sm:inline-block
                      ${op.type === 'CHECK_IN' ? 'bg-blue-50 text-blue-700' : ''}
                      ${op.type === 'ACTIVITY' ? 'bg-emerald-50 text-emerald-700' : ''}
                      ${op.type === 'CHECK_OUT' ? 'bg-slate-100 text-slate-600' : ''}
                    `}>
                      {op.type.replace('_', ' ')}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mock Chart Area */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-slate-900">Revenue (Last 7 Days)</h2>
              <select className="bg-slate-50 border border-slate-200 text-sm font-medium rounded-lg px-3 py-1.5 outline-none text-slate-700 focus:border-blue-500">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            {/* Extremely simple CSS mock chart */}
            <div className="h-48 w-full flex items-end justify-between gap-2 px-2 pb-2">
              {[40, 60, 45, 80, 50, 90, 75].map((h, i) => (
                <div key={i} className="w-full bg-blue-50 hover:bg-blue-100 rounded-t-sm relative group cursor-pointer transition-colors" style={{ height: `${h}%` }}>
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    NOK {h * 1000}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2 px-2 font-medium">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tasks & Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900">Action Required</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {TASKS.map(task => (
                <div key={task.id} className="p-5 flex flex-col gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {task.type === 'URGENT' && <AlertCircle size={18} className="text-red-500" />}
                      {task.type === 'WARNING' && <AlertCircle size={18} className="text-amber-500" />}
                      {task.type === 'INFO' && <CheckCircle2 size={18} className="text-emerald-500" />}
                    </div>
                    <p className="text-sm font-medium text-slate-700">{task.title}</p>
                  </div>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 self-start ml-7">
                    {task.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-[80px] opacity-30 rounded-full"></div>
            <div className="relative z-10">
              <Building2 className="text-blue-400 mb-4" size={24} />
              <h3 className="text-lg font-bold mb-2">Optimize your listings</h3>
              <p className="text-slate-400 text-sm mb-4">Adding seasonal pricing can increase your overall revenue by up to 15% during peak times.</p>
              <Link to="/provider/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                Setup Pricing <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
