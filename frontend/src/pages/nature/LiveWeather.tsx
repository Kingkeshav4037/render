import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { Cloud, Sun, Wind, Droplets, Eye, Thermometer, CloudRain, Sunrise, Sunset, MapPin, Map as MapIcon, Snowflake } from 'lucide-react';

export const LiveWeather = () => {
  const [activeLayer, setActiveLayer] = useState('Temperature');

  const windParticles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${1 + Math.random()}s`
    }));
  }, []);


  const forecast = [
    { day: 'Mon', icon: <Sun className="w-8 h-8 text-amber-400" />, temp: '12°C', low: '6°C', rain: '0%', wind: '3 m/s', sunrise: '06:15', sunset: '20:45' },
    { day: 'Tue', icon: <CloudRain className="w-8 h-8 text-glacier-cyan" />, temp: '9°C', low: '4°C', rain: '80%', wind: '5 m/s', sunrise: '06:18', sunset: '20:41' },
    { day: 'Wed', icon: <Cloud className="w-8 h-8 text-gray-300" />, temp: '10°C', low: '5°C', rain: '20%', wind: '2 m/s', sunrise: '06:21', sunset: '20:38' },
    { day: 'Thu', icon: <Sun className="w-8 h-8 text-amber-400" />, temp: '14°C', low: '7°C', rain: '0%', wind: '4 m/s', sunrise: '06:24', sunset: '20:34' },
    { day: 'Fri', icon: <Cloud className="w-8 h-8 text-gray-300" />, temp: '11°C', low: '6°C', rain: '10%', wind: '3 m/s', sunrise: '06:27', sunset: '20:31' },
    { day: 'Sat', icon: <Snowflake className="w-8 h-8 text-white" />, temp: '2°C', low: '-3°C', rain: '40%', wind: '7 m/s', sunrise: '06:30', sunset: '20:28' },
    { day: 'Sun', icon: <Sun className="w-8 h-8 text-amber-400" />, temp: '5°C', low: '-1°C', rain: '0%', wind: '2 m/s', sunrise: '06:33', sunset: '20:24' },
  ];

  return (
    <div className="min-h-screen bg-slate text-white pb-24">
      {/* Hero */}
      <div className="relative h-[80vh]">
        <CinematicBackground 
          imageUrl="/images/kjeragbolten_1786936275605.jpg"
          overlayOpacity={0.4}
          theme="glacierCyan"
        />
        
        <div className="absolute inset-0 flex flex-col justify-between pt-32 pb-16">
          <Container>
            <div className="flex justify-between items-start">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl md:text-8xl font-display font-bold text-white mb-2 drop-shadow-2xl"
                >
                  Tromsø
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl md:text-2xl text-gray-200 font-light flex items-center gap-2 drop-shadow-xl"
                >
                  <MapPin className="w-5 h-5 text-glacier-cyan" /> Arctic Circle, Norway
                </motion.p>
              </div>
              <div className="text-right">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-7xl md:text-9xl font-display font-bold text-white drop-shadow-2xl"
                >
                  12°
                </motion.div>
                <p className="text-xl text-glacier-cyan font-bold drop-shadow-xl mt-2">Partly Cloudy</p>
              </div>
            </div>
          </Container>

          <Container>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-6 rounded-3xl grid grid-cols-2 md:grid-cols-5 gap-6 border border-white/20"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2"><Thermometer className="w-3 h-3 text-glacier-cyan"/> Feels Like</span>
                <span className="text-xl font-bold">9°C</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2"><Wind className="w-3 h-3 text-glacier-cyan"/> Wind</span>
                <span className="text-xl font-bold">3.2 m/s NW</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2"><Droplets className="w-3 h-3 text-glacier-cyan"/> Humidity</span>
                <span className="text-xl font-bold">78%</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2"><Sun className="w-3 h-3 text-glacier-cyan"/> UV Index</span>
                <span className="text-xl font-bold">2 (Low)</span>
              </div>
              <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-400 flex items-center gap-1"><Sunrise className="w-3 h-3"/> 06:15</span>
                  <span className="text-gray-400 flex items-center gap-1">20:45 <Sunset className="w-3 h-3"/></span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1 mt-1 relative overflow-hidden">
                  <div className="bg-glacier-cyan h-full w-[40%]" />
                </div>
              </div>
            </motion.div>
          </Container>
        </div>
      </div>

      <Container className="pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 flex flex-col gap-12">
            {/* Environmental Map */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
                <MapIcon className="w-6 h-6 text-glacier-cyan" /> Weather Radar
              </h2>
              <div className="glass-panel rounded-3xl overflow-hidden h-[500px] flex flex-col relative border border-glacier-cyan/20">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200')] bg-cover bg-center opacity-40 mix-blend-luminosity grayscale" />
                <div className="absolute inset-0 bg-slate/80 mix-blend-overlay" />
                
                {/* Fake Radar Overlays */}
                {activeLayer === 'Rain' && (
                  <div className="absolute top-1/4 left-1/3 w-[300px] h-[200px] bg-blue-500/30 blur-[40px] rounded-[100%] animate-pulse mix-blend-screen" />
                )}
                {activeLayer === 'Temperature' && (
                  <div className="absolute top-1/2 left-1/2 w-[400px] h-[300px] bg-red-500/20 blur-[60px] rounded-[100%] mix-blend-screen -translate-x-1/2 -translate-y-1/2" />
                )}
                {activeLayer === 'Wind' && (
                  <div className="absolute inset-0 overflow-hidden">
                     {/* Fake wind particles using simple divs */}
                     {windParticles.map((particle) => (
                       <div 
                         key={particle.id} 
                         className="absolute w-20 h-0.5 bg-white/20 blur-[1px] rounded-full animate-pulse"
                         style={{ 
                           top: particle.top, 
                           left: particle.left,
                           transform: 'rotate(-15deg)',
                           animationDelay: particle.delay,
                           animationDuration: particle.duration
                         }} 
                       />
                     ))}
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-glacier-cyan" /> {activeLayer} Layer Loading...
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 overflow-x-auto pb-2 hide-scrollbar">
                  <div className="bg-black/60 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex gap-2 w-max">
                    {['Temperature', 'Rain', 'Snow', 'Wind', 'Clouds', 'Visibility'].map(layer => (
                      <button 
                        key={layer}
                        onClick={() => setActiveLayer(layer)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${activeLayer === layer ? 'bg-glacier-cyan text-slate' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                      >
                        {layer}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24">
              <h2 className="text-3xl font-display font-bold mb-8">7-Day Forecast</h2>
              
              <div className="flex flex-col gap-4">
                {forecast.map((f, i) => (
                  <motion.div 
                    key={f.day}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-panel p-4 rounded-2xl flex items-center justify-between group hover:border-glacier-cyan/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 w-1/3">
                      <span className="font-bold text-lg w-10">{f.day}</span>
                      {f.icon}
                    </div>
                    
                    <div className="flex items-center gap-4 w-1/3 justify-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-400 mb-1"><Droplets className="w-3 h-3"/></span>
                        <span className="text-sm font-bold text-glacier-cyan">{f.rain}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-400 mb-1"><Wind className="w-3 h-3"/></span>
                        <span className="text-sm font-bold text-white">{f.wind}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-3 w-1/3">
                      <span className="text-gray-400 text-sm">{f.low}</span>
                      <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-glacier-cyan/50 to-white w-full" />
                      </div>
                      <span className="font-bold text-lg">{f.temp}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};
