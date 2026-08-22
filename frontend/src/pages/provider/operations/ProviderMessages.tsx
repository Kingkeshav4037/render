import React, { useState } from 'react';
import { Search, Send, Phone, MoreVertical, Paperclip } from 'lucide-react';

const MOCK_CONVERSATIONS = [
  { id: 1, name: 'Sarah Jenkins', lastMsg: 'Perfect, we will see you at 3pm!', time: '10:42 AM', unread: 0, active: true },
  { id: 2, name: 'Marcus Voller', lastMsg: 'Is it possible to add a child seat to the booking?', time: 'Yesterday', unread: 1, active: false },
  { id: 3, name: 'Emma Thompson', lastMsg: 'Thank you for the lovely stay.', time: 'Oct 12', unread: 0, active: false },
];

export const ProviderMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50">
      
      {/* Sidebar: Conversations List */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {MOCK_CONVERSATIONS.map(conv => (
            <div key={conv.id} className={`p-4 border-b border-slate-100 cursor-pointer transition-colors flex gap-3 ${conv.active ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold shrink-0">
                {conv.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`text-sm truncate ${conv.unread > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{conv.name}</h3>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">{conv.time}</span>
                </div>
                <p className={`text-xs truncate ${conv.unread > 0 ? 'font-medium text-slate-900' : 'text-slate-500'}`}>{conv.lastMsg}</p>
              </div>
              {conv.unread > 0 && (
                <div className="w-2 h-2 bg-blue-600 rounded-full self-center"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Sarah Jenkins</h2>
              <p className="text-xs text-slate-500">Booking: #NSL-8201 (Oct 15 - Oct 18)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <button className="p-2 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"><Phone size={18} /></button>
            <button className="p-2 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-full">Today</span>
          </div>
          
          <div className="flex gap-3 max-w-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-auto">
              S
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm p-4 shadow-sm">
              <p className="text-sm text-slate-700">Hi, we are driving up from Bodø today. Just wondering if we can check in a bit early around 2pm?</p>
              <div className="text-[10px] text-slate-400 mt-1 text-right">10:15 AM</div>
            </div>
          </div>

          <div className="flex gap-3 max-w-lg ml-auto justify-end">
            <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm p-4 shadow-sm">
              <p className="text-sm">Hello Sarah! Yes, 2pm works perfectly. The cabin will be ready and the keycode is 1234#.</p>
              <div className="text-[10px] text-blue-200 mt-1 text-right">10:30 AM</div>
            </div>
          </div>

          <div className="flex gap-3 max-w-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-auto">
              S
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm p-4 shadow-sm">
              <p className="text-sm text-slate-700">Perfect, we will see you at 3pm!</p>
              <div className="text-[10px] text-slate-400 mt-1 text-right">10:42 AM</div>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-slate-600 p-2">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition-colors flex items-center justify-center shadow-sm">
              <Send size={18} className="mr-0.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
