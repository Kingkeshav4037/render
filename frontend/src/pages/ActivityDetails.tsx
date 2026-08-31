import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Share2, Heart, Clock, Users, ShieldCheck, ChevronRight, Check,
  Activity as ActivityIcon, Navigation, Calendar, Info
} from 'lucide-react';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useCartStore } from '../store/useCartStore';
import { activityService, Activity } from '../services/activityService';
import { getActivityImage } from '../services/home/homeContentService';
import { OptimizedImage } from '../components/shared/OptimizedImage';
import { SEO } from '../components/shared/SEO';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { FavoriteButton } from '../components/common/FavoriteButton';

const DATES = [
  { date: '14', day: 'Mon', available: true },
  { date: '15', day: 'Tue', available: true },
  { date: '16', day: 'Wed', available: false },
  { date: '17', day: 'Thu', available: true },
  { date: '18', day: 'Fri', available: true, limited: true },
];

const TIMES = [
  { time: '18:00', status: 'Available' },
  { time: '20:00', status: 'Limited' },
  { time: '22:00', status: 'Sold Out' },
];

export const ActivityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requireAuth } = useRequireAuth();
  const { formatPrice } = useCurrencyStore();
  const { addItem } = useCartStore();
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('14');
  const [selectedTime, setSelectedTime] = useState<string | null>('18:00');
  const [tickets, setTickets] = useState(2);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      activityService.getActivityById(id).then((res) => {
        setActivity(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-night flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#2F5233] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-deep-night text-snow flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl font-bold font-display mb-4">Activity Not Found</h1>
        <p className="text-snow/60 mb-8 max-w-md">The requested experience could not be located or may have ended.</p>
        <Link to="/activities" className="bg-[#2F5233] text-snow px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-[#A3B899] hover:text-deep-night transition-colors">
          Browse All Activities
        </Link>
      </div>
    );
  }

  const actImage = getActivityImage(activity.type, activity.image_url);
  const durationText = activity.duration_minutes 
    ? `${Math.floor(activity.duration_minutes / 60)}h ${activity.duration_minutes % 60 ? (activity.duration_minutes % 60) + 'm' : ''}`.trim() 
    : '3 hours';
  const difficultyText = activity.difficulty_level || activity.difficulty || 'Moderate';
  const activityPrice = activity.price || 1200;
  const activityName = activity.name || 'Fjord Experience';
  const activityType = activity.type || 'Adventure';
  const activityDesc = activity.description || 'Experience the pristine beauty of Norway with certified guides and premium gear.';
  const equipment = activity.equipment_needed || ['Warm layers', 'Camera', 'Water bottle'];

  const handleBookExperience = () => {
    if (!activity || !selectedTime) return;
    requireAuth(() => {
      addItem({
        item_type: 'ACTIVITY',
        item_id: activity.id,
        name: `${activity.name} (${selectedDate} Aug @ ${selectedTime})`,
        description: activity.description,
        unit_price: activity.price,
        quantity: tickets,
        image: actImage,
        pax: tickets
      });
      navigate('/checkout');
    }, { message: 'Sign in to book activities and experiences.' });
  };

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pb-24 selection:bg-[#2F5233]/40">
      <SEO 
        title={`${activityName} | Norway SmartLife`}
        description={activityDesc}
      />
      {/* Pine Theme Hero */}
      <div className="h-[50vh] w-full relative">
        <OptimizedImage 
          src={actImage} 
          alt={activityName} 
          category="activity"
          className="w-full h-full object-cover" 
          containerClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-night via-deep-night/40 to-transparent pointer-events-none" />
        
        <div className="absolute top-24 left-6 md:left-12 text-snow/70 text-sm font-bold tracking-widest flex items-center gap-2 z-10">
          <Link to="/activities" className="hover:text-snow transition-colors">ACTIVITIES</Link> 
          <ChevronRight className="w-4 h-4" /> 
          <span className="text-white">{activityName.toUpperCase()}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-20 relative z-20 flex flex-col lg:flex-row gap-12">
        
        {/* Left Content */}
        <div className="flex-1 w-full lg:w-2/3">
          <div className="mb-12">
            <span className="bg-[#2F5233] text-snow px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
              {activityType}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{activityName}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-snow/60 mb-6 font-bold">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#A3B899]"/> {activity?.location_id ? 'Norway' : 'Fjord Region'}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#A3B899]"><Star className="w-4 h-4 fill-[#A3B899]"/> 4.9 (120+ reviews)</span>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: <Clock className="w-5 h-5"/>, label: 'Duration', value: durationText },
              { icon: <ActivityIcon className="w-5 h-5"/>, label: 'Difficulty', value: difficultyText },
              { icon: <Users className="w-5 h-5"/>, label: 'Group Size', value: 'Small Group' },
              { icon: <Info className="w-5 h-5"/>, label: 'Experience', value: 'Guided' },
            ].map((fact, i) => (
              <div key={i} className="bg-[#1A2E1F]/30 border border-[#2F5233]/30 p-4 rounded-xl flex flex-col gap-2">
                <div className="text-[#A3B899]">{fact.icon}</div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-snow/50 tracking-widest">{fact.label}</div>
                  <div className="text-sm font-bold text-snow">{fact.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg leading-relaxed text-snow/80">{activityDesc}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Check className="text-[#A3B899]"/> What's Included</h3>
              <ul className="space-y-3">
                {['Certified local guide', 'Safety gear & equipment', 'Hot beverages & refreshments', 'Eco-certified transport'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-snow/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A3B899]"></div> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">What to bring</h3>
              <ul className="space-y-3">
                {equipment.map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-snow/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-snow/30"></div> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Booking Panel */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-28 bg-midnight border border-white/10 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-2xl font-bold text-[#A3B899]">{formatPrice(activityPrice)}</div>
                <div className="text-[10px] uppercase tracking-widest text-snow/50 font-bold">per person</div>
              </div>
              <div className="flex gap-2 items-center">
                <FavoriteButton 
                  itemType="ACTIVITY" 
                  itemId={activity?.id || id || 'act-activity'} 
                  className="bg-white/5 border border-white/10 hover:bg-white/10"
                  size={18}
                />
                <button className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors rounded-full"><Share2 className="w-4 h-4"/></button>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-widest text-snow/70 mb-3">Select Date (August 2026)</h4>
            <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
              {DATES.map(d => (
                <button 
                  key={d.date}
                  disabled={!d.available}
                  onClick={() => setSelectedDate(d.date)}
                  className={`flex-shrink-0 w-14 h-16 flex flex-col items-center justify-center border transition-colors ${
                    !d.available 
                      ? 'border-white/5 opacity-30 cursor-not-allowed bg-black/20' 
                      : selectedDate === d.date
                        ? 'border-[#A3B899] bg-[#2F5233]'
                        : 'border-white/20 hover:border-white/50 bg-white/5'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-snow/70">{d.day}</span>
                  <span className="text-lg font-bold">{d.date}</span>
                </button>
              ))}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-widest text-snow/70 mb-3">Select Time</h4>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {TIMES.map(t => (
                <button
                  key={t.time}
                  disabled={t.status === 'Sold Out'}
                  onClick={() => setSelectedTime(t.time)}
                  className={`p-3 border text-left flex justify-between items-center transition-colors ${
                    t.status === 'Sold Out'
                      ? 'border-white/5 opacity-30 cursor-not-allowed bg-black/20'
                      : selectedTime === t.time
                        ? 'border-[#A3B899] bg-[#2F5233]'
                        : 'border-white/20 hover:border-white/50 bg-white/5'
                  }`}
                >
                  <span className="font-bold text-sm">{t.time}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${t.status === 'Limited' ? 'text-orange-400' : 'text-snow/50'}`}>
                    {t.status}
                  </span>
                </button>
              ))}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-widest text-snow/70 mb-3">Tickets</h4>
            <div className="flex items-center justify-between border border-white/20 p-2 mb-8">
              <button onClick={() => setTickets(Math.max(1, tickets - 1))} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10">-</button>
              <span className="font-bold">{tickets} {tickets === 1 ? 'Person' : 'People'}</span>
              <button onClick={() => setTickets(tickets + 1)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10">+</button>
            </div>

            {selectedTime && (
              <div className="mb-6 border-t border-white/10 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-snow/60">Total Amount</span>
                  <span className="font-bold text-lg text-[#A3B899]">{formatPrice(activityPrice * tickets)}</span>
                </div>
              </div>
            )}

            <button 
              disabled={!selectedTime}
              onClick={handleBookExperience}
              className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-colors ${
                selectedTime ? 'bg-[#2F5233] text-snow hover:bg-[#A3B899] hover:text-deep-night cursor-pointer' : 'bg-white/5 text-snow/30 cursor-not-allowed'
              }`}
            >
              Book Experience
            </button>
            <div className="text-center text-xs text-snow/40 mt-4">
              Free cancellation up to 24 hours before
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActivityDetails;
