import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Map, 
  MapPin, 
  Calendar, 
  Plus, 
  Sun, 
  Trash2, 
  Edit3, 
  X, 
  Activity as ActivityIcon, 
  Home, 
  FileText,
  Share2,
  Printer,
  Download,
  Copy,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { OptimizedImage } from '../../../components/shared/OptimizedImage';
import { SEO } from '../../../components/shared/SEO';
import { toast } from 'sonner';
import { tripService } from '../../../services/tripService';
import { tripExportService } from '../../../services/tripExportService';
import { ShareTripModal } from '../../../components/trips/ShareTripModal';

const DEFAULT_TRIP_DETAILS: Record<string, any> = {
  '1': {
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
    notes: 'Remember to pack sturdy hiking boots and waterproof shell layers for Reinebringen.',
    activitiesList: [
      { id: 'act-1', title: 'Reinebringen Summit Hike', time: '09:30', location: 'Reine', desc: '1,560 Sherpa stone steps to 360° panoramic viewpoint.', cost: 0 },
      { id: 'act-2', title: 'Rowing Boat in Reinefjorden', time: '14:00', location: 'Reine', desc: 'Glacial fjord waters beneath dramatic granite peaks.', cost: 450 },
      { id: 'act-3', title: 'Stockfish Dinner at Børsen Spiseri', time: '19:00', location: 'Svolvær', desc: 'Historic 1828 fish warehouse dining.', cost: 650 }
    ],
    staysList: [
      { id: 'stay-1', name: 'Nusfjord Arctic Resort (Rorbu Cabin)', location: 'Nusfjord', nights: 3 },
      { id: 'stay-2', name: 'Svinøya Rorbuer', location: 'Svolvær', nights: 3 }
    ],
    days: [
      {
        day: 1,
        date: '12 September',
        title: 'Arrival & Settling In',
        weather: '12°C • Partly Cloudy',
        activities: [
          { time: '14:00', title: 'Arrival at Svolvær Harbor', location: 'Svolvær, Lofoten', desc: 'Check in and orient yourself with the coastal waterfront.' },
          { time: '16:30', title: 'Check-in at Historic Rorbu Cabin', location: 'Svolvær', desc: 'Traditional wooden fishermen cabin on stilts.' },
          { time: '19:00', title: 'Dinner at Børsen Spiseri', location: 'Svolvær', desc: 'Locally caught stockfish in historic warehouse.' }
        ]
      },
      {
        day: 2,
        date: '13 September',
        title: 'Reine & Reinebringen Trek',
        weather: '14°C • Sunny',
        activities: [
          { time: '09:30', title: 'Reinebringen Summit Hike', location: 'Reine', desc: '1,560 Sherpa stone steps to 360° panoramic viewpoint.' },
          { time: '14:00', title: 'Rowing Boat in Reinefjorden', location: 'Reine', desc: 'Glacial fjord waters beneath dramatic granite peaks.' }
        ]
      }
    ]
  },
  '2': {
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
    notes: 'Thermal merino wool layers are essential.',
    activitiesList: [
      { id: 'act-201', title: 'Fjellheisen Cable Car Ascent', time: '15:00', location: 'Tromsø', desc: 'Ascend to Storsteinen for views over Tromsø island.', cost: 395 },
      { id: 'act-202', title: 'Arctic Cathedral Organ Recital', time: '18:00', location: 'Tromsdalen', desc: 'Stunning acoustics and modernist architecture.', cost: 80 },
      { id: 'act-203', title: 'Northern Lights Fjord Hunt', time: '21:00', location: 'Ersfjordbotn', desc: 'Chasing auroras away from city light pollution.', cost: 1100 }
    ],
    staysList: [
      { id: 'stay-201', name: 'Clarion Hotel The Edge', location: 'Tromsø Harbor', nights: 5 }
    ],
    days: [
      {
        day: 1,
        date: '15 January',
        title: 'Arctic Arrival & Fjellheisen',
        weather: '-5°C • Clear & Crisp',
        activities: [
          { time: '15:00', title: 'Fjellheisen Cable Car Ascent', location: 'Tromsø', desc: 'Ascend to Storsteinen for views over Tromsø island.' },
          { time: '18:00', title: 'Arctic Cathedral Organ Recital', location: 'Tromsdalen', desc: 'Stunning acoustics and modernist architecture.' },
          { time: '21:00', title: 'Northern Lights Fjord Hunt', location: 'Ersfjordbotn', desc: 'Chasing auroras away from city light pollution.' }
        ]
      }
    ]
  }
};

export const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit Dates Modal
  const [isEditDatesOpen, setIsEditDatesOpen] = useState(false);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  // Add Item Modal
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [itemType, setItemType] = useState<'activity' | 'stay' | 'destination'>('activity');
  const [itemTitle, setItemTitle] = useState('');
  const [itemLocation, setItemLocation] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemCost, setItemCost] = useState('');

  // Share Modal
  const [isShareOpen, setIsShareOpen] = useState(false);

  const loadTrip = useCallback(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const savedStr = localStorage.getItem('nsl_user_saved_trips');
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        const match = saved.find((t: any) => t.id === id);
        if (match) {
          setTrip(match);
          setEditStartDate(match.startDate || '');
          setEditEndDate(match.endDate || '');
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading saved trips:', e);
    }

    if (DEFAULT_TRIP_DETAILS[id]) {
      const def = DEFAULT_TRIP_DETAILS[id];
      setTrip(def);
      setEditStartDate(def.startDate || '');
      setEditEndDate(def.endDate || '');
    } else {
      setTrip(null);
    }
    setLoading(false);
  }, [id]);

  const handleDuplicateTrip = () => {
    if (!trip) return;
    try {
      const duplicated = {
        ...trip,
        id: `trip-${Date.now()}`,
        name: `${trip.name || trip.title} (Copy)`,
        title: `${trip.title || trip.name} (Copy)`,
        status: 'Planned',
      };
      const savedStr = localStorage.getItem('nsl_user_saved_trips');
      const saved = savedStr ? JSON.parse(savedStr) : [];
      localStorage.setItem('nsl_user_saved_trips', JSON.stringify([duplicated, ...saved]));
      toast.success('Trip duplicated successfully!');
      navigate(`/trips/${duplicated.id}`);
    } catch {
      toast.error('Failed to duplicate trip.');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    void (async () => {
      loadTrip();
    })();
  }, [loadTrip]);

  const saveUpdatedTrip = (updatedTrip: any) => {
    setTrip(updatedTrip);
    try {
      const savedStr = localStorage.getItem('nsl_user_saved_trips');
      const saved = savedStr ? JSON.parse(savedStr) : [];
      const updatedList = [updatedTrip, ...saved.filter((t: any) => t.id !== updatedTrip.id)];
      localStorage.setItem('nsl_user_saved_trips', JSON.stringify(updatedList));
    } catch (err) {
      console.warn('Error syncing updated trip to localStorage:', err);
    }
  };

  const handleUpdateDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStartDate || !editEndDate) {
      toast.error('Please select both start and end dates.');
      return;
    }
    if (new Date(editEndDate) < new Date(editStartDate)) {
      toast.error('End date cannot be earlier than start date.');
      return;
    }

    const startD = new Date(editStartDate);
    const endD = new Date(editEndDate);
    const diffDays = Math.max(1, Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)));
    const dateFormatted = `${startD.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — ${endD.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

    const updated = {
      ...trip,
      startDate: editStartDate,
      endDate: editEndDate,
      dates: dateFormatted,
      nights: diffDays
    };

    saveUpdatedTrip(updated);
    setIsEditDatesOpen(false);
    toast.success('Trip dates updated successfully! Saved items preserved.');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) {
      toast.error('Please enter a title.');
      return;
    }

    if (itemType === 'activity') {
      const activities = trip.activitiesList || [];
      if (activities.some((a: any) => a.title.toLowerCase() === itemTitle.trim().toLowerCase())) {
        toast.error('This activity is already in your trip.');
        return;
      }
      const newAct = {
        id: `act-${Date.now()}`,
        title: itemTitle.trim(),
        location: itemLocation.trim() || trip.name,
        desc: itemDesc.trim(),
        cost: itemCost ? parseFloat(itemCost) : 0,
        time: '10:00'
      };
      const updated = {
        ...trip,
        activitiesList: [...activities, newAct],
        activities: (trip.activities || 0) + 1
      };
      saveUpdatedTrip(updated);
      toast.success(`Activity "${newAct.title}" added to trip!`);
    } else if (itemType === 'stay') {
      const stays = trip.staysList || [];
      const newStay = {
        id: `stay-${Date.now()}`,
        name: itemTitle.trim(),
        location: itemLocation.trim() || trip.name,
        nights: 2
      };
      const updated = {
        ...trip,
        staysList: [...stays, newStay]
      };
      saveUpdatedTrip(updated);
      toast.success(`Stay "${newStay.name}" added to trip!`);
    } else if (itemType === 'destination') {
      const dests = trip.destinations || [];
      if (dests.includes(itemTitle.trim())) {
        toast.error('Destination already added.');
        return;
      }
      const updated = {
        ...trip,
        destinations: [...dests, itemTitle.trim()]
      };
      saveUpdatedTrip(updated);
      toast.success(`Destination "${itemTitle.trim()}" added to trip!`);
    }

    setIsAddItemOpen(false);
    setItemTitle('');
    setItemLocation('');
    setItemDesc('');
    setItemCost('');
  };

  const handleRemoveActivity = (actId: string) => {
    const updated = {
      ...trip,
      activitiesList: (trip.activitiesList || []).filter((a: any) => a.id !== actId),
      activities: Math.max(0, (trip.activities || 1) - 1)
    };
    saveUpdatedTrip(updated);
    toast.success('Activity removed from trip.');
  };

  const handleRemoveStay = (stayId: string) => {
    const updated = {
      ...trip,
      staysList: (trip.staysList || []).filter((s: any) => s.id !== stayId)
    };
    saveUpdatedTrip(updated);
    toast.success('Stay removed from trip.');
  };

  const handleDeleteTrip = () => {
    try {
      const savedStr = localStorage.getItem('nsl_user_saved_trips');
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        const updated = saved.filter((t: any) => t.id !== trip.id);
        localStorage.setItem('nsl_user_saved_trips', JSON.stringify(updated));
      }
      toast.success('Trip removed from your journal.');
      navigate('/trips');
    } catch {
      toast.error('Failed to remove trip.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-navy-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] font-sans flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-display font-bold text-navy-900 mb-4">Trip Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">The requested trip could not be found in your travel journal.</p>
        <Link to="/trips" className="bg-navy-900 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors">
          Back to Travel Journal
        </Link>
      </div>
    );
  }

  const activitiesList = trip.activitiesList || [];
  const staysList = trip.staysList || [];
  const destinations = trip.destinations || [trip.name];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      <SEO 
        title={`${trip.name || trip.title} | Travel Itinerary`}
        description={`Structured travel itinerary for ${trip.name} in Norway.`}
      />
      
      {/* Hero Header */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <OptimizedImage 
          src={trip.image || '/images/fjords_1786935800026.jpg'} 
          alt={trip.name} 
          category="landscape"
          fallbackSrc="/images/fjords_1786935800026.jpg"
          className="w-full h-full object-cover" 
          containerClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD] via-navy-900/40 to-navy-900/60 pointer-events-none"></div>
        
        <div className="absolute top-0 left-0 w-full p-6 md:p-12 flex justify-between items-center z-10">
          <button onClick={() => navigate('/trips')} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-navy-900 transition-colors cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-navy-900 backdrop-blur-md font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Share Trip Link"
            >
              <Share2 size={13} /> Share
            </button>
            <button
              onClick={() => tripExportService.exportToPDF({ trip, days: trip.days || [] })}
              className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-navy-900 backdrop-blur-md font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download or Print PDF"
            >
              <Printer size={13} /> PDF
            </button>
            <button
              onClick={() => tripExportService.exportToCalendar({ trip, days: trip.days || [] })}
              className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-navy-900 backdrop-blur-md font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export to Calendar (.ics)"
            >
              <Download size={13} /> iCal
            </button>
            <button
              onClick={handleDuplicateTrip}
              className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-navy-900 backdrop-blur-md font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Duplicate Trip"
            >
              <Copy size={13} /> Duplicate
            </button>
            <button
              onClick={() => setIsEditDatesOpen(true)}
              className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-navy-900 backdrop-blur-md font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 size={12} /> Edit Dates
            </button>
            <span className="px-3 py-1.5 rounded-full bg-aurora-green text-navy-900 font-bold text-xs uppercase tracking-widest">
              {trip.status || 'Planned'}
            </span>
            <button
              onClick={handleDeleteTrip}
              className="p-2 rounded-full bg-red-500/20 hover:bg-red-500 text-white border border-red-500/30 transition-all cursor-pointer"
              title="Delete Trip"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-[1440px] mx-auto z-10">
          <p className="text-white/80 font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-3 drop-shadow-md">
            <Calendar size={14} /> {trip.dates}
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-black text-navy-900 drop-shadow-sm leading-none mb-4 uppercase">
            {trip.name}
          </h1>
          {trip.summary && (
            <p className="text-navy-900/90 font-medium text-sm md:text-base max-w-2xl">{trip.summary}</p>
          )}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
        
        {/* Main Itinerary Content Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Smart Trip Warnings Panel */}
          {(() => {
            const formattedDays = (trip.days || []).map((d: any, idx: number) => ({
              id: `day-${idx}`,
              trip_id: trip.id,
              day_number: d.day || idx + 1,
              date: d.date || trip.startDate,
              description: d.title,
              activities: (d.activities || []).map((a: any, aIdx: number) => ({
                id: `act-${idx}-${aIdx}`,
                activity_title: a.title,
                activity_type: 'Activity',
                start_time: a.time ? `${d.date || '2026-09-12'}T${a.time}:00Z` : undefined,
                end_time: a.time ? `${d.date || '2026-09-12'}T${a.time}:00Z` : undefined,
                location: { name: a.location },
              })),
              stays: (trip.staysList || []).map((s: any) => ({
                id: s.id,
                accommodation_name: s.name,
                location: { name: s.location },
                check_in: trip.startDate,
                check_out: trip.endDate,
              })),
            }));

            const warnings = tripService.analyzeTripSchedule(formattedDays, trip);
            if (warnings.length === 0) return null;

            return (
              <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Smart Schedule Insights & Conflict Detection ({warnings.length})</span>
                </div>
                <div className="space-y-2">
                  {warnings.map(w => (
                    <div key={w.id} className="p-3.5 bg-white rounded-xl border border-amber-200 text-xs">
                      <div className="font-bold text-navy-900 flex items-center justify-between">
                        <span>{w.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${w.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
                          {w.severity}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{w.description}</p>
                      {w.recommendation && (
                        <p className="text-navy-900 font-semibold mt-1">💡 Tip: {w.recommendation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
          
          {/* Destinations Section */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-navy-900 flex items-center gap-2">
                <MapPin className="text-blue-500" size={20} /> Destinations in this Trip
              </h2>
              <button
                onClick={() => { setItemType('destination'); setIsAddItemOpen(true); }}
                className="text-xs font-bold text-navy-900 hover:text-blue-600 flex items-center gap-1 cursor-pointer uppercase tracking-wider"
              >
                <Plus size={14} /> Add Destination
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {destinations.map((dest: string, idx: number) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-navy-900 flex items-center gap-2">
                  <MapPin size={14} className="text-blue-500" />
                  {dest}
                </div>
              ))}
            </div>
          </div>

          {/* Activities Section */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-navy-900 flex items-center gap-2">
                  <ActivityIcon className="text-emerald-500" size={20} /> Saved Activities ({activitiesList.length})
                </h2>
                <p className="text-xs text-gray-500 mt-1">Scheduled adventures, hikes, and local experiences.</p>
              </div>
              <button
                onClick={() => { setItemType('activity'); setIsAddItemOpen(true); }}
                className="text-xs font-bold text-navy-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer uppercase tracking-wider transition-colors"
              >
                <Plus size={14} /> Add Activity
              </button>
            </div>

            <div className="space-y-4">
              {activitiesList.length > 0 ? (
                activitiesList.map((act: any) => (
                  <div key={act.id} className="p-5 bg-gray-50/70 border border-gray-100 rounded-2xl flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-base text-navy-900">{act.title}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                        <MapPin size={12} className="text-blue-500" /> {act.location} {act.time && `• ${act.time}`}
                      </p>
                      {act.desc && <p className="text-xs text-gray-600 mt-2 leading-relaxed">{act.desc}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {act.cost ? (
                        <span className="text-xs font-bold text-navy-900 bg-white border border-gray-200 px-3 py-1 rounded-lg">
                          {act.cost} NOK
                        </span>
                      ) : null}
                      <button
                        onClick={() => handleRemoveActivity(act.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove activity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400 text-sm">
                  No activities saved yet. Browse Activities or add a custom adventure!
                </div>
              )}
            </div>
          </div>

          {/* Stays & Accommodations Section */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-navy-900 flex items-center gap-2">
                  <Home className="text-purple-500" size={20} /> Stays & Cabins ({staysList.length})
                </h2>
                <p className="text-xs text-gray-500 mt-1">Accommodations and lodging booked or planned for this trip.</p>
              </div>
              <button
                onClick={() => { setItemType('stay'); setIsAddItemOpen(true); }}
                className="text-xs font-bold text-navy-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer uppercase tracking-wider transition-colors"
              >
                <Plus size={14} /> Add Stay
              </button>
            </div>

            <div className="space-y-4">
              {staysList.length > 0 ? (
                staysList.map((stay: any) => (
                  <div key={stay.id} className="p-5 bg-gray-50/70 border border-gray-100 rounded-2xl flex justify-between items-center gap-4">
                    <div>
                      <h3 className="font-bold text-base text-navy-900">{stay.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                        <MapPin size={12} className="text-purple-500" /> {stay.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {stay.nights && (
                        <span className="text-xs font-bold text-navy-900 bg-white border border-gray-200 px-3 py-1 rounded-lg">
                          {stay.nights} Nights
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveStay(stay.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove stay"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400 text-sm">
                  No accommodations saved yet. Browse Stays or add your reserved cabin!
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          {trip.notes && (
            <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
              <h2 className="text-2xl font-display font-bold text-navy-900 flex items-center gap-2 mb-3">
                <FileText className="text-amber-500" size={20} /> Traveler Notes & Logistics
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-200/50">
                {trip.notes}
              </p>
            </div>
          )}

        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <h3 className="font-display font-bold text-xl text-navy-900 mb-4">Trip Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-400">Duration</span>
                <span className="font-bold text-navy-900">{trip.nights} Days</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-400">Destinations</span>
                <span className="font-bold text-navy-900">{destinations.length}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-400">Total Activities</span>
                <span className="font-bold text-navy-900">{activitiesList.length}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-400">Stays / Cabins</span>
                <span className="font-bold text-navy-900">{staysList.length}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                to={`/weather?city=${encodeURIComponent(trip.name)}`}
                className="w-full bg-gray-50 hover:bg-gray-100 text-navy-900 font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Sun size={14} className="text-amber-500" /> Check Destination Weather
              </Link>
              
              <Link 
                to="/map"
                className="w-full bg-navy-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Map size={14} /> Open in Smart Map
              </Link>
            </div>
          </div>

          {/* Estimated Cost Breakdown Card */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <h3 className="font-display font-bold text-xl text-navy-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" /> Estimated Cost
            </h3>
            {(() => {
              const formattedDays = (trip.days || []).map((d: any, idx: number) => ({
                id: `day-${idx}`,
                trip_id: trip.id,
                day_number: d.day || idx + 1,
                date: d.date || trip.startDate,
                activities: (d.activities || []).map((a: any) => ({ price_nok: a.cost || 650 })),
                stays: (trip.staysList || []).map(() => ({ price_nok: 2500 })),
              }));
              const costSummary = tripService.calculateEstimatedTripCost(formattedDays, trip.budget_nok || 20000);

              return (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Stays & Cabins</span>
                    <span className="font-semibold">NOK {costSummary.accommodation_total_nok.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Activities & Hikes</span>
                    <span className="font-semibold">NOK {costSummary.activities_total_nok.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Transit & Ferries</span>
                    <span className="font-semibold">NOK {costSummary.transport_total_nok.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Dining Estimate</span>
                    <span className="font-semibold">NOK {costSummary.food_estimate_nok.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-sm text-navy-900">
                    <span>Total Estimate</span>
                    <span className="text-emerald-600">NOK {costSummary.grand_total_nok.toLocaleString()}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

      </div>

      {/* Share Trip Modal */}
      <ShareTripModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        trip={{
          id: trip.id,
          title: trip.name || trip.title,
          description: trip.summary,
          start_date: trip.startDate,
          end_date: trip.endDate,
          status: trip.status,
          visibility: trip.visibility || 'PRIVATE',
          share_token: trip.share_token,
          notes: trip.notes,
        }}
        onTripUpdated={(updated) => {
          saveUpdatedTrip({
            ...trip,
            visibility: updated.visibility,
            share_token: updated.share_token,
          });
        }}
      />

      {/* Edit Dates Modal */}
      {isEditDatesOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setIsEditDatesOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-navy-900 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Edit Trip Dates</h2>
            <p className="text-xs text-gray-500 mb-6">Updating dates validates range and preserves all your saved items.</p>

            <form onSubmit={handleUpdateDates} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Start Date
                </label>
                <input 
                  type="date"
                  required
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy-900 text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  End Date
                </label>
                <input 
                  type="date"
                  required
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy-900 text-navy-900"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditDatesOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-navy-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer shadow-md"
                >
                  Update Dates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setIsAddItemOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-navy-900 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-display font-bold text-navy-900 mb-2 capitalize">Add {itemType} to Trip</h2>
            <p className="text-xs text-gray-500 mb-6">Enter the details to add this item to your planned itinerary.</p>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {itemType === 'activity' ? 'Activity Name' : itemType === 'stay' ? 'Stay / Hotel Name' : 'Destination Name'} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder={itemType === 'activity' ? 'e.g. Kayaking in Reinefjorden' : itemType === 'stay' ? 'e.g. Reine Rorbuer' : 'e.g. Flåm'}
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy-900 text-navy-900"
                />
              </div>

              {itemType !== 'destination' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Location / Area
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Reine, Lofoten"
                    value={itemLocation}
                    onChange={(e) => setItemLocation(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy-900 text-navy-900"
                  />
                </div>
              )}

              {itemType === 'activity' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Description
                    </label>
                    <textarea 
                      rows={2}
                      placeholder="Brief notes on gear, tickets, or meeting points..."
                      value={itemDesc}
                      onChange={(e) => setItemDesc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy-900 text-navy-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Estimated Cost (NOK)
                    </label>
                    <input 
                      type="number"
                      placeholder="e.g. 750"
                      value={itemCost}
                      onChange={(e) => setItemCost(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy-900 text-navy-900"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-navy-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer shadow-md"
                >
                  Add to Itinerary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
