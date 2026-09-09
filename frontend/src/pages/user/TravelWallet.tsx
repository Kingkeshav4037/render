import React from 'react';
import { Wallet, QrCode, Train, Ticket } from 'lucide-react';

export const TravelWallet = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      {/* Editorial Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-display font-light text-navy-900 tracking-tight flex items-center gap-4">
          <Wallet size={40} className="text-gray-300" />
          Travel <span className="font-bold">Wallet</span>.
        </h1>
        <p className="mt-4 text-lg text-gray-500">Your digital passes, tickets, and bookings in one place.</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-12 space-y-8">
        
        {/* Unified Travel Pass */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Unified Norway Pass</h2>
          
          <div className="bg-navy-900 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-aurora-green/20 blur-3xl rounded-full"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 text-center md:text-left">
                <p className="text-aurora-green font-bold text-xs uppercase tracking-widest mb-2">SmartLife Pass</p>
                <h3 className="text-4xl font-display font-bold mb-6">Tromsø Explorer</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60 text-sm font-medium">Passenger</span>
                    <span className="font-bold">Keshav</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60 text-sm font-medium">Valid Dates</span>
                    <span className="font-bold">12 — 18 Sep 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm font-medium">Included Zones</span>
                    <span className="font-bold">Zone A, B</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-3xl shrink-0">
                <QrCode size={160} className="text-navy-900" />
                <p className="text-center text-navy-900 font-bold text-xs uppercase tracking-widest mt-4">NSL-8492-X</p>
              </div>
            </div>
          </div>
        </section>

        {/* Individual Tickets */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Upcoming Tickets</h2>
          
          <div className="space-y-4">
            
            {/* Train Ticket */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500"></div>
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Train size={24} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Vy Train · 14 Sep, 08:30</p>
                <h4 className="text-xl font-bold text-navy-900">Oslo S → Bergen</h4>
                <p className="text-sm text-gray-500">Seat 42A, Carriage 3</p>
              </div>
              <button className="px-6 py-3 bg-gray-50 group-hover:bg-navy-900 text-navy-900 group-hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors">
                View QR
              </button>
            </div>

            {/* Museum Pass */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-purple-500"></div>
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                <Ticket size={24} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Activity · 15 Sep, 10:00</p>
                <h4 className="text-xl font-bold text-navy-900">Munch Museum Entry</h4>
                <p className="text-sm text-gray-500">Standard Admission, 2 Adults</p>
              </div>
              <button className="px-6 py-3 bg-gray-50 group-hover:bg-navy-900 text-navy-900 group-hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors">
                View QR
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
