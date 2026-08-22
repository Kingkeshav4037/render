import React from 'react';
import { WeatherForecast } from '../../../types/dashboard';
import { CloudSnow, Wind, Eye, Sunrise, Sunset } from 'lucide-react';

interface Props {
  weather: WeatherForecast | null;
}

export const WeatherWidget: React.FC<Props> = ({ weather }) => {
  if (!weather) return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-center items-center text-center">
      <CloudSnow size={32} className="text-gray-300 mb-2" />
      <p className="text-gray-500 font-medium">Weather data temporarily unavailable</p>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-blue-900 to-navy-900 rounded-2xl p-6 shadow-sm h-full text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-blue-200 font-medium tracking-wide uppercase text-xs mb-1">CURRENT WEATHER</p>
          <h3 className="text-xl font-bold">{weather.location}</h3>
        </div>
        <CloudSnow size={36} className="text-blue-200" />
      </div>
      
      <div className="flex items-end gap-3 mb-6">
        <span className="text-5xl font-bold">{weather.temperature}°</span>
        <span className="text-xl text-blue-200 font-medium pb-1">{weather.condition}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-blue-100">
          <Wind size={16} /> {weather.windSpeed} km/h
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-100">
          <Eye size={16} /> {weather.visibility} km
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-100">
          <Sunrise size={16} /> {weather.sunrise}
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-100">
          <Sunset size={16} /> {weather.sunset}
        </div>
      </div>
      
      <div className="pt-4 border-t border-blue-800/50 flex justify-between">
        {weather.forecast.map((f, i) => (
          <div key={i} className="text-center">
            <p className="text-xs text-blue-200 font-medium mb-1">{f.day}</p>
            <p className="font-bold">{f.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};
