import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, MapPin, Phone, Globe, Star, Users, Calendar as CalendarIcon, CheckCircle2, ChevronRight, Heart, Share2, Info } from 'lucide-react';
import { foodService, Restaurant } from '../services/foodService';
import { OptimizedImage } from '../components/shared/OptimizedImage';

export const FoodDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  // 5-Step Reservation State
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [tablePref, setTablePref] = useState('Standard');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      foodService.getRestaurantById(id).then(data => {
        setRestaurant(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="min-h-screen pt-32 pb-24 flex justify-center"><div className="w-8 h-8 border-4 border-[#FF7F50] border-t-transparent rounded-full animate-spin"></div></div>;
  if (!restaurant) return <div className="min-h-screen pt-32 text-center text-[#2C1810]">Restaurant not found</div>;

  const contact = (restaurant.contact_info || {}) as any;
  const hours = (restaurant.opening_hours || {}) as any;
  const menu = (restaurant.menu || []) as any[];
  const photos = (restaurant.photos || [restaurant.image_url, '/images/food_salmon_1787013684123.jpg']) as string[];

  const handleNextStep = () => {
    if (step === 1 && (!date || !time)) return;
    if (step === 3 && (!guestName || !guestEmail)) return;
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#2C1810] font-sans pb-24 selection:bg-[#FF7F50]/20">
      
      {/* Hero Gallery */}
      <div className="h-[50vh] min-h-[400px] w-full relative grid grid-cols-4 gap-2 bg-[#1A0F0A]">
        <div className="col-span-4 md:col-span-2 relative h-full group overflow-hidden cursor-pointer">
          <OptimizedImage 
            src={photos[0]} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            alt={restaurant.name} 
            category="food"
            containerClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/80 to-transparent pointer-events-none"></div>
          
          <div className="absolute top-24 left-6 md:left-12 text-white/70 text-sm font-bold tracking-widest flex items-center gap-2 z-10">
            <Link to="/food" className="hover:text-white transition-colors">DINING</Link> 
            <ChevronRight className="w-4 h-4" /> 
            <span className="text-white">{restaurant.name.toUpperCase()}</span>
          </div>
        </div>
        <div className="hidden md:grid col-span-2 grid-rows-2 gap-2 h-full">
           <div className="relative group overflow-hidden cursor-pointer">
             <OptimizedImage 
               src={photos[1]} 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
               alt={`${restaurant.name} interior`} 
               category="stay"
               containerClassName="w-full h-full"
             />
           </div>
           <div className="grid grid-cols-2 gap-2">
             <div className="relative group overflow-hidden cursor-pointer">
               <OptimizedImage 
                 src={photos[2]} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                 alt={`${restaurant.name} dish`} 
                 category="food"
                 containerClassName="w-full h-full"
               />
             </div>
             <div className="bg-[#2C1810] flex items-center justify-center text-[#FF7F50] text-sm font-bold tracking-widest hover:bg-[#1A0F0A] cursor-pointer transition-colors uppercase">
               View Gallery
             </div>
           </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="flex-1 w-full lg:w-2/3 space-y-12">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.cuisine?.map((c, i) => (
                  <span key={i} className="bg-[#FF7F50]/10 text-[#FF7F50] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{c}</span>
                ))}
                <span className="bg-[#2C1810]/5 text-[#2C1810]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{restaurant.type.replace('_', ' ')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{restaurant.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 font-bold mb-6">
                <span className="flex items-center gap-1 text-[#FF7F50]"><Star size={16} className="fill-[#FF7F50]" /> {restaurant.rating} (342 Reviews)</span>
                <span>•</span>
                <span>{restaurant.price_range}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin size={16}/> {restaurant.location?.name || 'Norway'}</span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Menu Section */}
            {menu.length > 0 && (
              <div className="border-t border-[#2C1810]/10 pt-12">
                <h3 className="text-2xl font-display font-bold mb-8">Sample Menu</h3>
                <div className="space-y-12">
                  {menu.map((category, i) => (
                    <div key={i}>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#FF7F50] mb-6">{category.category}</h4>
                      <div className="space-y-6">
                        {category.items.map((item: any, j: number) => (
                          <div key={j} className="flex justify-between items-start gap-4 pb-6 border-b border-[#2C1810]/5 last:border-0 last:pb-0">
                            <div>
                              <div className="font-bold text-lg">{item.name}</div>
                              <div className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">{item.description}</div>
                            </div>
                            <div className="font-bold shrink-0">{item.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Reservation Widget */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-white border border-[#2C1810]/10 p-8 shadow-xl sticky top-28">
              
              {/* Progress Indicator */}
              <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s ? 'bg-[#FF7F50] text-white ring-4 ring-white' : 
                    step > s ? 'bg-[#2C1810] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s ? <CheckCircle2 className="w-4 h-4"/> : s}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-xl font-display font-bold mb-4">Date & Time</h3>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#FF7F50] transition-colors font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Guests</label>
                    <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#FF7F50] transition-colors font-medium">
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Available Times</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['17:00','18:30','19:00','20:30','21:00'].map(t => (
                        <button 
                          key={t}
                          onClick={() => setTime(t)}
                          className={`p-2 text-sm font-bold transition-colors border ${time === t ? 'bg-[#FF7F50] text-white border-[#FF7F50]' : 'bg-gray-50 border-gray-200 hover:border-[#FF7F50]'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleNextStep} disabled={!date || !time} className="w-full mt-4 bg-[#2C1810] text-white font-bold uppercase tracking-widest text-sm py-4 hover:bg-[#FF7F50] transition-colors disabled:opacity-50">
                    Next Step
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-xl font-display font-bold mb-4">Table Preference</h3>
                  <div className="space-y-3">
                    {['Standard', 'Window Seat', 'Outdoor Patio', 'Chef\'s Counter'].map(pref => (
                      <label key={pref} className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${tablePref === pref ? 'border-[#FF7F50] bg-[#FF7F50]/5' : 'border-gray-200 hover:border-[#FF7F50]/50'}`}>
                        <span className="font-bold text-sm">{pref}</span>
                        <input type="radio" name="tablePref" checked={tablePref === pref} onChange={() => setTablePref(pref)} className="accent-[#FF7F50]" />
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-4 text-sm font-bold uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-colors">Back</button>
                    <button onClick={handleNextStep} className="flex-1 bg-[#2C1810] text-white font-bold uppercase tracking-widest text-sm py-4 hover:bg-[#FF7F50] transition-colors">Next</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-xl font-display font-bold mb-4">Guest Details</h3>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                    <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#FF7F50] transition-colors font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                    <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#FF7F50] transition-colors font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone (Optional)</label>
                    <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#FF7F50] transition-colors font-medium" />
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 py-4 text-sm font-bold uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-colors">Back</button>
                    <button onClick={handleNextStep} disabled={!guestName || !guestEmail} className="flex-1 bg-[#2C1810] text-white font-bold uppercase tracking-widest text-sm py-4 hover:bg-[#FF7F50] transition-colors disabled:opacity-50">Confirm</button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 text-center py-4">
                  <div className="w-16 h-16 bg-[#FF7F50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#FF7F50]"/>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">Table Confirmed</h3>
                  <p className="text-gray-600 text-sm mb-6">Your reservation at {restaurant.name} is confirmed for {guests} guests on {date} at {time}.</p>
                  
                  <div className="bg-gray-50 p-4 text-left border border-gray-100 rounded-sm mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Name</span>
                      <span className="font-bold">{guestName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Preference</span>
                      <span className="font-bold">{tablePref}</span>
                    </div>
                  </div>

                  <button onClick={() => setStep(1)} className="text-sm font-bold uppercase tracking-widest text-[#FF7F50] hover:text-[#2C1810] transition-colors">Make another booking</button>
                </div>
              )}

            </div>

            <div className="bg-[#1A0F0A] text-white p-6 shadow-xl">
              <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-[#FF7F50]">Contact & Hours</h3>
              <div className="space-y-4 text-sm mb-6">
                {contact.phone && <div className="flex items-center gap-3"><Phone size={16}/> {contact.phone}</div>}
                {contact.website && <div className="flex items-center gap-3"><Globe size={16}/> <a href={`https://${contact.website}`} target="_blank" rel="noreferrer" className="hover:text-[#FF7F50] transition-colors">{contact.website}</a></div>}
                {contact.address && <div className="flex items-center gap-3"><MapPin size={16}/> {contact.address}</div>}
              </div>
              <div className="pt-6 border-t border-white/10 space-y-2 text-sm">
                {Object.entries(hours).map(([day, time]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize text-white/50">{day}</span>
                    <span className="font-medium">{String(time)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
