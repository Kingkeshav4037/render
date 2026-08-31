import { Cloud, Sun, Thermometer, Wind } from 'lucide-react';

interface DestinationWeatherProps {
  name: string;
  lat: number;
}

export const DestinationWeather = ({ name, lat }: DestinationWeatherProps) => {
  // Mock weather data based on latitude
  const isArctic = lat > 66.5;
  
  const seasonInfo = isArctic ? {
    bestTime: 'May to August (Midnight Sun) or Oct to March (Northern Lights)',
    temp: '-5°C to 15°C',
    weather: 'Arctic climate, highly variable',
  } : {
    bestTime: 'June to August (Summer) or Dec to March (Winter Sports)',
    temp: '0°C to 22°C',
    weather: 'Coastal/Continental climate',
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm h-full">
      <h3 className="text-2xl font-bold text-navy-900 mb-6">{name ? `${name} Climate & Best Time` : 'Climate & Best Time'}</h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-50/50 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Sun size={20} />
            <span className="font-semibold">Best Time to Visit</span>
          </div>
          <p className="text-navy-900 font-medium">{seasonInfo.bestTime}</p>
        </div>

        <div className="bg-orange-50/50 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Thermometer size={20} />
            <span className="font-semibold">Average Temps</span>
          </div>
          <p className="text-navy-900 font-medium">{seasonInfo.temp}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Cloud size={20} />
            <span className="font-semibold">General Climate</span>
          </div>
          <p className="text-navy-900 font-medium">{seasonInfo.weather}</p>
        </div>

        <div className="bg-cyan-50/50 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-cyan-600 mb-2">
            <Wind size={20} />
            <span className="font-semibold">Conditions</span>
          </div>
          <p className="text-navy-900 font-medium">Bring layers. Weather changes quickly.</p>
        </div>
      </div>
    </div>
  );
};
