export type PageCategory = 
  | "Core" | "Destinations" | "Stay" | "Travel" | "Food" 
  | "Adventure" | "Nature" | "Aurora & Weather" | "Safety" 
  | "Events" | "Planner" | "Smart Norway" | "Commerce" 
  | "User" | "Provider" | "Admin" | "Authentication";

export type PageStatus = 
  | "NOT_STARTED" | "IN_PROGRESS" | "UI_COMPLETE" 
  | "RESPONSIVE_COMPLETE" | "DATA_COMPLETE" | "QA_COMPLETE" 
  | "PRODUCTION_READY";

export interface PageRegistryEntry {
  id: string;
  route: string;
  name: string;
  category: PageCategory;
  theme?: string;
  dependsOn?: string[];
  status: PageStatus;
  mobileComplete: boolean;
  desktopComplete: boolean;
  contentComplete: boolean;
  dataComplete: boolean;
  qaComplete: boolean;
}

export const pageRegistry: PageRegistryEntry[] = [
  // --- AUTHENTICATION ---
  {
    id: "login", route: "/", name: "Login", category: "Authentication", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "register", route: "/register", name: "Register", category: "Authentication", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "forgot-password", route: "/forgot-password", name: "Forgot Password", category: "Authentication", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "reset-password", route: "/reset-password", name: "Reset Password", category: "Authentication", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "auth-callback", route: "/auth/callback", name: "Auth Callback", category: "Authentication", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- CORE ---
  {
    id: "home", route: "/home", name: "Home Dashboard", category: "Core", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "explore", route: "/explore", name: "Explore Norway", category: "Core", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "map", route: "/map", name: "Smart Map", category: "Core", theme: "polar-indigo", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- DESTINATIONS ---
  {
    id: "destination-details", route: "/explore/:slug", name: "Destination Details", category: "Destinations", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- STAY ---
  {
    id: "stay", route: "/stay", name: "Stays & Hotels", category: "Stay", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "stay-details", route: "/stay/:id", name: "Stay Details", category: "Stay", theme: "standard", dependsOn: ["stay"], status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- TRAVEL ---
  {
    id: "travel", route: "/travel", name: "Transport & Travel", category: "Travel", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "transport-details", route: "/travel/route/:id", name: "Route Details", category: "Travel", theme: "standard", dependsOn: ["travel"], status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- FOOD ---
  {
    id: "food", route: "/food", name: "Culinary Experiences", category: "Food", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "food-details", route: "/food/:id", name: "Restaurant Details", category: "Food", theme: "standard", dependsOn: ["food"], status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- ADVENTURE ---
  {
    id: "activities", route: "/activities", name: "Activities", category: "Adventure", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "trails", route: "/trails", name: "Hiking Trails", category: "Adventure", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "trail-details", route: "/trails/:id", name: "Trail Details", category: "Adventure", theme: "standard", dependsOn: ["trails"], status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "winter", route: "/winter", name: "Winter Sports", category: "Adventure", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "winter-details", route: "/winter/:id", name: "Ski Resort Details", category: "Adventure", theme: "standard", dependsOn: ["winter"], status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- NATURE ---
  {
    id: "wildlife", route: "/wildlife", name: "Wildlife Tracking", category: "Nature", theme: "nordic-sage", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "wildlife-details", route: "/wildlife/:id", name: "Wildlife Species Details", category: "Nature", theme: "nordic-sage", dependsOn: ["wildlife"], status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- AURORA & WEATHER ---
  {
    id: "aurora", route: "/aurora", name: "Aurora Tracker", category: "Aurora & Weather", theme: "aurora-violet", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "weather", route: "/weather", name: "Live Weather", category: "Aurora & Weather", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- SAFETY ---
  {
    id: "safety", route: "/safety", name: "Safety Alerts", category: "Safety", theme: "crimson-alert", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- EVENTS ---
  {
    id: "events", route: "/events", name: "Events & Culture", category: "Events", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- PLANNER ---
  {
    id: "planner", route: "/planner", name: "AI Trip Planner", category: "Planner", theme: "lavender-ice", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "itinerary", route: "/planner/itinerary/:id", name: "Generated Itinerary", category: "Planner", theme: "lavender-ice", dependsOn: ["planner"], status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "recommendations", route: "/recommendations", name: "Smart Recommendations", category: "Planner", theme: "northern-cyan", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- SMART NORWAY ---
  {
    id: "live", route: "/live", name: "Smart Norway Dashboard", category: "Smart Norway", theme: "deep-night", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "smart-city", route: "/smart-city", name: "Smart City", category: "Smart Norway", theme: "northern-cyan", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "infrastructure", route: "/infrastructure", name: "National Infrastructure", category: "Smart Norway", theme: "polar-indigo", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "energy", route: "/infrastructure/energy", name: "Energy Dashboard", category: "Smart Norway", theme: "amber-warm", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "iot", route: "/infrastructure/iot", name: "IoT Telemetry", category: "Smart Norway", theme: "polar-indigo", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "iot-device", route: "/infrastructure/iot/:id", name: "Device Details", category: "Smart Norway", theme: "polar-indigo", dependsOn: ["iot"], status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "ev-charging", route: "/mobility/ev", name: "EV Charging Network", category: "Smart Norway", theme: "glacier-mint", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "ev-station", route: "/mobility/ev/:id", name: "EV Station Details", category: "Smart Norway", theme: "glacier-mint", dependsOn: ["ev-charging"], status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "smart-ferry", route: "/mobility/ferry", name: "Smart Ferries", category: "Smart Norway", theme: "ocean-steel", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "sustainability", route: "/impact", name: "Sustainability Impact", category: "Smart Norway", theme: "glacier-mint", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- COMMERCE ---
  {
    id: "deals", route: "/deals", name: "Travel Deals", category: "Commerce", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "products", route: "/products", name: "Marketplace", category: "Commerce", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "guides", route: "/guides", name: "Travel Guides", category: "Commerce", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "checkout", route: "/checkout", name: "Checkout", category: "Commerce", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "stay-booking", route: "/checkout/booking/:roomId", name: "Stay Booking", category: "Commerce", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "payment-success", route: "/payment-success", name: "Payment Success", category: "Commerce", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- USER ---
  {
    id: "dashboard", route: "/dashboard", name: "User Dashboard", category: "User", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "profile", route: "/profile", name: "User Profile", category: "User", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "notifications", route: "/settings/notifications", name: "Notification Settings", category: "User", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "user-bookings", route: "/user/bookings", name: "My Bookings", category: "User", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "insights", route: "/insights", name: "Travel Insights", category: "User", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- PROVIDER ---
  {
    id: "provider-dashboard", route: "/provider/dashboard", name: "Provider Dashboard", category: "Provider", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },

  // --- ADMIN ---
  {
    id: "admin-dashboard", route: "/admin", name: "Admin Dashboard", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-users", route: "/admin/users", name: "User Management", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-bookings", route: "/admin/bookings", name: "Booking Management", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-destinations", route: "/admin/destinations", name: "Destinations CMS", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-places", route: "/admin/content/places", name: "Places CMS", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-stays", route: "/admin/content/stays", name: "Stays CMS", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-activities", route: "/admin/content/activities", name: "Activities CMS", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-food", route: "/admin/content/food", name: "Food CMS", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-events", route: "/admin/content/events", name: "Events CMS", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-deals", route: "/admin/content/deals", name: "Deals CMS", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-import", route: "/admin/operations/import", name: "Data Importer", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-iot", route: "/admin/infrastructure", name: "Infrastructure Control", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  },
  {
    id: "admin-health", route: "/admin/health", name: "Page Health Audit", category: "Admin", theme: "standard", status: "PRODUCTION_READY",
    mobileComplete: true, desktopComplete: true, contentComplete: true, dataComplete: true, qaComplete: true
  }
];
