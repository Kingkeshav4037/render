import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { ArrowLeft, Server, Activity, Terminal, ShieldAlert, Cpu } from 'lucide-react';

export const DeviceDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-polar-indigo/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Container className="relative z-10 max-w-5xl">
        <Link to="/infrastructure/iot" className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Fleet
        </Link>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-polar-indigo/20 flex items-center justify-center border border-polar-indigo/50">
                <Cpu className="w-8 h-8 text-polar-indigo" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold">{id}</h1>
                <p className="text-gray-400">Environmental Sensor Node • Oslo Sentrum</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="bg-green-400/20 text-green-400 border border-green-400/30 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-polar-indigo"/> Live Telemetry</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Temperature</div>
                  <div className="text-2xl font-bold">-2.4 °C</div>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Air Quality Index</div>
                  <div className="text-2xl font-bold text-green-400">24 (Good)</div>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Humidity</div>
                  <div className="text-2xl font-bold">84%</div>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Battery Level</div>
                  <div className="text-2xl font-bold text-green-400">92%</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Terminal className="w-5 h-5 text-polar-indigo"/> Diagnostic Log</h3>
              <div className="bg-black/50 p-4 rounded-xl border border-white/5 h-48 overflow-y-auto font-mono text-xs text-gray-400 space-y-2">
                <div><span className="text-polar-indigo">[10:42:01]</span> PING OK (12ms)</div>
                <div><span className="text-polar-indigo">[10:41:45]</span> SENSOR DATA TRANSMITTED</div>
                <div><span className="text-polar-indigo">[10:41:30]</span> PING OK (11ms)</div>
                <div><span className="text-polar-indigo">[10:41:15]</span> SENSOR DATA TRANSMITTED</div>
                <div><span className="text-polar-indigo">[10:41:00]</span> PING OK (14ms)</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex gap-4">
            <button className="bg-polar-indigo text-deep-night font-bold px-6 py-3 rounded-xl hover:bg-white transition-colors">
              Run Diagnostics
            </button>
            <button className="bg-white/5 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Restart Device
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};
