import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { Restaurant, foodService, getRestaurantImage } from '../../services/foodService';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from '../../store/useToastStore';
import { useNavigate } from 'react-router-dom';
import { OptimizedImage } from '../shared/OptimizedImage';

interface RestaurantReservationModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
}

const TIME_SLOTS = [
  '12:00', '13:00', '14:00',
  '17:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

const TABLE_PREFERENCES = [
  { id: 'Standard', label: 'Standard Dining', desc: 'Main dining hall atmosphere' },
  { id: 'Window View', label: 'Window Table', desc: 'Scenic fjord or street views' },
  { id: 'Cozy Booth', label: 'Cozy Booth / Corner', desc: 'Intimate, quieter seating' },
  { id: "Chef's Counter", label: "Chef's Counter", desc: 'Front-row kitchen experience' },
  { id: 'Outdoor Terrace', label: 'Heated Terrace', desc: 'Covered outdoor dining' },
];

export const RestaurantReservationModal: React.FC<RestaurantReservationModalProps> = ({
  restaurant,
  onClose,
}) => {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();

  // Get tomorrow's date formatted as YYYY-MM-DD
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(getTomorrowDate());
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [tablePref, setTablePref] = useState('Standard');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    reference: string;
    bookingId: string;
  } | null>(null);

  // Pre-fill user data when modal opens or user profile loads
  useEffect(() => {
    if (profile) {
      if (profile.fullName) setGuestName(profile.fullName);
      else if ((profile as any).first_name) {
        setGuestName(`${(profile as any).first_name} ${(profile as any).last_name || ''}`.trim());
      }
      if (profile.phone) setGuestPhone(profile.phone);
    }
    if (user?.email && !guestEmail) {
      setGuestEmail(user.email);
    }
  }, [profile, user]);

  // Reset state when closing or changing restaurant
  useEffect(() => {
    if (!restaurant) {
      setConfirmedBooking(null);
    }
  }, [restaurant]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!restaurant) return null;

  const restaurantImage = restaurant.image_url || getRestaurantImage(restaurant.name);
  const locationName = (restaurant as any).location?.name || 'Norway';

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim() || !date || !time) {
      toast.error('Please complete all required reservation fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await foodService.createTableReservation({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        date,
        time,
        guests,
        tablePreference: tablePref,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        specialRequests: specialRequests.trim(),
      });

      setConfirmedBooking({
        reference: res.bookingReference,
        bookingId: res.bookingId,
      });

      toast.success(`Table confirmed at ${restaurant.name}! Reference: ${res.bookingReference}`);
    } catch (err: any) {
      console.error('Table reservation failed:', err);
      toast.error('Could not complete table reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-midnight border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close reservation modal"
          className="absolute top-4 right-4 z-30 p-2 text-snow/60 hover:text-white bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full transition-colors border border-white/10"
        >
          <X size={18} />
        </button>

        {/* Modal Header with Restaurant Details */}
        <div className="relative h-36 sm:h-44 overflow-hidden bg-black">
          <OptimizedImage
            src={restaurantImage}
            alt={restaurant.name}
            category="food"
            fallbackSrc="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800"
            className="w-full h-full object-cover opacity-60"
            containerClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="bg-[#FF7F50] text-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-md shadow-md flex items-center gap-1">
                  <Sparkles size={11} /> Table Reservation
                </span>
                <span className="bg-white/10 backdrop-blur-md text-snow/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-md border border-white/10">
                  Instant Confirmation
                </span>
                {(restaurant as any).rating && (
                  <span className="bg-arctic-gold/20 text-arctic-gold px-2 py-0.5 text-[10px] font-bold rounded-md border border-arctic-gold/30">
                    ★ {Number((restaurant as any).rating).toFixed(1)}
                  </span>
                )}
              </div>
              <h2 id="reservation-modal-title" className="text-2xl sm:text-3xl font-display font-bold text-snow">
                {restaurant.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-snow/70 mt-1 font-medium">
                <MapPin size={13} className="text-[#FF7F50]" />
                <span>{locationName}</span>
                <span>•</span>
                <span className="text-arctic-gold font-bold">{(restaurant as any).price_range || '$$$'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Free & Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {confirmedBooking ? (
            /* Confirmation Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">Reservation Confirmed</span>
                <h3 className="text-2xl font-display font-bold text-snow">Your Table is Reserved!</h3>
                <p className="text-sm text-snow/70 mt-2 max-w-md mx-auto">
                  We have secured your table at <strong className="text-snow">{restaurant.name}</strong>. A confirmation has been sent to <span className="text-[#FF7F50]">{guestEmail}</span>.
                </p>
              </div>

              {/* Reference Code Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 max-w-md mx-auto text-left space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-snow/50">Booking Reference</span>
                  <span className="font-mono text-base font-black text-arctic-gold bg-deep-night px-3 py-1 rounded border border-white/10">
                    {confirmedBooking.reference}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-snow/50 block font-medium">Date & Time</span>
                    <span className="font-bold text-snow mt-0.5 block">{date} at {time}</span>
                  </div>
                  <div>
                    <span className="text-snow/50 block font-medium">Party Size</span>
                    <span className="font-bold text-snow mt-0.5 block">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                  <div>
                    <span className="text-snow/50 block font-medium">Table Preference</span>
                    <span className="font-bold text-snow mt-0.5 block">{tablePref}</span>
                  </div>
                  <div>
                    <span className="text-snow/50 block font-medium">Guest Name</span>
                    <span className="font-bold text-snow mt-0.5 block truncate">{guestName}</span>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-center justify-center gap-2 text-xs text-snow/60">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>No fee or cancellation penalty. Arrive 5 minutes prior to your seating.</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/user/bookings');
                  }}
                  className="px-6 py-3.5 bg-[#FF7F50] hover:bg-[#E86A3E] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View in My Bookings</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-snow text-xs font-bold uppercase tracking-widest rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleConfirmReservation} className="space-y-6">
              
              {/* Party Size */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-snow/70 mb-3">
                  <Users size={14} className="text-[#FF7F50]" /> Number of Guests
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        guests === num
                          ? 'bg-[#FF7F50] text-white border-[#FF7F50] shadow-md scale-105'
                          : 'bg-white/5 text-snow/70 border-white/10 hover:bg-white/10 hover:text-snow'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-snow/70 mb-2">
                    <Calendar size={14} className="text-[#FF7F50]" /> Date
                  </label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-snow outline-none focus:border-[#FF7F50] transition-colors text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-snow/70 mb-2">
                    <Clock size={14} className="text-[#FF7F50]" /> Selected Time
                  </label>
                  <div className="px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-arctic-gold font-bold text-sm flex items-center justify-between">
                    <span>{time}</span>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Available</span>
                  </div>
                </div>
              </div>

              {/* Time Slots Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-snow/70 mb-2">
                  Choose Dining Time
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all text-center ${
                        time === slot
                          ? 'bg-[#FF7F50] text-white border-[#FF7F50] shadow-md font-black'
                          : 'bg-white/5 text-snow/80 border-white/10 hover:bg-white/10 hover:text-snow'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Seating Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-snow/70 mb-2">
                  Table Seating Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TABLE_PREFERENCES.map((pref) => (
                    <button
                      key={pref.id}
                      type="button"
                      onClick={() => setTablePref(pref.id)}
                      className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-center ${
                        tablePref === pref.id
                          ? 'bg-[#FF7F50]/15 border-[#FF7F50] text-snow shadow-inner'
                          : 'bg-white/5 border-white/10 text-snow/70 hover:bg-white/10 hover:text-snow'
                      }`}
                    >
                      <span className="text-xs font-bold text-snow">{pref.label}</span>
                      <span className="text-[10px] text-snow/50">{pref.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Details */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-snow/70">Guest Details</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-snow/60 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Keshav Sharma"
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-snow text-xs outline-none focus:border-[#FF7F50] transition-colors placeholder:text-snow/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-snow/60 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-snow text-xs outline-none focus:border-[#FF7F50] transition-colors placeholder:text-snow/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-snow/60 mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+47 123 45 678"
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-snow text-xs outline-none focus:border-[#FF7F50] transition-colors placeholder:text-snow/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-snow/60 mb-1">Special Dietary / Requests</label>
                    <input
                      type="text"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Birthday, quiet table, gluten-free"
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-snow text-xs outline-none focus:border-[#FF7F50] transition-colors placeholder:text-snow/30"
                    />
                  </div>
                </div>
              </div>

              {/* Guarantee Banner */}
              <div className="flex items-center gap-2.5 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                <ShieldCheck size={16} className="shrink-0" />
                <span>Zero deposit required. Instant confirmation saved to your Travel Wallet.</span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-snow/70 hover:text-snow text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !guestName || !guestEmail || !date || !time}
                  className="px-6 py-3.5 bg-[#FF7F50] hover:bg-[#E86A3E] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Reserving Table...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Table (Free)</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
