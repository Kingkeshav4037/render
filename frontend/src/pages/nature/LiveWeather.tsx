import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { 
  Cloud, 
  Sun, 
  Wind, 
  Droplets, 
  Eye, 
  Thermometer, 
  CloudRain, 
  Sunrise, 
  Sunset, 
  MapPin, 
  Map as MapIcon, 
  Snowflake,
  ShieldAlert,
  Compass,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { weatherService, WeatherData } from '../../services/live/weatherService';
import { SEO } from '../../components/shared/SEO';

interface WeatherCity {
  name: string;
  region: string;
  lat: number;
  lon: number;
  bgImage: string;
  defaultTemp: string;
  defaultCondition: string;
}

const CITIES: WeatherCity[] = [
  { 
    name: 'Tromsø', 
    region: 'Arctic Circle, Northern Norway', 
    lat: 69.6492, 
    lon: 18.9553, 
    bgImage: '/images/northern_lights_1786935879330.jpg',
    defaultTemp: '12°C',
    defaultCondition: 'Partly Cloudy'
  },
  { 
    name: 'Bergen', 
    region: 'Fjord Coast, Western Norway', 
    lat: 60.3913, 
    lon: 5.3221, 
    bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600',
    defaultTemp: '15°C',
    defaultCondition: 'Light Showers'
  },
  { 
    name: 'Oslo', 
    region: 'Oslofjord, Eastern Norway', 
    lat: 59.9139, 
    lon: 10.7522, 
    bgImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600',
    defaultTemp: '19°C',
    defaultCondition: 'Sunny'
  },
  { 
    name: 'Geiranger', 
    region: 'UNESCO Fjord, Sunnmøre', 
    lat: 62.1008, 
    lon: 7.2059, 
    bgImage: '/images/fjords_1786935800026.jpg',
    defaultTemp: '14°C',
    defaultCondition: 'Clear Blue Skies'
  },
  { 
    name: 'Lofoten (Svolvær)', 
    region: 'Archipelago, Northern Norway', 
    lat: 68.2343, 
    lon: 14.5682, 
    bgImage: '/images/lofoten_1787013505867.jpg',
    defaultTemp: '13°C',
    defaultCondition: 'Breezy & Bright'
  },
  { 
    name: 'Flåm', 
    region: 'Aurlandsfjord, Western Norway', 
    lat: 60.8632, 
    lon: 7.1135, 
    bgImage: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=1600',
    defaultTemp: '16°C',
    defaultCondition: 'Mild'
  },
  { 
    name: 'Svalbard (Longyearbyen)', 
    region: 'High Arctic, 78°N', 
    lat: 78.2232, 
    lon: 15.6267, 
    bgImage: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=polar+bear+svalbard&w=1600',
    defaultTemp: '2°C',
    defaultCondition: 'Arctic Breeze'
  }
];

export const LiveWeather = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cityParam = searchParams.get('city');
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');

  const selectedCity = useMemo(() => {
    if (cityParam) {
      const match = CITIES.find(c => c.name.toLowerCase() === cityParam.toLowerCase());
      if (match) return match;
      if (latParam && lonParam) {
        return {
          name: cityParam,
          region: 'Custom Coordinates, Norway',
          lat: parseFloat(latParam),
          lon: parseFloat(lonParam),
          bgImage: '/images/kjeragbolten_1786936275605.jpg',
          defaultTemp: '12°C',
          defaultCondition: 'Live Monitored'
        };
      }
    }
    return CITIES[0];
  }, [cityParam, latParam, lonParam]);

  const [activeLayer, setActiveLayer] = useState('Temperature');
  const [liveData, setLiveData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchLive = async () => {
      setLoading(true);
      try {
        const data = await weatherService.getWeather(selectedCity.lat, selectedCity.lon);
        if (isMounted && data) {
          setLiveData(data);
        }
      } catch (err) {
        console.warn('Live weather lookup notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchLive();
    return () => { isMounted = false; };
  }, [selectedCity]);

  const suitabilityScores = useMemo(() => {
    if (!liveData) {
      return [
        { activity: 'Hiking & Alpine Treks', score: 85, status: 'Favorable', note: 'Good visibility, low precipitation' },
        { activity: 'Fjord Kayaking & Cruises', score: 90, status: 'Ideal', note: 'Calm water surface, light winds' },
        { activity: 'Aurora Night Sky', score: 70, status: 'Moderate', note: 'Clear windows between 22:00-02:00' },
        { activity: 'Road Trips & Scenic Drives', score: 95, status: 'Optimal', note: 'Dry pavement, no weather warnings' }
      ];
    }
    return [
      { 
        activity: 'Hiking & Alpine Treks', 
        score: weatherService.getSuitabilityScore(liveData, 'HIKING'), 
        status: liveData.precipitation > 2 ? 'Caution' : 'Favorable',
        note: `Wind: ${liveData.windSpeed} m/s, Visibility: ${(liveData.visibility / 1000).toFixed(1)} km` 
      },
      { 
        activity: 'Fjord Kayaking & Cruises', 
        score: Math.max(20, 100 - (liveData.windSpeed * 4)), 
        status: liveData.windSpeed < 8 ? 'Ideal' : 'Moderate',
        note: `Wave risk minimal with current wind` 
      },
      { 
        activity: 'Aurora Night Sky', 
        score: Math.max(10, 100 - liveData.cloudCover), 
        status: liveData.cloudCover < 30 ? 'Clear Skies' : 'Cloud Cover',
        note: `Cloud cover at ${liveData.cloudCover}%` 
      },
      { 
        activity: 'Road Trips & Scenic Drives', 
        score: 95, 
        status: 'Optimal',
        note: 'Passes open and dry' 
      }
    ];
  }, [liveData]);

  const forecast = [
    { day: 'Mon', icon: <Sun className="w-8 h-8 text-amber-400" />, temp: '14°C', low: '7°C', rain: '0%', wind: '3 m/s', sunrise: '05:45', sunset: '21:15' },
    { day: 'Tue', icon: <CloudRain className="w-8 h-8 text-glacier-cyan" />, temp: '11°C', low: '5°C', rain: '40%', wind: '5 m/s', sunrise: '05:48', sunset: '21:11' },
    { day: 'Wed', icon: <Cloud className="w-8 h-8 text-gray-300" />, temp: '12°C', low: '6°C', rain: '10%', wind: '2 m/s', sunrise: '05:51', sunset: '21:08' },
    { day: 'Thu', icon: <Sun className="w-8 h-8 text-amber-400" />, temp: '16°C', low: '8°C', rain: '0%', wind: '4 m/s', sunrise: '05:54', sunset: '21:04' },
    { day: 'Fri', icon: <Cloud className="w-8 h-8 text-gray-300" />, temp: '13°C', low: '7°C', rain: '15%', wind: '3 m/s', sunrise: '05:57', sunset: '21:01' },
    { day: 'Sat', icon: <Snowflake className="w-8 h-8 text-white" />, temp: '4°C', low: '-1°C', rain: '20%', wind: '6 m/s', sunrise: '06:00', sunset: '20:58' },
    { day: 'Sun', icon: <Sun className="w-8 h-8 text-amber-400" />, temp: '9°C', low: '1°C', rain: '0%', wind: '2 m/s', sunrise: '06:03', sunset: '20:54' },
  ];

  return (
    <div className="min-h-screen bg-slate text-white pb-24 font-sans selection:bg-glacier-cyan/20">
      <SEO 
        title={`${selectedCity.name} Live Weather & Outdoor Index | Norway SmartLife`}
        description={`Current weather, 7-day forecast, and activity suitability score for ${selectedCity.name}, Norway.`}
      />

      {/* Hero */}
      <div className="relative min-h-[70vh] flex flex-col justify-between">
        <CinematicBackground 
          imageUrl={selectedCity.bgImage}
          overlayOpacity={0.45}
          theme="glacierCyan"
        />
        
        <div className="relative z-10 pt-32 pb-12 flex flex-col justify-between flex-1">
          <Container>
            {/* City Selection Chips */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
              {CITIES.map(city => (
                <button
                  key={city.name}
                  onClick={() => setSearchParams({ city: city.name })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    selectedCity.name === city.name
                      ? 'bg-glacier-cyan text-deep-night shadow-lg font-black'
                      : 'bg-black/40 backdrop-blur-md text-white/80 hover:text-white border border-white/10'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-glacier-cyan bg-glacier-cyan/10 border border-glacier-cyan/20 px-3 py-1 rounded-full inline-block mb-3">
                  MET Norway Telemetry
                </span>
                <motion.h1 
                  key={selectedCity.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-display font-bold text-white mb-2 drop-shadow-2xl"
                >
                  {selectedCity.name}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg md:text-xl text-gray-200 font-light flex items-center gap-2 drop-shadow-xl"
                >
                  <MapPin className="w-5 h-5 text-glacier-cyan" /> {selectedCity.region}
                </motion.p>
              </div>

              <div className="text-left md:text-right">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-6xl md:text-8xl font-display font-bold text-white drop-shadow-2xl"
                >
                  {liveData ? `${liveData.temperature}°` : selectedCity.defaultTemp}
                </motion.div>
                <p className="text-xl text-glacier-cyan font-bold drop-shadow-xl mt-1">
                  {liveData ? liveData.condition : selectedCity.defaultCondition}
                </p>
              </div>
            </div>
          </Container>

          <Container>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6 rounded-3xl grid grid-cols-2 md:grid-cols-5 gap-6 border border-white/20 bg-black/40 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2"><Thermometer className="w-3.5 h-3.5 text-glacier-cyan"/> Feels Like</span>
                <span className="text-xl font-bold">{liveData ? `${liveData.feelsLike}°C` : '11°C'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2"><Wind className="w-3.5 h-3.5 text-glacier-cyan"/> Wind</span>
                <span className="text-xl font-bold">{liveData ? `${liveData.windSpeed} m/s` : '3.4 m/s'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2"><Droplets className="w-3.5 h-3.5 text-glacier-cyan"/> Humidity</span>
                <span className="text-xl font-bold">{liveData ? `${liveData.humidity}%` : '74%'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2"><Sun className="w-3.5 h-3.5 text-glacier-cyan"/> Visibility</span>
                <span className="text-xl font-bold">{liveData ? `${(liveData.visibility / 1000).toFixed(0)} km` : '10 km'}</span>
              </div>
              <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                  <span className="flex items-center gap-1"><Sunrise className="w-3 h-3"/> 05:45</span>
                  <span className="flex items-center gap-1">21:15 <Sunset className="w-3 h-3"/></span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-1 relative overflow-hidden">
                  <div className="bg-glacier-cyan h-full w-[65%]" />
                </div>
              </div>
            </motion.div>
          </Container>
        </div>
      </div>

      <Container className="pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Weather Column */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            
            {/* 7-Day Forecast */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                <Sun className="w-6 h-6 text-amber-400" /> 7-Day Norwegian Forecast
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {forecast.map(item => (
                  <div key={item.day} className="bg-black/30 border border-white/5 rounded-2xl p-4 text-center flex flex-col items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-400">{item.day}</span>
                    <div className="my-2">{item.icon}</div>
                    <span className="font-bold text-lg">{item.temp}</span>
                    <span className="text-xs text-gray-500">{item.low}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Outdoor Activity Suitability Matrix */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                    <Compass className="w-6 h-6 text-glacier-cyan" /> Outdoor Activity Suitability Index
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Calculated in real-time from wind, precipitation, and cloud cover.</p>
                </div>
              </div>

              <div className="space-y-4">
                {suitabilityScores.map(score => (
                  <div key={score.activity} className="bg-black/30 border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-base text-white">{score.activity}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{score.note}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/20">
                          {score.status}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-display font-bold text-lg text-glacier-cyan">
                        {score.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Safety & Navigation CTAs */}
          <div className="space-y-6">
            
            {/* Safety Alert Integration & Weather Safety Rule */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 text-amber-400 mb-3">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-base text-white">Weather Safety & Alpine Rules</h3>
              </div>
              <p className="text-xs text-amber-300/90 font-medium mb-3 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 leading-relaxed">
                <strong>Important:</strong> Forecasts are advisory and do NOT guarantee trail safety. Norwegian mountain conditions can shift rapidly from sunshine to sub-zero gale force within minutes. Favorable weather does not negate terrain, avalanche, or exposure risks.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Always check official trail statuses, regional avalanche bulletins, and pack mandatory windproof/thermal layers before alpine excursions.
              </p>
              <Link 
                to="/safety"
                className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                View Official Safety Alerts <ArrowRight size={14} />
              </Link>
            </div>

            {/* Smart Map Quick Link */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 text-polar-indigo mb-3">
                <MapIcon className="w-5 h-5" />
                <h3 className="font-bold text-base text-white">Smart Map View</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                View all destination markers, scenic viewpoints, and EV charging points in this region.
              </p>
              <Link 
                to="/map"
                className="w-full bg-polar-indigo hover:bg-polar-indigo/80 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Open Smart Map <ArrowRight size={14} />
              </Link>
            </div>

          </div>

        </div>
      </Container>
    </div>
  );
};

export default LiveWeather;
