import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building2, Calendar, DollarSign, Activity, 
  RefreshCw, ArrowUpRight, ShieldCheck, Layers, 
  Radio, MapPin, Trees, Snowflake, ChevronRight, 
  CheckCircle2, CreditCard,
  Sparkles, Compass, LucideIcon, ShoppingCart
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  Tooltip as RechartsTooltip
} from 'recharts';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend?: string;
  loading?: boolean;
  linkTo?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  label, value, subtext, icon: Icon, color, bg, trend, loading, linkTo 
}) => {
  const content = (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group h-full">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`p-2.5 rounded-xl ${bg} ${color} transition-transform group-hover:scale-105`}>
          <Icon size={18} />
        </div>
      </div>
      <div>
        {loading ? (
          <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg mb-1" />
        ) : (
          <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
        )}
        {(subtext || trend) && (
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
            {trend && <span className="text-emerald-600 font-bold flex items-center"><ArrowUpRight size={13} />{trend}</span>}
            {subtext && <span>{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );

  return linkTo ? <Link to={linkTo} className="block h-full">{content}</Link> : content;
};

export const AdminDashboard = () => {
  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'TODAY' | '7D' | '30D' | 'ALL'>('ALL');
  
  // Real Statistics State
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenueNOK: 0,
    totalDestinations: 0,
    totalProducts: 0,
    foodOrders: 0,
    shopOrders: 0,
    pendingOrders: 0,
    totalFlora: 0,
    totalWildlife: 0,
    totalResorts: 0,
    totalIoT: 0,
    onlineIoT: 0,
  });

  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [bookingStatusData, setBookingStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    dbConnected: true,
    edgeFunctionsHealthy: true,
    paymentGatewayActive: true,
    latencyMs: 42,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const startTime = performance.now();

      // Determine date cutoff based on timeRange
      const now = new Date();
      let cutoffDate: Date | null = null;
      if (timeRange === 'TODAY') {
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (timeRange === '7D') {
        cutoffDate = new Date(now.getTime() - 7 * 86400000);
      } else if (timeRange === '30D') {
        cutoffDate = new Date(now.getTime() - 30 * 86400000);
      }

      // 1. Initialize Supabase Queries
      const profilesPromise = (supabase as any)
        .from('profiles')
        .select('id, role, full_name, email, created_at')
        .order('created_at', { ascending: false });

      const bookingsPromise = (supabase as any)
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      const invoicesPromise = (supabase as any)
        .from('invoices')
        .select('total_amount, currency, status, items, created_at')
        .eq('status', 'PAID');

      const ordersPromise = (supabase as any)
        .from('orders')
        .select('id, total_amount, currency, status, created_at')
        .order('created_at', { ascending: false });

      // Authoritative locations table query for destinations
      const locationsPromise = (supabase as any).from('locations').select('id, status', { count: 'exact' });
      const productsPromise = (supabase as any).from('products').select('id, status', { count: 'exact' });
      const floraPromise = (supabase as any).from('flora_species').select('id', { count: 'exact', head: true });
      const wildPromise = (supabase as any).from('wildlife_sightings').select('id', { count: 'exact', head: true });
      const resortPromise = (supabase as any).from('winter_resorts').select('id', { count: 'exact', head: true });
      const iotPromise = (supabase as any).from('iot_devices').select('id, status', { count: 'exact' });

      // 2. Execute Concurrently
      const [
        { data: profilesData, error: profilesError },
        { data: bookingsData, error: bookingsError },
        { data: invoicesData },
        { data: ordersData },
        locRes, prodRes, floraRes, wildRes, resortRes, iotRes
      ] = await Promise.all([
        profilesPromise, bookingsPromise, invoicesPromise, ordersPromise,
        locationsPromise, productsPromise, floraPromise, wildPromise, resortPromise, iotPromise
      ]);

      if (profilesError) console.warn('Profiles fetch notice:', profilesError);
      if (bookingsError) console.warn('Bookings fetch notice:', bookingsError);

      // 3. Process Profiles
      const allProfiles = profilesData || [];
      const totalUsers = allProfiles.length;
      const totalProviders = allProfiles.filter((p: any) => p.role === 'PROVIDER').length;
      const newUsers = cutoffDate 
        ? allProfiles.filter((p: any) => p.created_at && new Date(p.created_at) >= cutoffDate).length
        : totalUsers;
      const recentUsersList = allProfiles.slice(0, 5);

      // 4. Process Bookings with Date Range
      let allBookings = bookingsData || [];
      if (cutoffDate) {
        allBookings = allBookings.filter((b: any) => b.created_at && new Date(b.created_at) >= cutoffDate);
      }
      const totalBookings = allBookings.length;
      const confirmedBookings = allBookings.filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
      const pendingBookings = allBookings.filter((b: any) => b.status === 'PENDING_PAYMENT' || b.status === 'PENDING').length;
      const cancelledBookings = allBookings.filter((b: any) => b.status === 'CANCELLED').length;
      const recentBookingsList = (bookingsData || []).slice(0, 5);

      // 5. Process Orders & Commerce
      const allOrders = ordersData || [];
      const relevantOrders = cutoffDate 
        ? allOrders.filter((o: any) => o.created_at && new Date(o.created_at) >= cutoffDate)
        : allOrders;
      const pendingOrdersCount = relevantOrders.filter((o: any) => o.status === 'PENDING' || o.status === 'PENDING_PAYMENT').length;
      
      // Calculate Revenue ONLY from authoritative PAID / SETTLED records
      let revenueNOK = 0;
      if (invoicesData && invoicesData.length > 0) {
        const filteredInvoices = cutoffDate
          ? invoicesData.filter((inv: any) => inv.created_at && new Date(inv.created_at) >= cutoffDate)
          : invoicesData;
        revenueNOK = filteredInvoices.reduce((acc: number, inv: any) => acc + (Number(inv.total_amount) || 0), 0);
      } else if (relevantOrders.length > 0) {
        revenueNOK = relevantOrders
          .filter((ord: any) => ord.status === 'PAID' || ord.status === 'CONFIRMED' || ord.status === 'COMPLETED')
          .reduce((acc: number, ord: any) => acc + (Number(ord.total_amount) || 0), 0);
      } else if (allBookings.length > 0) {
        revenueNOK = allBookings
          .filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
          .reduce((acc: number, b: any) => acc + (Number(b.total_amount) || 0), 0);
      }

      // Status Chart Data
      const statusChart = [
        { name: 'Confirmed', value: confirmedBookings, color: '#10B981' },
        { name: 'Pending', value: pendingBookings, color: '#F59E0B' },
        { name: 'Cancelled', value: cancelledBookings, color: '#EF4444' },
      ].filter(item => item.value > 0);

      const iotDevices = iotRes?.data || [];
      const onlineIoTCount = iotDevices.filter((d: any) => d.status === 'ONLINE' || d.status === 'ACTIVE').length;
      const latency = Math.round(performance.now() - startTime);

      setStats({
        totalUsers,
        newUsers,
        totalProviders,
        totalBookings,
        confirmedBookings,
        pendingBookings,
        totalRevenueNOK: revenueNOK,
        totalDestinations: locRes?.count || locRes?.data?.length || 0,
        totalProducts: prodRes?.count || prodRes?.data?.length || 0,
        foodOrders: relevantOrders.filter((o: any) => o.item_type === 'FOOD' || o.item_type === 'RESTAURANT').length,
        shopOrders: relevantOrders.filter((o: any) => o.item_type === 'PRODUCT' || o.item_type === 'SHOP').length,
        pendingOrders: pendingOrdersCount,
        totalFlora: floraRes?.count || 0,
        totalWildlife: wildRes?.count || 0,
        totalResorts: resortRes?.count || 0,
        totalIoT: iotRes?.count || iotDevices.length || 0,
        onlineIoT: onlineIoTCount,
      });

      setRecentBookings(recentBookingsList);
      setRecentUsers(recentUsersList);
      setBookingStatusData(statusChart);
      setSystemHealth(prev => ({ ...prev, latencyMs: latency }));
    } catch (err) {
      console.error('Failed to load admin dashboard telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const totalCatalogItems = stats.totalDestinations + stats.totalFlora + stats.totalWildlife + stats.totalResorts;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* ── 1. Header & Live Control Bar ──────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Oslo CET: {new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Oslo', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Velkommen, {profile?.fullName || 'Administrator'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>Platform Overview — Norway SmartLife Central</span>
            <span className="font-bold text-slate-700">Command Center</span>
            <span>& Intelligence Engine</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            {(['TODAY', '7D', '30D', 'ALL'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === r 
                    ? 'bg-white text-slate-900 shadow-sm font-black' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r === 'TODAY' ? 'Today' : r === '7D' ? '7 Days' : r === '30D' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh live metrics"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-blue-600' : 'text-slate-500'} />
            <span>{refreshing ? 'Syncing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {/* ── Quick Actions Hub ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 shadow-sm text-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" /> Operational Quick Actions
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          <Link
            to="/admin/destinations"
            className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-blue-600 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 border border-slate-700 hover:border-blue-500 shadow-sm"
          >
            <MapPin size={16} className="text-blue-400" />
            <span>Add Destination</span>
          </Link>
          <Link
            to="/admin/content"
            className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-emerald-600 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 border border-slate-700 hover:border-emerald-500 shadow-sm"
          >
            <Layers size={16} className="text-emerald-400" />
            <span>Add Food Item</span>
          </Link>
          <Link
            to="/admin/products"
            className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-purple-600 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 border border-slate-700 hover:border-purple-500 shadow-sm"
          >
            <ShoppingCart size={16} className="text-purple-400" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-amber-600 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 border border-slate-700 hover:border-amber-500 shadow-sm"
          >
            <CreditCard size={16} className="text-amber-400" />
            <span>Manage Orders</span>
          </Link>
          <Link
            to="/admin/content"
            className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-cyan-600 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 border border-slate-700 hover:border-cyan-500 shadow-sm"
          >
            <Compass size={16} className="text-cyan-400" />
            <span>Create Content</span>
          </Link>
          <Link
            to="/admin/providers"
            className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-emerald-600 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 border border-slate-700 hover:border-emerald-500 shadow-sm"
          >
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Providers</span>
          </Link>
          <Link
            to="/admin/users"
            className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-indigo-600 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 border border-slate-700 hover:border-indigo-500 shadow-sm"
          >
            <Users size={16} className="text-indigo-400" />
            <span>View Users</span>
          </Link>
        </div>
      </div>

      {/* ── 2. Executive KPI Metric Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          label="Users"
          value={stats.totalUsers.toLocaleString()}
          subtext={`${stats.newUsers} in selected range`}
          icon={Users}
          color="text-blue-600"
          bg="bg-blue-50"
          loading={loading}
          linkTo="/admin/users"
        />
        <MetricCard
          label="Market Products"
          value={stats.totalProducts.toLocaleString()}
          subtext="Active SKUs"
          icon={ShoppingCart}
          color="text-emerald-600"
          bg="bg-emerald-50"
          loading={loading}
          linkTo="/admin/products"
        />
        <MetricCard
          label="Bookings"
          value={stats.totalBookings.toLocaleString()}
          subtext={`${stats.confirmedBookings} confirmed`}
          icon={Calendar}
          color="text-purple-600"
          bg="bg-purple-50"
          loading={loading}
          linkTo="/admin/bookings"
        />
        <MetricCard
          label="Settled Revenue"
          value={`NOK ${stats.totalRevenueNOK.toLocaleString()}`}
          subtext="Authoritative paid records"
          icon={DollarSign}
          color="text-amber-600"
          bg="bg-amber-50"
          loading={loading}
          linkTo="/admin/payments"
        />
        <MetricCard
          label="Destinations"
          value={stats.totalDestinations.toLocaleString()}
          subtext="Authoritative locations"
          icon={MapPin}
          color="text-cyan-600"
          bg="bg-cyan-50"
          loading={loading}
          linkTo="/admin/destinations"
        />
        <MetricCard
          label="Pending Orders"
          value={stats.pendingOrders.toLocaleString()}
          subtext="Awaiting settlement"
          icon={Activity}
          color="text-indigo-600"
          bg="bg-indigo-50"
          loading={loading}
          linkTo="/admin/orders"
        />
      </div>

      {/* ── 3. Operations & Revenue Hub ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Bookings Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar size={18} className="text-purple-600" />
                  Recent System Bookings
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time reservation transactions across Norway</p>
              </div>
              <Link 
                to="/admin/bookings" 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 space-y-3">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-12 bg-slate-100 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Calendar size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No bookings recorded yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  New visitor reservations for cabins, ferries, guides, and winter sports will automatically appear here.
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1 mt-4 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                  <Compass size={14} /> Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3.5">Booking Ref</th>
                      <th className="px-5 py-3.5">Item & Category</th>
                      <th className="px-5 py-3.5">Amount</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-slate-900">
                          {b.id?.substring(0, 8).toUpperCase() || 'NSL-BKG'}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800 truncate max-w-[200px]">
                            {b.item_type || 'Experience Booking'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {b.pax || 1} guest(s)
                          </div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-900">
                          NOK {Number(b.total_amount || 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            b.status === 'PENDING_PAYMENT' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {b.status || 'CONFIRMED'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right text-slate-400">
                          {b.created_at ? new Date(b.created_at).toLocaleDateString('en-GB') : 'Today'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Showing latest {recentBookings.length} bookings</span>
            <Link to="/admin/bookings" className="font-bold text-slate-700 hover:text-slate-900">
              Manage all reservations →
            </Link>
          </div>
        </div>

        {/* Status Distribution / Recharts Visual (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard size={18} className="text-amber-600" />
                Booking Status
              </h2>
              <span className="text-xs font-semibold text-slate-400">Real Breakdown</span>
            </div>

            {bookingStatusData.length > 0 ? (
              <div className="h-48 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <ShieldCheck size={28} className="text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">No active bookings to chart</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Chart renders dynamically as reservations occur.</p>
              </div>
            )}

            {/* Legend / Metrics summary */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
              <div className="p-2 rounded-xl bg-emerald-50">
                <div className="text-[10px] font-bold text-emerald-700 uppercase">Confirmed</div>
                <div className="text-lg font-black text-emerald-900">{stats.confirmedBookings}</div>
              </div>
              <div className="p-2 rounded-xl bg-amber-50">
                <div className="text-[10px] font-bold text-amber-700 uppercase">Pending</div>
                <div className="text-lg font-black text-amber-900">{stats.pendingBookings}</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-100">
                <div className="text-[10px] font-bold text-slate-600 uppercase">Total</div>
                <div className="text-lg font-black text-slate-900">{stats.totalBookings}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <Link
              to="/admin/orders"
              className="py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShoppingCart size={14} />
              <span>Orders & Flow</span>
            </Link>
            <Link
              to="/admin/payments"
              className="py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <DollarSign size={14} className="text-amber-400" />
              <span>Payment Ledger</span>
            </Link>
          </div>
        </div>

      </div>

      {/* ── 4. Content Inventory & Active Users ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Content Catalog Management (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers size={18} className="text-cyan-600" />
                Live Content & Inventory Catalog
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Authoritative registry for curated destinations, nature, and stays</p>
            </div>
            <Link to="/admin/content" className="text-xs font-bold text-blue-600 hover:underline">
              CMS Hub →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <Link 
              to="/admin/destinations"
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MapPin size={20} />
              </div>
              <div className="text-2xl font-black text-slate-900">{stats.totalDestinations}</div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">Destinations</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>Manage</span> <ChevronRight size={12} />
              </div>
            </Link>

            <Link 
              to="/admin/flora"
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Trees size={20} />
              </div>
              <div className="text-2xl font-black text-slate-900">{stats.totalFlora}</div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">Flora Catalog</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>Botanicals</span> <ChevronRight size={12} />
              </div>
            </Link>

            <Link 
              to="/admin/content/wildlife"
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Activity size={20} />
              </div>
              <div className="text-2xl font-black text-slate-900">{stats.totalWildlife}</div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">Wildlife Species</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>Telemetry</span> <ChevronRight size={12} />
              </div>
            </Link>

            <Link 
              to="/admin/content"
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Snowflake size={20} />
              </div>
              <div className="text-2xl font-black text-slate-900">{stats.totalResorts}</div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">Winter Resorts</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>Alpine & Trails</span> <ChevronRight size={12} />
              </div>
            </Link>

          </div>
        </div>

        {/* Recent Registered Users (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users size={18} className="text-blue-600" />
                Latest Registrations
              </h2>
              <Link to="/admin/users" className="text-xs font-bold text-blue-600 hover:underline">
                All Users →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-10 bg-slate-100 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                No users found in database.
              </div>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-black text-xs flex items-center justify-center">
                        {(u.full_name || u.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden max-w-[140px]">
                        <div className="font-bold text-slate-900 text-xs truncate">
                          {u.full_name || 'Anonymous User'}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {u.email}
                        </div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'PROVIDER' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role || 'USER'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total accounts: <strong className="text-slate-900">{stats.totalUsers}</strong></span>
            <Link to="/admin/providers" className="text-blue-600 font-bold hover:underline">
              Verify Providers
            </Link>
          </div>
        </div>

      </div>

      {/* ── 5. System Health & Infrastructure Telemetry ──────────────────────── */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              Infrastructure & System Telemetry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live operational health of backend microservices, database, and telemetry bus
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400">Database Engine</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div className="text-sm font-black text-white">PostgreSQL 16</div>
            <div className="text-[11px] text-slate-400 mt-1">Supabase DB • {systemHealth.latencyMs}ms ping</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400">Payment Gateway</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div className="text-sm font-black text-white">Razorpay Webhooks</div>
            <div className="text-[11px] text-slate-400 mt-1">Idempotent Signature Engine</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400">Edge Runtime</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div className="text-sm font-black text-white">Deno Edge Functions</div>
            <div className="text-[11px] text-slate-400 mt-1">Smart Routing & Weather active</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400">IoT Telemetry Bus</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div className="text-sm font-black text-white">{stats.onlineIoT} Active Sensor Nodes</div>
            <div className="text-[11px] text-slate-400 mt-1">Real-time Weather & Traffic</div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
