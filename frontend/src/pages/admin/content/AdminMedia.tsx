import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Search, Filter, Folder, MoreVertical } from 'lucide-react';

const MOCK_MEDIA = [
  { id: 1, name: 'lofoten_hero_summer.jpg', size: '4.2 MB', res: '3840x2160', folder: 'Destinations / Lofoten', usage: 3 },
  { id: 2, name: 'puffin_close_up.jpg', size: '1.8 MB', res: '1920x1080', folder: 'Wildlife / Birds', usage: 1 },
  { id: 3, name: 'oslo_opera_house.png', size: '3.1 MB', res: '2560x1440', folder: 'Destinations / Oslo', usage: 5 },
  { id: 4, name: 'ev_charger_icon.svg', size: '45 KB', res: 'Vector', folder: 'UI / Icons', usage: 142 },
];

export const AdminMedia = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Media Library</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all visual assets across the platform.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
          <Upload size={18} /> Upload Assets
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex">
        
        {/* Sidebar Folders */}
        <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 hidden md:block">
          <h3 className="font-bold text-slate-900 mb-4 text-sm">Folders</h3>
          <ul className="space-y-1 text-sm font-medium text-slate-600">
            <li className="flex items-center gap-2 p-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer">
              <Folder size={16} /> All Media
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-slate-200 rounded-lg cursor-pointer">
              <Folder size={16} /> Destinations
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-slate-200 rounded-lg cursor-pointer">
              <Folder size={16} /> Wildlife
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-slate-200 rounded-lg cursor-pointer">
              <Folder size={16} /> Marketing Banners
            </li>
          </ul>
        </div>

        {/* Media Grid/List */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search files..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
              <Filter size={16} /> Filter
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {MOCK_MEDIA.map(media => (
                <div key={media.id} className="border border-slate-200 rounded-lg overflow-hidden group hover:border-blue-400 transition-colors">
                  <div className="h-32 bg-slate-100 flex items-center justify-center relative">
                    <ImageIcon size={32} className="text-slate-300" />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-3 py-1 bg-white text-slate-900 text-xs font-bold rounded shadow-sm">View</button>
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <div className="text-xs font-bold text-slate-900 truncate" title={media.name}>{media.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                      <span>{media.size}</span>
                      <span>{media.res}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
