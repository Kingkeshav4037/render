import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CloudSun, Calendar, Plus, Heart, MapPin, X, Bookmark, Compass, Sparkles } from 'lucide-react';
import { OptimizedImage } from '../../../components/shared/OptimizedImage';
import { SEO } from '../../../components/shared/SEO';
import { toast } from 'sonner';

interface SavedTrip {
  id: string;
  name: string;
  title: string;
  dates: string;
  startDate?: string;
  endDate?: string;
  nights: number;
  activities: number;
  status: string;
  image: string;
  weather?: string;
  summary?: string;
  destinations?: string[];
  activitiesList?: Array<{ id: string; title: string; time?: string; location: string; cost?: number }>;
  staysList?: Array<{ id: string; name: string; location: string; nights?: number }>;
  notes?: string;
  days?: any[];
}

const DEFAULT_TRIPS: SavedTrip[] = [
  {
    id: '1',
    name: 'Lofoten',
    title: 'Lofoten Alpine & Fjord Expedition',
    dates: '12 — 18 September',
    startDate: '2026-09-12',
    endDate: '2026-09-18',
    nights: 6,
    activities: 3,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1513519107127-1ea506ce3c53?auto=format&fit=crop&q=80',
    weather: '12°C',
    summary: 'An expedition through the jagged granite peaks, arctic beaches, and historic rorbu fishing villages of the Lofoten archipelago.',
    destinations: ['Svolvær', 'Reine', 'Henningsvær'],
    notes: 'Remember to pack sturdy hiking boots and waterproof shell layers for Reinebringen.'
  },
  {
    id: '2',
    name: 'Tromsø',
    title: 'Tromsø Arctic Lights & Fjellheisen',
    dates: '15 — 20 January',
    startDate: '2026-01-15',
    endDate: '2026-01-20',
    nights: 5,
    activities: 4,
    status: 'Past',
    image: 'https://images.unsplash.com/photo-1579893963495-9b7e7193b2a2?auto=format&fit=crop&q=80',
    weather: '-5°C',
    summary: 'Chasing the Aurora Borealis in the Arctic Circle with cable car panoramas and cultural heritage.',
    destinations: ['Tromsø', 'Kvaløya', 'Ersfjordbotn'],
    notes: 'Thermal merino wool layers are essential.'
  }
];

export const TripsList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'trips' | 'favorites'>('trips');
  const [trips, setTrips] = useState<SavedTrip[]>(DEFAULT_TRIPS);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [newTripName, setNewTripName] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newDest, setNewDest] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const loadSavedData = () => {
    try {
      const savedTripsStr = localStorage.getItem('nsl_user_saved_trips');
      if (savedTripsStr) {
        const saved = JSON.parse(savedTripsStr);
        if (Array.isArray(saved) && saved.length > 0) {
          const merged = [...saved, ...DEFAULT_TRIPS.filter(dt => !saved.some((st: any) => st.id === dt.id))];
          setTrips(merged);
        } else {
          setTrips(DEFAULT_TRIPS);
        }
      } else {
        setTrips(DEFAULT_TRIPS);
      }

      const savedFavsStr = localStorage.getItem('nsl_user_favorites');
      if (savedFavsStr) {
        const favs = JSON.parse(savedFavsStr);
        if (Array.isArray(favs)) setFavorites(favs);
      } else {
        setFavorites([
          { id: 'fav-1', type: 'DESTINATION', title: 'Geirangerfjord', region: 'Fjord Norway', image: '/images/besseggen_1786936236965.jpg', url: '/destinations/geirangerfjord' },
          { id: 'fav-2', type: 'ACTIVITY', title: 'Preikestolen Guided Sunrise Hike', region: 'Rogaland', image: '/images/preikestolen_1786936002797.jpg', url: '/activities' }
        ]);
      }
    } catch (e) {
      console.warn('Error reading saved trips or favorites:', e);
      setTrips(DEFAULT_TRIPS);
    }
  };

  useEffect(() => {
    loadSavedData();
  }, []);

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripName.trim()) {
      toast.error('Please enter a trip name.');
      return;
    }
    if (!newStartDate || !newEndDate) {
      toast.error('Please select both start and end dates.');
      return;
    }
    if (new Date(newEndDate) < new Date(newStartDate)) {
      toast.error('End date cannot be earlier than start date.');
      return;
    }

    const startD = new Date(newStartDate);
    const endD = new Date(newEndDate);
    const diffDays = Math.max(1, Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)));

    const dateFormatted = `${startD.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — ${endD.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

    const newTrip: SavedTrip = {
      id: `trip-custom-${Date.now()}`,
      name: newTripName.trim(),
      title: `${newTripName.trim()} Journey`,
      dates: dateFormatted,
      startDate: newStartDate,
      endDate: newEndDate,
      nights: diffDays,
      activities: 0,
      status: 'Upcoming',
      image: '/images/besseggen_1786936236965.jpg',
      weather: '14°C',
      summary: newNotes ? newNotes.trim() : `Custom itinerary planned for ${newDest || 'Norway'}.`,
      destinations: newDest ? [newDest.trim()] : ['Norway'],
      notes: newNotes.trim(),
      activitiesList: [],
      staysList: []
    };

    try {
      const existingStr = localStorage.getItem('nsl_user_saved_trips');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [newTrip, ...existing];
      localStorage.setItem('nsl_user_saved_trips', JSON.stringify(updated));
      setTrips(prev => [newTrip, ...prev]);
      setIsCreateModalOpen(false);
      
      // Reset fields
      setNewTripName('');
      setNewStartDate('');
      setNewEndDate('');
      setNewDest('');
      setNewNotes('');

      toast.success(`Trip "${newTrip.name}" created successfully!`);
      navigate(`/trips/${newTrip.id}`);
    } catch (err) {
      toast.error('Failed to create trip.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      <SEO 
        title="My Trips & Travel Collections | Norway SmartLife"
        description="Manage your custom planned itineraries, saved expeditions, and favorite Norwegian spots."
      />

      {/* Editorial Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-light text-navy-900 tracking-tight">
            Digital Travel <span className="font-bold">Journal</span>.
          </h1>
          <p className="mt-4 text-lg text-gray-500">Your custom planned itineraries and curated favorite places.</p>
          
          {/* Section Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('trips')}
              className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'trips'
                  ? 'border-navy-900 text-navy-900'
                  : 'border-transparent text-gray-400 hover:text-navy-900'
              }`}
            >
              Planned Trips ({trips.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'favorites'
                  ? 'border-navy-900 text-navy-900'
                  : 'border-transparent text-gray-400 hover:text-navy-900'
              }`}
            >
              <Heart size={14} className={activeTab === 'favorites' ? 'fill-red-500 text-red-500' : ''} /> Saved Favorites ({favorites.length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-navy-900 text-white hover:bg-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
          >
            <Plus size={16} /> Create Trip
          </button>
          <button
            onClick={() => navigate('/planner')}
            className="bg-gray-100 text-navy-900 hover:bg-gray-200 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles size={16} className="text-glacier-cyan" /> AI Planner
          </button>
        </div>
      </div>

      {activeTab === 'trips' ? (
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {trips.map((trip, idx) => (
            <div 
              key={trip.id} 
              className="group relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.04)] bg-white cursor-pointer" 
              onClick={() => navigate(`/trips/${trip.id}`)}
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="absolute inset-0">
                <OptimizedImage 
                  src={trip.image || '/images/besseggen_1786936236965.jpg'} 
                  alt={trip.name} 
                  category="landscape"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent pointer-events-none"></div>
              </div>
              
              <div className="relative p-8 md:p-10 min-h-[450px] flex flex-col justify-between">
                
                <div className="flex justify-between items-start">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md ${
                    trip.status === 'Upcoming' ? 'bg-aurora-green/90 text-navy-900' : 'bg-white/20 text-white'
                  }`}>
                    {trip.status}
                  </span>
                  <span className="flex items-center gap-1 text-white bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                    <CloudSun size={12}/> {trip.weather || '12°C'}
                  </span>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/80 font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-2">
                      <Calendar size={14} /> {trip.dates}
                    </p>
                    <h3 className="text-4xl md:text-5xl font-display font-black text-white leading-none mb-3 truncate max-w-[240px]">
                      {trip.name}
                    </h3>
                    <p className="text-white/70 font-medium text-sm">{trip.nights} days · {trip.activities} activities</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-navy-900 transition-colors shrink-0">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* New Trip Planner Card */}
          <div 
            className="rounded-[32px] overflow-hidden border-2 border-dashed border-gray-200 hover:border-aurora-green hover:bg-aurora-green/5 bg-gray-50 cursor-pointer flex flex-col items-center justify-center text-center p-12 transition-all min-h-[450px]"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-navy-900 mb-6">
              <Plus size={24} />
            </div>
            <h3 className="text-2xl font-display font-bold text-navy-900 mb-2">Create a new trip</h3>
            <p className="text-gray-500 text-sm max-w-xs">Organize your dates, destinations, activities, and stays into a structured itinerary.</p>
          </div>

        </div>
      ) : (
        /* Saved Favorites View */
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <div 
                key={fav.id}
                onClick={() => fav.url && navigate(fav.url)}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="h-48 relative overflow-hidden">
                  <img src={fav.image} alt={fav.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                    {fav.type}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold text-navy-900 mb-1">{fav.title}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                    <MapPin size={12} className="text-blue-500" /> {fav.region}
                  </p>
                  <span className="text-xs font-bold text-navy-900 flex items-center gap-1 group-hover:text-blue-600">
                    View Details <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-400">
              <Heart size={32} className="mx-auto mb-3 opacity-40" />
              <p>You haven't saved any favorite destinations or activities yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Create Trip Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-navy-900 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Create New Trip</h2>
            <p className="text-xs text-gray-500 mb-6">Build a structured travel itinerary with your dates and destinations.</p>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Trip Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Norway Summer Fjord Odyssey"
                  value={newTripName}
                  onChange={(e) => setNewTripName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy-900 text-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-navy-900 text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-navy-900 text-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Primary Destination / Region
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Bergen, Geirangerfjord, Lofoten"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy-900 text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Trip Description & Notes
                </label>
                <textarea 
                  rows={3}
                  placeholder="Notes on gear, travel companions, or key highlights..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy-900 text-navy-900"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-navy-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer shadow-md"
                >
                  Save Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsList;
