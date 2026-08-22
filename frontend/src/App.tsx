import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { GlobalOfflineBanner } from "./components/GlobalOfflineBanner";
import { MainLayout } from './components/layout/MainLayout';
import { RoleGuard } from './components/layout/RoleGuard';
import { ProviderGuard } from './components/layout/ProviderGuard';
import { useAuthStore } from './store/useAuthStore';
import { realtimeClient } from './services/realtime/realtimeClient';
import { Activities } from './pages/Activities';
import { ActivityDetails } from './pages/ActivityDetails';
import { RouteErrorBoundary } from './components/layout/GlobalErrorBoundary';

// --- Global Fallback Loader ---
const GlobalLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  </div>
);

// --- Auth-aware root redirect (ISSUE-008) ---
const RootRedirect = () => {
  const { user, loading } = useAuthStore();
  if (loading) return <GlobalLoader />;
  return <Navigate to={user ? '/home' : '/login'} replace />;
};

// --- 404 Not Found page (ISSUE-009) ---
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-navy-900 text-center px-6">
    <div className="text-8xl font-black text-blue-500 mb-4">404</div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
    <a href="/home" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
      Go to Home
    </a>
  </div>
);

// --- Lazy-loaded Pages ---
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Explore = lazy(() => import('./pages/Explore').then(m => ({ default: m.Explore })));
const DestinationDetails = lazy(() => import('./pages/DestinationDetails').then(m => ({ default: m.DestinationDetails })));
const SmartMap = lazy(() => import('./pages/SmartMap')); // default export
const TripPlanner = lazy(() => import('./pages/planner/TripPlanner').then(m => ({ default: m.TripPlanner })));
const ItineraryView = lazy(() => import('./pages/planner/ItineraryView').then(m => ({ default: m.ItineraryView })));
const Events = lazy(() => import('./pages/events/Events').then(m => ({ default: m.Events })));
const Insights = lazy(() => import('./pages/Insights').then(m => ({ default: m.Insights })));
const Stay = lazy(() => import('./pages/Stay').then(m => ({ default: m.Stay })));
const StayDetails = lazy(() => import('./pages/StayDetails').then(m => ({ default: m.StayDetails })));
const Travel = lazy(() => import('./pages/Travel').then(m => ({ default: m.Travel })));
const TransportDetails = lazy(() => import('./pages/TransportDetails').then(m => ({ default: m.TransportDetails })));
const RoadTrips = lazy(() => import('./pages/travel/RoadTrips').then(m => ({ default: m.RoadTrips })));
const Food = lazy(() => import('./pages/Food').then(m => ({ default: m.Food })));
const FoodDetails = lazy(() => import('./pages/FoodDetails').then(m => ({ default: m.FoodDetails })));
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword').then(m => ({ default: m.ResetPassword })));
const AuthCallback = lazy(() => import('./pages/auth/AuthCallback').then(m => ({ default: m.AuthCallback })));
const Dashboard = lazy(() => import('./pages/user/Dashboard').then(m => ({ default: m.Dashboard })));
const ProfileLayout = lazy(() => import('./pages/user/Profile/ProfileLayout').then(m => ({ default: m.ProfileLayout })));
const ProfileOverview = lazy(() => import('./pages/user/Profile/ProfileOverview').then(m => ({ default: m.ProfileOverview })));
const ProfilePreferences = lazy(() => import('./pages/user/Profile/ProfilePreferences').then(m => ({ default: m.ProfilePreferences })));
const ProfileSecurity = lazy(() => import('./pages/user/Profile/ProfileSecurity').then(m => ({ default: m.ProfileSecurity })));
const ProfilePrivacy = lazy(() => import('./pages/user/Profile/ProfilePrivacy').then(m => ({ default: m.ProfilePrivacy })));
const Wishlist = lazy(() => import('./pages/user/Wishlist').then(m => ({ default: m.Wishlist })));
const TripsList = lazy(() => import('./pages/user/Trips/TripsList').then(m => ({ default: m.TripsList })));
const TripDetails = lazy(() => import('./pages/user/Trips/TripDetails').then(m => ({ default: m.TripDetails })));
const Assistant = lazy(() => import('./pages/user/Assistant').then(m => ({ default: m.Assistant })));
const TravelWallet = lazy(() => import('./pages/user/TravelWallet').then(m => ({ default: m.TravelWallet })));
const Notifications = lazy(() => import('./pages/user/Notifications').then(m => ({ default: m.Notifications })));
const Reviews = lazy(() => import('./pages/user/Reviews').then(m => ({ default: m.Reviews })));
const TravelHistory = lazy(() => import('./pages/user/TravelHistory').then(m => ({ default: m.TravelHistory })));
const Expenses = lazy(() => import('./pages/user/Expenses').then(m => ({ default: m.Expenses })));
const NotificationSettings = lazy(() => import('./pages/user/NotificationSettings').then(m => ({ default: m.NotificationSettings })));
const ProviderDashboard = lazy(() => import('./pages/provider/ProviderDashboard').then(m => ({ default: m.ProviderDashboard })));
const ProviderLanding = lazy(() => import('./pages/provider/ProviderLanding').then(m => ({ default: m.ProviderLanding })));
const ProviderRegister = lazy(() => import('./pages/provider/ProviderRegister').then(m => ({ default: m.ProviderRegister })));
const ProviderLayout = lazy(() => import('./components/layout/ProviderLayout').then(m => ({ default: m.ProviderLayout })));
const ProviderListings = lazy(() => import('./pages/provider/listings/ProviderListings').then(m => ({ default: m.ProviderListings })));
const CreateListingWizard = lazy(() => import('./pages/provider/listings/CreateListingWizard').then(m => ({ default: m.CreateListingWizard })));
const ListingEditor = lazy(() => import('./pages/provider/listings/ListingEditor').then(m => ({ default: m.ListingEditor })));
const ListingPreview = lazy(() => import('./pages/provider/listings/ListingPreview').then(m => ({ default: m.ListingPreview })));
const ProviderCalendar = lazy(() => import('./pages/provider/operations/ProviderCalendar').then(m => ({ default: m.ProviderCalendar })));
const ProviderBookings = lazy(() => import('./pages/provider/operations/ProviderBookings').then(m => ({ default: m.ProviderBookings })));
const ProviderBookingDetails = lazy(() => import('./pages/provider/operations/ProviderBookingDetails').then(m => ({ default: m.ProviderBookingDetails })));
const ProviderCustomers = lazy(() => import('./pages/provider/operations/ProviderCustomers').then(m => ({ default: m.ProviderCustomers })));
const ProviderMessages = lazy(() => import('./pages/provider/operations/ProviderMessages').then(m => ({ default: m.ProviderMessages })));
const ProviderReviews = lazy(() => import('./pages/provider/marketing/ProviderReviews').then(m => ({ default: m.ProviderReviews })));
const ProviderFinance = lazy(() => import('./pages/provider/finance/ProviderFinance').then(m => ({ default: m.ProviderFinance })));
const ProviderAnalytics = lazy(() => import('./pages/provider/analytics/ProviderAnalytics').then(m => ({ default: m.ProviderAnalytics })));
const ProviderMarketing = lazy(() => import('./pages/provider/marketing/ProviderMarketing').then(m => ({ default: m.ProviderMarketing })));
const ProviderSettings = lazy(() => import('./pages/provider/settings/ProviderSettings').then(m => ({ default: m.ProviderSettings })));
const Impact = lazy(() => import('./pages/user/Impact').then(m => ({ default: m.Impact })));
const Wildlife = lazy(() => import('./pages/nature/Wildlife').then(m => ({ default: m.Wildlife })));
const WildlifeDetail = lazy(() => import('./pages/nature/WildlifeDetail').then(m => ({ default: m.WildlifeDetail })));
const Flora = lazy(() => import('./pages/nature/Flora').then(m => ({ default: m.Flora })));
const Invoices = lazy(() => import('./pages/user/Invoices').then(m => ({ default: m.Invoices })));
const LiveWeather = lazy(() => import('./pages/nature/LiveWeather').then(m => ({ default: m.LiveWeather })));
const AuroraTracker = lazy(() => import('./pages/nature/AuroraTracker').then(m => ({ default: m.AuroraTracker })));
const SafetyAlerts = lazy(() => import('./pages/nature/SafetyAlerts').then(m => ({ default: m.SafetyAlerts })));
const Sustainability = lazy(() => import('./pages/nature/Sustainability').then(m => ({ default: m.Sustainability })));
const Deals = lazy(() => import('./pages/travel/Deals').then(m => ({ default: m.Deals })));
const Guides = lazy(() => import('./pages/travel/Guides').then(m => ({ default: m.Guides })));
const HikingTrails = lazy(() => import('./pages/adventure/HikingTrails').then(m => ({ default: m.HikingTrails })));
const TrailDetails = lazy(() => import('./pages/adventure/TrailDetails').then(m => ({ default: m.TrailDetails })));
const WinterSports = lazy(() => import('./pages/adventure/WinterSports').then(m => ({ default: m.WinterSports })));
const WinterResortDetails = lazy(() => import('./pages/adventure/WinterResortDetails').then(m => ({ default: m.WinterResortDetails })));
const Products = lazy(() => import('./pages/marketplace/Products').then(m => ({ default: m.Products })));
const Checkout = lazy(() => import('./pages/checkout/Checkout').then(m => ({ default: m.Checkout })));
const PaymentSuccess = lazy(() => import('./pages/checkout/PaymentSuccess').then(m => ({ default: m.PaymentSuccess })));
const StayBooking = lazy(() => import('./pages/checkout/StayBooking').then(m => ({ default: m.StayBooking })));
const MyBookings = lazy(() => import('./pages/user/MyBookings').then(m => ({ default: m.MyBookings })));
const BookingDetails = lazy(() => import('./pages/user/BookingDetails').then(m => ({ default: m.BookingDetails })));
const Infrastructure = lazy(() => import('./pages/industry/Infrastructure').then(m => ({ default: m.Infrastructure })));
const SmartCity = lazy(() => import('./pages/city/SmartCity').then(m => ({ default: m.SmartCity })));
const Recommendations = lazy(() => import('./pages/planner/Recommendations').then(m => ({ default: m.Recommendations })));
const EVCharging = lazy(() => import('./pages/mobility/EVCharging').then(m => ({ default: m.EVCharging })));
const EVStationDetails = lazy(() => import('./pages/mobility/EVStationDetails').then(m => ({ default: m.EVStationDetails })));
const SmartFerry = lazy(() => import('./pages/mobility/SmartFerry').then(m => ({ default: m.SmartFerry })));
const EnergyDashboard = lazy(() => import('./pages/infrastructure/EnergyDashboard').then(m => ({ default: m.EnergyDashboard })));
const IoTDashboard = lazy(() => import('./pages/infrastructure/IoTDashboard').then(m => ({ default: m.IoTDashboard })));
const DeviceDetail = lazy(() => import('./pages/infrastructure/DeviceDetail').then(m => ({ default: m.DeviceDetail })));
const SmartNorway = lazy(() => import('./pages/SmartNorway').then(m => ({ default: m.SmartNorway })));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import('./pages/admin/auth/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminAnalytics = lazy(() => import('./pages/admin/analytics/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminPageRegistry = lazy(() => import('./pages/admin/system/AdminPageRegistry').then(m => ({ default: m.AdminPageRegistry })));
const AdminDataQuality = lazy(() => import('./pages/admin/system/AdminDataQuality').then(m => ({ default: m.AdminDataQuality })));
const AdminUsers = lazy(() => import('./pages/admin/users/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminUserDetails = lazy(() => import('./pages/admin/users/AdminUserDetails').then(m => ({ default: m.AdminUserDetails })));
const AdminProviders = lazy(() => import('./pages/admin/providers/AdminProviders').then(m => ({ default: m.AdminProviders })));
const AdminProviderVerification = lazy(() => import('./pages/admin/providers/AdminProviderVerification').then(m => ({ default: m.AdminProviderVerification })));
const AdminModeration = lazy(() => import('./pages/admin/moderation/AdminModeration').then(m => ({ default: m.AdminModeration })));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings').then(m => ({ default: m.AdminBookings })));
const AdminPayments = lazy(() => import('./pages/admin/commerce/AdminPayments').then(m => ({ default: m.AdminPayments })));
const AdminDestinations = lazy(() => import('./pages/admin/AdminDestinations').then(m => ({ default: m.AdminDestinations })));
const AdminContent = lazy(() => import('./pages/admin/content/AdminContent').then(m => ({ default: m.AdminContent })));
const AdminWildlifeCMS = lazy(() => import('./pages/admin/content/AdminWildlifeCMS').then(m => ({ default: m.AdminWildlifeCMS })));
const AdminFloraCMS = lazy(() => import('./pages/admin/content/AdminFloraCMS').then(m => ({ default: m.AdminFloraCMS })));
const AdminMedia = lazy(() => import('./pages/admin/content/AdminMedia').then(m => ({ default: m.AdminMedia })));
const PlacesCMS = lazy(() => import('./pages/admin/content/PlacesCMS').then(m => ({ default: m.PlacesCMS })));
const StaysCMS = lazy(() => import('./pages/admin/content/StaysCMS').then(m => ({ default: m.StaysCMS })));
const ActivitiesCMS = lazy(() => import('./pages/admin/content/ActivitiesCMS').then(m => ({ default: m.ActivitiesCMS })));

const AdminLiveOperations = lazy(() => import('./pages/admin/operations/AdminLiveOperations').then(m => ({ default: m.AdminLiveOperations })));
const AdminIoT = lazy(() => import('./pages/admin/iot/AdminIoT').then(m => ({ default: m.AdminIoT })));
const AdminSettings = lazy(() => import('./pages/admin/system/AdminSettings').then(m => ({ default: m.AdminSettings })));
const FoodCMS = lazy(() => import('./pages/admin/content/FoodCMS').then(m => ({ default: m.FoodCMS })));
const TrailsCMS = lazy(() => import('./pages/admin/content/TrailsCMS').then(m => ({ default: m.TrailsCMS })));
const SkiResortsCMS = lazy(() => import('./pages/admin/content/SkiResortsCMS').then(m => ({ default: m.SkiResortsCMS })));
const RoadTripsCMS = lazy(() => import('./pages/admin/content/RoadTripsCMS').then(m => ({ default: m.RoadTripsCMS })));
const AuroraCMS = lazy(() => import('./pages/admin/content/AuroraCMS').then(m => ({ default: m.AuroraCMS })));
const RelationshipsCMS = lazy(() => import('./pages/admin/content/RelationshipsCMS').then(m => ({ default: m.RelationshipsCMS })));
const TranslationsCMS = lazy(() => import('./pages/admin/content/TranslationsCMS').then(m => ({ default: m.TranslationsCMS })));
const AdminEvents = lazy(() => import('./pages/admin/content/AdminEvents').then(m => ({ default: m.AdminEvents })));
const AdminDeals = lazy(() => import('./pages/admin/content/AdminDeals').then(m => ({ default: m.AdminDeals })));
const ImportManager = lazy(() => import('./pages/admin/data/ImportManager').then(m => ({ default: m.ImportManager })));
const AdminPageHealth = lazy(() => import('./pages/admin/system/AdminPageHealth').then(m => ({ default: m.AdminPageHealth })));
const AdminSecurityEvents = lazy(() => import('./pages/admin/security/AdminSecurityEvents').then(m => ({ default: m.AdminSecurityEvents })));
const SecuritySettings = lazy(() => import('./pages/settings/SecuritySettings').then(m => ({ default: m.SecuritySettings })));

import { ToastContainer } from './components/ui/ToastContainer';

function App() {
  useEffect(() => {
    realtimeClient.initialize();
    return () => {
      realtimeClient.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <GlobalOfflineBanner />
      <ToastContainer />
      <Toaster position="top-right" richColors />
      <Suspense fallback={<GlobalLoader />}>
        <Routes>
          {/* Root redirect — auth-aware (ISSUE-008) */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/provider/join" element={<ProviderLanding />} />
          <Route path="/provider/register" element={<ProviderRegister />} />
          
          <Route element={<ProtectedRoute />}>
            {/* ── GROUP 1: Main public routes ─────────────────────────────── */}
            <Route element={
              <RouteErrorBoundary groupName="Main">
                <MainLayout />
              </RouteErrorBoundary>
            }>
              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/destinations" element={<Navigate to="/explore" replace />} />
              <Route path="/explore/:slug" element={<DestinationDetails />} />
              <Route path="/smart-city" element={<SmartCity />} />
              <Route path="/smart-map" element={<Navigate to="/map" replace />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/trails" element={<HikingTrails />} />
              <Route path="/trails/:id" element={<TrailDetails />} />
              <Route path="/winter" element={<WinterSports />} />
              <Route path="/winter/:id" element={<WinterResortDetails />} />
              <Route path="/shop" element={<Products />} />
              <Route path="/products" element={<Products />} />
              {/* /industry removed — duplicate of /infrastructure (ISSUE-010) */}

              {/* User Settings Pages */}
              <Route path="/settings/security" element={<SecuritySettings />} />

              {/* Redirected Destination Categories */}
              <Route path="/places" element={<Navigate to="/explore?type=LANDMARK" replace />} />
              <Route path="/nature" element={<Navigate to="/explore?type=NATIONAL_PARK" replace />} />
              <Route path="/fjords" element={<Navigate to="/explore?type=FJORD" replace />} />
              <Route path="/mountains" element={<Navigate to="/trails" replace />} />
              <Route path="/wildlife" element={<Wildlife />} />
              <Route path="/wildlife/:id" element={<WildlifeDetail />} />
              <Route path="/flora" element={<Flora />} />
              <Route path="/nature/flora" element={<Flora />} />
              <Route path="/nature/plants-trees" element={<Flora />} />
              <Route path="/plants-trees" element={<Navigate to="/nature/plants-trees" replace />} />
              <Route path="/resorts" element={<WinterSports />} />
              <Route path="/food" element={<Food />} />
              <Route path="/restaurants" element={<Navigate to="/food" replace />} />
              <Route path="/hotels" element={<Navigate to="/stay" replace />} />
              <Route path="/stay" element={<Stay />} />
              <Route path="/stay/:id" element={<StayDetails />} />
              <Route path="/food/:id" element={<FoodDetails />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/:id" element={<ActivityDetails />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/transport" element={<Navigate to="/travel" replace />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/travel/route/:id" element={<TransportDetails />} />
              <Route path="/road-trips" element={<RoadTrips />} />
              <Route path="/events" element={<Events />} />
              <Route path="/live" element={<SmartNorway />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/packages" element={<Navigate to="/deals" replace />} />
              <Route path="/guides" element={<Guides />} />

              {/* ── GROUP 2: Dashboard routes ───────────────────────────── */}
              <Route path="/dashboard" element={
                <RouteErrorBoundary groupName="Dashboard">
                  <Dashboard />
                </RouteErrorBoundary>
              } />
              <Route path="/profile" element={<ProfileLayout />}>
                <Route index element={<ProfileOverview />} />
                <Route path="preferences" element={<ProfilePreferences />} />
                <Route path="security" element={<ProfileSecurity />} />
                <Route path="privacy" element={<ProfilePrivacy />} />
              </Route>
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/trips" element={<TripsList />} />
              <Route path="/trips/:id" element={<TripDetails />} />
              <Route path="/wallet" element={<TravelWallet />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/history" element={<TravelHistory />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/settings/notifications" element={<NotificationSettings />} />
              <Route path="/user/bookings" element={<MyBookings />} />
              <Route path="/user/bookings/:id" element={<BookingDetails />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/user/invoices" element={<Invoices />} />

              {/* ── GROUP 3: Maps & Smart City ──────────────────────────── */}
              <Route path="/map" element={
                <RouteErrorBoundary groupName="Maps">
                  <SmartMap />
                </RouteErrorBoundary>
              } />
              <Route path="/planner" element={<TripPlanner />} />
              <Route path="/ai-planner" element={<Navigate to="/planner" replace />} />
              <Route path="/plan-trip" element={<Navigate to="/planner" replace />} />
              <Route path="/planner/itinerary/:id" element={<ItineraryView />} />
              <Route path="/weather" element={<LiveWeather />} />
              <Route path="/aurora" element={<AuroraTracker />} />
              <Route path="/safety" element={<SafetyAlerts />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/mobility/ev" element={<EVCharging />} />
              <Route path="/mobility/ev/:id" element={<EVStationDetails />} />
              <Route path="/mobility/ferry" element={<SmartFerry />} />
              <Route path="/infrastructure/energy" element={<EnergyDashboard />} />
              <Route path="/infrastructure/iot" element={<IoTDashboard />} />
              <Route path="/infrastructure/iot/:id" element={<DeviceDetail />} />

              {/* ── GROUP 4: Checkout & Payment ─────────────────────────── */}
              <Route path="/checkout" element={
                <RouteErrorBoundary groupName="Checkout">
                  <Checkout />
                </RouteErrorBoundary>
              } />
              <Route path="/payment-success" element={
                <RouteErrorBoundary groupName="Checkout">
                  <PaymentSuccess />
                </RouteErrorBoundary>
              } />
              <Route path="/checkout/booking/:roomId" element={
                <RouteErrorBoundary groupName="Checkout">
                  <StayBooking />
                </RouteErrorBoundary>
              } />

              {/* ── GROUP 5: AI Functionality ───────────────────────────── */}
              <Route path="/assistant" element={
                <RouteErrorBoundary groupName="AI Assistant">
                  <Assistant />
                </RouteErrorBoundary>
              } />
            </Route>

            {/* ── GROUP 6: Provider B2B Routes ───────────────────────── */}
            <Route path="/provider" element={<ProviderGuard />}>
              {/* Fullscreen Wizards & Editors */}
              <Route path="listings/:id/edit" element={
                <RouteErrorBoundary groupName="Provider">
                  <ListingEditor />
                </RouteErrorBoundary>
              } />
              <Route path="listings/:id/preview" element={
                <RouteErrorBoundary groupName="Provider">
                  <ListingPreview />
                </RouteErrorBoundary>
              } />

              {/* Standard Dashboard Layout */}
              <Route element={
                <RouteErrorBoundary groupName="Provider">
                  <ProviderLayout />
                </RouteErrorBoundary>
              }>
                <Route path="dashboard" element={<ProviderDashboard />} />
                <Route path="listings" element={<ProviderListings />} />
                <Route path="listings/new" element={<CreateListingWizard />} />
                <Route path="calendar" element={<ProviderCalendar />} />
                <Route path="bookings" element={<ProviderBookings />} />
                <Route path="bookings/:id" element={<ProviderBookingDetails />} />
                <Route path="customers" element={<ProviderCustomers />} />
                <Route path="messages" element={<ProviderMessages />} />
                <Route path="reviews" element={<ProviderReviews />} />
                <Route path="finance" element={<ProviderFinance />} />
                <Route path="analytics" element={<ProviderAnalytics />} />
                <Route path="marketing" element={<ProviderMarketing />} />
                <Route path="settings" element={<ProviderSettings />} />
              </Route>
            </Route>
              
            {/* Admin Auth Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ── Admin Routes ───────────────────────────────────────── */}
            <Route path="/admin" element={<RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
              <Route element={
                <RouteErrorBoundary groupName="Admin">
                  <AdminLayout />
                </RouteErrorBoundary>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="pages" element={<AdminPageRegistry />} />
                <Route path="data-quality" element={<AdminDataQuality />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminUserDetails />} />
                <Route path="providers" element={<AdminProviders />} />
                <Route path="providers/verification" element={<AdminProviderVerification />} />
                <Route path="moderation" element={<AdminModeration />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="destinations" element={<AdminDestinations />} />
                
                {/* Operations & Settings Routes */}
                <Route path="operations" element={<AdminLiveOperations />} />
                <Route path="iot" element={<AdminIoT />} />
                <Route path="settings" element={<AdminSettings />} />
                
                {/* CMS Routes */}
                <Route path="content" element={<AdminContent />} />
                <Route path="content/wildlife" element={<AdminWildlifeCMS />} />
                <Route path="content/flora" element={<AdminFloraCMS />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="content/places" element={<PlacesCMS />} />
                <Route path="content/stays" element={<StaysCMS />} />
                <Route path="content/activities" element={<ActivitiesCMS />} />
                <Route path="content/trails" element={<TrailsCMS />} />
                <Route path="content/skiresorts" element={<SkiResortsCMS />} />
                <Route path="content/roadtrips" element={<RoadTripsCMS />} />
                <Route path="content/aurora" element={<AuroraCMS />} />
                <Route path="content/relationships" element={<RelationshipsCMS />} />
                <Route path="content/translations" element={<TranslationsCMS />} />
                <Route path="content/food" element={<FoodCMS />} />
                <Route path="content/events" element={<AdminEvents />} />
                <Route path="content/deals" element={<AdminDeals />} />
                
                {/* Operations Routes */}
                <Route path="operations/import" element={<ImportManager />} />
                <Route path="infrastructure" element={<AdminIoT />} />
                <Route path="health" element={<AdminPageHealth />} />
                
                {/* Catch-all for unimplemented admin routes */}
                <Route path="*" element={
                  <div className="flex items-center justify-center h-full p-8 text-gray-500">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2 text-navy-900">Coming Soon</h2>
                      <p>This administrative module is not yet implemented in the current prototype.</p>
                    </div>
                  </div>
                } />
              </Route>
            </Route>
          </Route>

          {/* Global 404 catch-all (ISSUE-009) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          className: 'bg-white dark:bg-navy-800 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white',
        }} 
      />
    </BrowserRouter>
  );
}

export default App; // HMR forced reload
