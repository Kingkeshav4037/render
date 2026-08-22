import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Settings, Search, Users } from 'lucide-react';

const MOCK_EVENTS = [
  { date: 15, title: 'Lofoten Cabin', status: 'BOOKED', capacity: '2/2' },
  { date: 15, title: 'Kayak Tour (10:00)', status: 'AVAILABLE', capacity: '12/20' },
  { date: 15, title: 'Kayak Tour (14:00)', status: 'AVAILABLE', capacity: '20/20' },
  { date: 16, title: 'Lofoten Cabin', status: 'BOOKED', capacity: '2/2' },
  { date: 16, title: 'Kayak Tour (10:00)', status: 'FULL', capacity: '20/20' },
  { date: 17, title: 'Lofoten Cabin', status: 'AVAILABLE', capacity: '0/2' },
];

export const ProviderCalendar = () => {
  const [view, setView] = useState<'month' | 'week'>('month');
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 flex flex-col h-[calc(100vh-4rem)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Availability Calendar</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your inventory, capacity, and pricing.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('month')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setView('week')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Week
            </button>
          </div>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600"><ChevronLeft size={20} /></button>
          <h2 className="text-lg font-bold text-slate-900 min-w-[140px] text-center">October 2026</h2>
          <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600"><ChevronRight size={20} /></button>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 ml-2">Today</button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search listings..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 shrink-0">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="py-3 px-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 flex-1 overflow-y-auto">
          {/* Empty padding for start of month (mocking Oct 2026 starting on Thursday) */}
          <div className="min-h-[120px] p-2 border-r border-b border-slate-100 bg-slate-50/50"></div>
          <div className="min-h-[120px] p-2 border-r border-b border-slate-100 bg-slate-50/50"></div>
          <div className="min-h-[120px] p-2 border-r border-b border-slate-100 bg-slate-50/50"></div>

          {daysInMonth.map(day => {
            const dayEvents = MOCK_EVENTS.filter(e => e.date === day);
            const isToday = day === 15;

            return (
              <div key={day} className={`min-h-[120px] p-1.5 border-r border-b border-slate-100 transition-colors hover:bg-slate-50 cursor-pointer ${isToday ? 'bg-blue-50/30' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && <span className="text-[10px] font-semibold text-slate-400 mt-1">{dayEvents.length} items</span>}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.map((evt, idx) => (
                    <div 
                      key={idx} 
                      className={`text-[11px] px-2 py-1 rounded border truncate font-medium flex justify-between items-center
                        ${evt.status === 'BOOKED' ? 'bg-slate-100 border-slate-200 text-slate-700' : ''}
                        ${evt.status === 'AVAILABLE' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : ''}
                        ${evt.status === 'FULL' ? 'bg-red-50 border-red-100 text-red-700' : ''}
                      `}
                    >
                      <span className="truncate">{evt.title}</span>
                      {evt.capacity && <span className="opacity-70 text-[9px] shrink-0 ml-1">{evt.capacity}</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
