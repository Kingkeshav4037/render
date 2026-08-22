export const routes = {
  // Auth
  login: "/",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  authCallback: "/auth/callback",

  // Core
  home: "/home",
  explore: "/explore",
  destinationDetails: "/explore/:slug",
  map: "/map",
  search: "/search", // Assuming this will exist

  // Smart Norway / Infrastructure
  smartCity: "/smart-city",
  smartNorway: "/live",
  infrastructure: "/infrastructure",
  energy: "/infrastructure/energy",
  iot: "/infrastructure/iot",
  iotDevice: "/infrastructure/iot/:id",
  sustainability: "/impact",

  // Mobility
  ev: "/mobility/ev",
  evStation: "/mobility/ev/:id",
  ferry: "/mobility/ferry",
  transport: "/travel",
  transportDetails: "/travel/route/:id",

  // Nature / Adventure
  trails: "/trails",
  trailDetails: "/trails/:id",
  winter: "/winter",
  winterResort: "/winter/:id",
  wildlife: "/wildlife",
  wildlifeDetails: "/wildlife/:id",
  activities: "/activities",
  
  // Weather & Aurora & Safety
  weather: "/weather",
  aurora: "/aurora",
  safety: "/safety",

  // Food & Stay
  food: "/food",
  foodDetails: "/food/:id",
  stay: "/stay",
  stayDetails: "/stay/:id",

  // Planner
  planner: "/planner",
  itinerary: "/planner/itinerary/:id",
  recommendations: "/recommendations",
  insights: "/insights",

  // Commerce
  products: "/products",
  deals: "/deals",
  guides: "/guides",
  checkout: "/checkout",
  paymentSuccess: "/payment-success",
  stayBooking: "/checkout/booking/:roomId",

  // User
  dashboard: "/dashboard",
  profile: "/profile",
  notifications: "/settings/notifications",
  userBookings: "/user/bookings",

  // Provider
  providerDashboard: "/provider/dashboard",

  // Admin
  adminDashboard: "/admin",
  adminUsers: "/admin/users",
  adminBookings: "/admin/bookings",
  adminPayments: "/admin/payments",
  adminDestinations: "/admin/destinations",
  adminPlacesCMS: "/admin/content/places",
  adminStaysCMS: "/admin/content/stays",
  adminActivitiesCMS: "/admin/content/activities",
  adminFoodCMS: "/admin/content/food",
  adminEventsCMS: "/admin/content/events",
  adminDealsCMS: "/admin/content/deals",
  adminImport: "/admin/operations/import",
  adminIoT: "/admin/infrastructure",
  adminHealth: "/admin/health", // New

  // Redirects/Legacy
  legacyDestinations: "/destinations",
  legacyPlaces: "/places",
  legacyNature: "/nature",
  legacyFjords: "/fjords",
  legacyMountains: "/mountains",
  legacyResorts: "/resorts",
  legacyRestaurants: "/restaurants",
  legacyHotels: "/hotels",
  legacyTransport: "/transport",
  legacyPackages: "/packages",
};
