import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Clock, Navigation, AlertTriangle, ArrowRight, Train, Ship, Car, Leaf, MapIcon, Ticket, CheckCircle2 } from 'lucide-react';
import { transportService, RouteWithLocations } from '../services/transportService';
import { AsyncStateWrapper } from '../components/shared/AsyncStateWrapper';

// Fix Leaflet default icon issue
let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export const TransportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [route, setRoute] = useState<RouteWithLocations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Booking State
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [ticketClass, setTicketClass] = useState<'Standard' | 'Premium'>('Standard');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchRoute = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await transportService.getRouteDetails(id);
        setRoute(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-24 selection:bg-[#0284C7]/20">
      <AsyncStateWrapper
        isLoading={loading}
        error={error}
        data={route}
        emptyMessage="Route not found."
        errorMessage="Unable to load route details."
        skeleton={<div className="min-h-screen pt-32 pb-24 flex justify-center"><div className="w-10 h-10 border-4 border-[#E2E8F0] border-t-[#0284C7] rounded-full animate-spin"></div></div>}
      >
        {(route) => {
          const stops = (route.stops as any[]) || [];
          const timetable = (route.timetable as any[]) || [];
          const alerts = (route.alerts as any[]) || [];

          const hours = Math.floor((route.duration_minutes || 0) / 60);
          const mins = (route.duration_minutes || 0) % 60;

          const originPos: [number, number] = [route.origin?.lat || 0, route.origin?.lng || 0];
          const destPos: [number, number] = [route.destination?.lat || 0, route.destination?.lng || 0];
          const polylinePositions = [originPos, destPos];
          const bounds = L.latLngBounds(originPos, destPos);
          const getModeIcon = () => {
            switch (route.type) {
              case 'TRAIN': return <Train size={24} />;
              case 'FERRY': return <Ship size={24} />;
              case 'CAR_RENTAL': return <Car size={24} />;
              case 'FLIGHT': return <Navigation size={24} />;
              default: return <Navigation size={24} />;
            }
          };

          const basePrice = route.price_estimate || 0;
          const totalPrice = (ticketClass === 'Premium' ? basePrice * 1.5 : basePrice) * passengers;

          return (
            <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Route Info */}
              <div className="lg:col-span-2 space-y-8">

                <button onClick={() => navigate('/travel')} className="text-sm font-bold uppercase tracking-widest text-[#64748B] hover:text-[#0284C7] transition-colors flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 rotate-180" /> Back to Routes
                </button>

                <div className="bg-white rounded-md p-8 border border-[#E2E8F0] shadow-sm">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-md bg-[#F1F5F9] flex items-center justify-center border border-[#E2E8F0] text-[#0284C7]">
                        {getModeIcon()}
                      </div>
                      <div>
                        <h1 className="text-3xl font-display font-bold text-[#0F172A]">{route.name}</h1>
                        <p className="text-[#64748B] font-bold uppercase text-xs tracking-widest mt-1">Operated by {route.operator}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 text-[#059669] font-bold uppercase text-xs tracking-widest mb-1 bg-[#059669]/10 px-2 py-1 rounded-sm w-fit ml-auto">
                        <Leaf size={12} /> Zero Emission
                      </div>
                    </div>
                  </div>

                  {/* Live Status & Alerts */}
                  {alerts.length > 0 ? (
                    <div className="mb-8 bg-red-50 border border-red-100 rounded-md p-4 flex gap-4">
                      <AlertTriangle className="text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-900 mb-1">Service Alert</h4>
                        {alerts.map((alert, i) => <p key={i} className="text-sm text-red-800">{alert.message}</p>)}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8 bg-[#F0FDF4] border border-[#BBF7D0] rounded-md p-4 flex gap-3 items-center">
                      <div className="w-3 h-3 bg-[#22C55E] rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      <span className="font-bold text-[#166534] text-sm uppercase tracking-widest">Service operating normally</span>
                    </div>
                  )}

                  {/* Journey Timeline */}
                  <div className="relative pl-6 py-4">
                    <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-[#E2E8F0]"></div>

                    <div className="relative z-10 flex gap-6 mb-10">
                      <div className="w-3 h-3 bg-[#0284C7] rounded-full mt-2 ring-4 ring-white"></div>
                      <div>
                        <h3 className="text-2xl font-display font-bold text-[#0F172A]">{route.origin?.name}</h3>
                        <p className="text-sm font-bold text-[#64748B] uppercase tracking-widest mt-1">Departure</p>
                      </div>
                    </div>

                    {stops.map((stop, index) => (
                      <div key={index} className="relative z-10 flex gap-6 mb-10">
                        <div className="w-3 h-3 bg-white border-2 border-[#94A3B8] rounded-full mt-1.5 ring-4 ring-white"></div>
                        <div>
                          <h4 className="font-bold text-[#0F172A] text-lg">{stop.name}</h4>
                          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mt-1">
                            {stop.time} {stop.charging && <span className="text-[#0284C7] ml-2">â€¢ Charging Stop</span>}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="relative z-10 flex gap-6">
                      <div className="w-3 h-3 bg-[#0F172A] rounded-full mt-2 ring-4 ring-white"></div>
                      <div>
                        <h3 className="text-2xl font-display font-bold text-[#0F172A]">{route.destination?.name}</h3>
                        <p className="text-sm font-bold text-[#64748B] uppercase tracking-widest mt-1">Arrival â€¢ {hours > 0 && `${hours}h `}{mins > 0 && `${mins}m`} total</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timetable */}
                {timetable.length > 0 && (
                  <div className="bg-white rounded-md p-8 border border-[#E2E8F0] shadow-sm">
                    <h3 className="text-xl font-display font-bold text-[#0F172A] mb-6 flex items-center gap-2"><Clock size={20} className="text-[#0284C7]" /> Timetable</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {timetable.map((t, i) => (
                        <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm p-4 flex justify-between items-center hover:border-[#0284C7]/50 transition-colors cursor-default">
                          <div>
                            <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest mb-1">Departs</p>
                            <p className="font-bold text-[#0F172A] text-lg">{t.departure}</p>
                          </div>
                          <ArrowRight size={20} className="text-[#CBD5E1]" />
                          <div className="text-right">
                            <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest mb-1">Arrives</p>
                            <p className="font-bold text-[#0F172A] text-lg">{t.arrival}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Booking & Map */}
              <div className="lg:col-span-1 space-y-8">

                {/* Booking Widget */}
                <div className="bg-white rounded-md p-6 border border-[#E2E8F0] shadow-xl sticky top-28">
                  <h3 className="text-xl font-display font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                    <Ticket className="text-[#0284C7] w-5 h-5" /> Book Ticket
                  </h3>

                  {bookingSuccess ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
                      </div>
                      <h4 className="font-bold text-xl mb-2 text-[#0F172A]">Ticket Confirmed</h4>
                      <p className="text-[#64748B] text-sm mb-6">Your {ticketClass.toLowerCase()} ticket has been added to your Travel Wallet.</p>
                      <button onClick={() => setBookingSuccess(false)} className="text-sm font-bold uppercase tracking-widest text-[#0284C7] hover:text-[#0F172A] transition-colors">Book Another</button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-2">Travel Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0284C7] outline-none font-medium text-sm rounded-sm transition-colors" />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-2">Passengers</label>
                        <select value={passengers} onChange={e => setPassengers(Number(e.target.value))} className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0284C7] outline-none font-medium text-sm rounded-sm transition-colors cursor-pointer">
                          {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Adult' : 'Adults'}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-2">Ticket Class</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setTicketClass('Standard')}
                            className={`py-3 text-sm font-bold border transition-colors rounded-sm ${ticketClass === 'Standard' ? 'bg-[#F0F9FF] border-[#0284C7] text-[#0284C7]' : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#0284C7]/50'}`}
                          >
                            Standard
                          </button>
                          <button
                            onClick={() => setTicketClass('Premium')}
                            className={`py-3 text-sm font-bold border transition-colors rounded-sm ${ticketClass === 'Premium' ? 'bg-[#F0F9FF] border-[#0284C7] text-[#0284C7]' : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#0284C7]/50'}`}
                          >
                            Premium (+50%)
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E2E8F0] flex justify-between items-end">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Total Price</div>
                        <div className="text-2xl font-display font-bold text-[#0F172A]">{totalPrice} {route.currency}</div>
                      </div>

                      <button
                        onClick={() => {
                          setIsBooking(true);
                          setTimeout(() => { setIsBooking(false); setBookingSuccess(true); }, 1500);
                        }}
                        disabled={!date || isBooking}
                        className="w-full bg-[#0284C7] text-white font-bold py-4 hover:bg-[#0369A1] transition-colors rounded-sm uppercase tracking-widest text-xs disabled:opacity-50"
                      >
                        {isBooking ? 'Processing...' : 'Confirm & Pay'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Map */}
                <div className="bg-white rounded-md p-4 border border-[#E2E8F0] shadow-sm">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-4 px-2 flex items-center gap-2"><MapIcon size={14} className="text-[#0284C7]" /> Route Map</h3>
                  <div className="w-full h-64 rounded-sm overflow-hidden relative z-0 border border-[#E2E8F0]">
                    <MapContainer
                      bounds={bounds}
                      zoom={5}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />
                      <Polyline
                        positions={polylinePositions}
                        color="#0284C7"
                        weight={4}
                        opacity={0.8}
                      />
                      <Marker position={originPos}>
                        <Popup>{route.origin?.name}</Popup>
                      </Marker>
                      <Marker position={destPos}>
                        <Popup>{route.destination?.name}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
  );
}}
</AsyncStateWrapper>
</div>
  );
};

export default TransportDetails;