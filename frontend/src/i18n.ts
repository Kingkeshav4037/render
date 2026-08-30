import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (UK/US)', flag: '🇬🇧' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk (Bokmål)', flag: '🇳🇴' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

// Base English Dictionary
const en = {
  translation: {
    nav: {
      discover: "Discover",
      explore: "Explore",
      destinations: "Destinations",
      nature: "Nature & Parks",
      wildlife: "Wildlife",
      flora: "Plants & Trees",
      history: "History & Heritage",
      infrastructure: "Infrastructure",
      aurora: "Aurora Tracker",
      experiences: "Experiences",
      activities: "Activities",
      trails: "Hiking Trails",
      stays: "Fjord Stays",
      food: "Culinary & Dining",
      winter: "Winter Sports",
      deals: "Special Deals",
      events: "Cultural Events",
      plan: "Plan & Sustainability",
      itinerary: "Trip Planner",
      recommendations: "Smart Recommendations",
      weather: "Live Weather",
      guidelines: "Leave No Trace",
      impact: "Eco Calculator",
      smart_city: "Smart City & Tech",
      iot: "Live IoT Dashboard",
      smart_norway: "Smart Norway Hub",
      ev_charging: "EV Charging Map",
      transit: "Public Transit",
      smart_mobility: "Smart Mobility",
      road_trips: "Scenic Road Trips",
      login: "Log in",
      signup: "Sign Up",
      account: "Account",
      my_norway: "My Norway",
      my_bookings: "My Bookings",
      invoices: "Invoices & Receipts",
      profile: "Profile & Settings",
      sign_out: "Sign Out",
      cart: "Shopping Cart",
      search: "Search site"
    },
    common: {
      explore: "Explore",
      reserve: "Reserve",
      book_now: "Book Now",
      order_dish: "Order Dish",
      add_to_cart: "Add to Cart",
      proceed_to_checkout: "Proceed to Checkout",
      view_guide: "View Guide",
      clear_filters: "Clear Filters",
      all: "All",
      price: "Price",
      subtotal: "Subtotal",
      free: "Free"
    },
    home: {
      hero: {
        title: "The Norwegian Way of Life.",
        subtitle: "A personalized ecosystem for discovering, booking, and experiencing the majestic landscapes, smart cities, and sustainable future of Norway."
      }
    },
    dashboard: {
      welcome: "Welcome back",
      upcoming: "Upcoming Trip",
      open_trip: "Open Trip",
      saved_places: "Saved Places",
      impact: "Travel Impact",
      recommendations: "Recommendations"
    }
  }
};

// Base Norwegian Dictionary (Norsk)
const no = {
  translation: {
    nav: {
      discover: "Oppdag",
      explore: "Utforsk",
      destinations: "Destinasjoner",
      nature: "Natur og Nasjonalparker",
      wildlife: "Dyreliv",
      flora: "Planter og Trær",
      history: "Historie og Kulturarv",
      infrastructure: "Infrastruktur",
      aurora: "Nordlys-varsel",
      experiences: "Opplevelser",
      activities: "Aktiviteter",
      trails: "Fjellturer og Stier",
      stays: "Fjord-overnatting",
      food: "Mat og Gastronomi",
      winter: "Vintersport",
      deals: "Spesialtilbud",
      events: "Kulturarrangementer",
      plan: "Planlegging og Bærekraft",
      itinerary: "Reiseplanlegger",
      recommendations: "Smarte Anbefalinger",
      weather: "Værvarsel i sanntid",
      guidelines: "Sporløs Ferdsel",
      impact: "Miljøkalkulator",
      smart_city: "Smartby og Teknologi",
      iot: "Sanntids IoT-panel",
      smart_norway: "Smart Norge Hub",
      ev_charging: "Ladekart for Elbil",
      transit: "Kollektivtransport",
      smart_mobility: "Smart Mobilitet",
      road_trips: "Nasjonale Turistveger",
      login: "Logg inn",
      signup: "Registrer deg",
      account: "Konto",
      my_norway: "Mitt Norge",
      my_bookings: "Mine Bestillinger",
      invoices: "Fakturaer og Kvitteringer",
      profile: "Profil og Innstillinger",
      sign_out: "Logg ut",
      cart: "Handlekurv",
      search: "Søk i portalen"
    },
    common: {
      explore: "Utforsk",
      reserve: "Reserver bord",
      book_now: "Bestill nå",
      order_dish: "Bestill rett",
      add_to_cart: "Legg i handlekurv",
      proceed_to_checkout: "Gå til kassen",
      view_guide: "Se guide",
      clear_filters: "Nullstill filtre",
      all: "Alle",
      price: "Pris",
      subtotal: "Delsum",
      free: "Gratis"
    },
    home: {
      hero: {
        title: "Den Norske Måten å Leve På.",
        subtitle: "Et personlig økosystem for å oppdage, bestille og oppleve de majestetiske landskapene, smarte byene og den bærekraftige fremtiden i Norge."
      }
    },
    dashboard: {
      welcome: "Velkommen tilbake",
      upcoming: "Kommende Reise",
      open_trip: "Åpne Reise",
      saved_places: "Lagrede Steder",
      impact: "Reisens Miljøpåvirkning",
      recommendations: "Anbefalinger"
    }
  }
};

// German Dictionary (Deutsch)
const de = {
  translation: {
    nav: {
      discover: "Entdecken",
      explore: "Erkunden",
      destinations: "Reiseziele",
      nature: "Natur & Nationalparks",
      wildlife: "Tierwelt",
      flora: "Pflanzen & Bäume",
      history: "Geschichte & Kulturerbe",
      infrastructure: "Infrastruktur",
      aurora: "Nordlicht-Tracker",
      experiences: "Erlebnisse",
      activities: "Aktivitäten",
      trails: "Wanderwege",
      stays: "Fjord-Unterkünfte",
      food: "Kulinarik & Gastronomie",
      winter: "Wintersport",
      deals: "Sonderangebote",
      events: "Kulturelle Events",
      plan: "Planung & Nachhaltigkeit",
      itinerary: "Reiseplaner",
      recommendations: "Smarte Empfehlungen",
      weather: "Live-Wetter",
      guidelines: "Spurlos reisen",
      impact: "Öko-Rechner",
      smart_city: "Smart City & Technologie",
      iot: "Live IoT Dashboard",
      smart_norway: "Smart Norwegen Hub",
      ev_charging: "E-Auto Ladestationen",
      transit: "Öffentlicher Nahverkehr",
      smart_mobility: "Smarte Mobilität",
      road_trips: "Panoramastraßen",
      login: "Anmelden",
      signup: "Registrieren",
      account: "Konto",
      my_norway: "Mein Norwegen",
      my_bookings: "Meine Buchungen",
      invoices: "Rechnungen & Belege",
      profile: "Profil & Einstellungen",
      sign_out: "Abmelden",
      cart: "Warenkorb",
      search: "Suche"
    },
    common: {
      explore: "Erkunden",
      reserve: "Reservieren",
      book_now: "Jetzt buchen",
      order_dish: "Gericht bestellen",
      add_to_cart: "In den Warenkorb",
      proceed_to_checkout: "Zur Kasse gehen",
      view_guide: "Guide ansehen",
      clear_filters: "Filter löschen",
      all: "Alle",
      price: "Preis",
      subtotal: "Zwischensumme",
      free: "Kostenlos"
    },
    home: {
      hero: {
        title: "Die norwegische Lebensart.",
        subtitle: "Ein personalisiertes Ökosystem zum Entdecken, Buchen und Erleben der majestätischen Landschaften und der nachhaltigen Zukunft Norwegens."
      }
    },
    dashboard: {
      welcome: "Willkommen zurück",
      upcoming: "Bevorstehende Reise",
      open_trip: "Reise öffnen",
      saved_places: "Gespeicherte Orte",
      impact: "Reiseauswirkungen",
      recommendations: "Empfehlungen"
    }
  }
};

// Spanish Dictionary (Español)
const es = {
  translation: {
    nav: {
      discover: "Descubrir",
      explore: "Explorar",
      destinations: "Destinos",
      nature: "Naturaleza y Parques",
      wildlife: "Vida Silvestre",
      flora: "Flora y Bosques",
      history: "Historia y Patrimonio",
      infrastructure: "Infraestructura",
      aurora: "Rastreador de Auroras",
      experiences: "Experiencias",
      activities: "Actividades",
      trails: "Rutas de Senderismo",
      stays: "Alojamientos en Fiordos",
      food: "Gastronomía Nórdica",
      winter: "Deportes de Invierno",
      deals: "Ofertas Especiales",
      events: "Eventos Culturales",
      plan: "Planificación y Sostenibilidad",
      itinerary: "Planificador de Viajes",
      recommendations: "Recomendaciones Inteligentes",
      weather: "Clima en Tiempo Real",
      guidelines: "Sin Dejar Rastro",
      impact: "Calculadora Ecológica",
      smart_city: "Ciudad Inteligente y Tecnología",
      iot: "Panel IoT en Vivo",
      smart_norway: "Hub Smart Noruega",
      ev_charging: "Carga de Vehículos Eléctricos",
      transit: "Transporte Público",
      smart_mobility: "Movilidad Inteligente",
      road_trips: "Rutas Escénicas",
      login: "Iniciar sesión",
      signup: "Registrarse",
      account: "Cuenta",
      my_norway: "Mi Noruega",
      my_bookings: "Mis Reservas",
      invoices: "Facturas y Recibos",
      profile: "Perfil y Ajustes",
      sign_out: "Cerrar sesión",
      cart: "Carrito",
      search: "Buscar"
    },
    common: {
      explore: "Explorar",
      reserve: "Reservar",
      book_now: "Reservar ahora",
      order_dish: "Pedir plato",
      add_to_cart: "Añadir al carrito",
      proceed_to_checkout: "Proceder al pago",
      view_guide: "Ver guía",
      clear_filters: "Borrar filtros",
      all: "Todos",
      price: "Precio",
      subtotal: "Subtotal",
      free: "Gratis"
    },
    home: {
      hero: {
        title: "El Estilo de Vida Noruego.",
        subtitle: "Un ecosistema personalizado para descubrir, reservar y experimentar los majestuosos fiordos, ciudades inteligentes y el futuro sostenible de Noruega."
      }
    },
    dashboard: {
      welcome: "Bienvenido de nuevo",
      upcoming: "Próximo Viaje",
      open_trip: "Abrir Viaje",
      saved_places: "Lugares Guardados",
      impact: "Impacto Ecológico",
      recommendations: "Recomendaciones"
    }
  }
};

// French Dictionary (Français)
const fr = {
  translation: {
    nav: {
      discover: "Découvrir",
      explore: "Explorer",
      destinations: "Destinations",
      nature: "Nature & Parcs",
      wildlife: "Faune Sauvage",
      flora: "Plantes & Forêts",
      history: "Histoire & Patrimoine",
      infrastructure: "Infrastructures",
      aurora: "Suivi des Aurores",
      experiences: "Expériences",
      activities: "Activités",
      trails: "Sentiers de Randonnée",
      stays: "Séjours dans les Fjords",
      food: "Gastronomie & Terroir",
      winter: "Sports d'Hiver",
      deals: "Offres Spéciales",
      events: "Événements Culturels",
      plan: "Planification & Durabilité",
      itinerary: "Planificateur de Voyage",
      recommendations: "Recommandations Intelligentes",
      weather: "Météo en Direct",
      guidelines: "Sans Laisser de Traces",
      impact: "Calculateur Écologique",
      smart_city: "Smart City & Technologie",
      iot: "Tableau de Bord IoT",
      smart_norway: "Hub Smart Norvège",
      ev_charging: "Bornes de Recharge Électrique",
      transit: "Transports Publics",
      smart_mobility: "Mobilité Intelligente",
      road_trips: "Routes Panoramiques",
      login: "Connexion",
      signup: "Inscription",
      account: "Compte",
      my_norway: "Mon Norvège",
      my_bookings: "Mes Réservations",
      invoices: "Factures & Reçus",
      profile: "Profil & Paramètres",
      sign_out: "Déconnexion",
      cart: "Panier",
      search: "Rechercher"
    },
    common: {
      explore: "Explorer",
      reserve: "Réserver",
      book_now: "Réserver maintenant",
      order_dish: "Commander",
      add_to_cart: "Ajouter au panier",
      proceed_to_checkout: "Passer à la caisse",
      view_guide: "Voir le guide",
      clear_filters: "Effacer les filtres",
      all: "Tous",
      price: "Prix",
      subtotal: "Sous-total",
      free: "Gratuit"
    },
    home: {
      hero: {
        title: "L'art de vivre à la norvégienne.",
        subtitle: "Un écosystème sur mesure pour explorer, réserver et vivre la majesté des fjords, les cités intelligentes et l'avenir durable de la Norvège."
      }
    },
    dashboard: {
      welcome: "Bienvenue",
      upcoming: "Prochain Voyage",
      open_trip: "Ouvrir le Voyage",
      saved_places: "Lieux Enregistrés",
      impact: "Empreinte Écologique",
      recommendations: "Recommandations"
    }
  }
};

// Hindi Dictionary (हिंदी)
const hi = {
  translation: {
    nav: {
      discover: "खोजें",
      explore: "अन्वेषण करें",
      destinations: "गंतव्य",
      nature: "प्रकृति और राष्ट्रीय उद्यान",
      wildlife: "वन्यजीव",
      flora: "वनस्पति और पेड़",
      history: "इतिहास और विरासत",
      infrastructure: "बुनियादी ढांचा",
      aurora: "अरोरा ट्रैकर",
      experiences: "अनुभव",
      activities: "गतिविधियां",
      trails: "हाइकिंग ट्रेल्स",
      stays: "फ्योर्ड निवास",
      food: "खान-पान और भोजन",
      winter: "शीतकालीन खेल",
      deals: "विशेष सौदे",
      events: "सांस्कृतिक कार्यक्रम",
      plan: "योजना और स्थिरता",
      itinerary: "यात्रा योजनाकार",
      recommendations: "स्मार्ट सुझाव",
      weather: "लाइव मौसम",
      guidelines: "पर्यावरण सुरक्षा नियम",
      impact: "इको कैलकुलेटर",
      smart_city: "स्मार्ट सिटी और तकनीक",
      iot: "लाइव IoT डैशबोर्ड",
      smart_norway: "स्मार्ट नॉर्वे हब",
      ev_charging: "ईवी चार्जिंग स्टेशन",
      transit: "सार्वजनिक परिवहन",
      smart_mobility: "स्मार्ट गतिशीलता",
      road_trips: "सुंदर रोड ट्रिप्स",
      login: "लॉग इन",
      signup: "साइन अप",
      account: "खाता",
      my_norway: "मेरा नॉर्वे",
      my_bookings: "मेरी बुकिंग",
      invoices: "चालान और रसीदें",
      profile: "प्रोफ़ाइल और सेटिंग्स",
      sign_out: "साइन आउट",
      cart: "शॉपिंग कार्ट",
      search: "खोजें"
    },
    common: {
      explore: "खोजें",
      reserve: "टेबल बुक करें",
      book_now: "अभी बुक करें",
      order_dish: "व्यंजन ऑर्डर करें",
      add_to_cart: "कार्ट में जोड़ें",
      proceed_to_checkout: "चेकआउट पर जाएं",
      view_guide: "गाइड देखें",
      clear_filters: "फ़िल्टर हटाएं",
      all: "सभी",
      price: "मूल्य",
      subtotal: "उप-योग",
      free: "मुफ्त"
    },
    home: {
      hero: {
        title: "नॉर्वेजियन जीवन शैली।",
        subtitle: "नॉर्वे के विहंगम दृश्यों, स्मार्ट शहरों और सतत भविष्य की खोज, बुकिंग और अनुभव के लिए एक व्यक्तिगत मंच।"
      }
    },
    dashboard: {
      welcome: "वापसी पर स्वागत है",
      upcoming: "आगामी यात्रा",
      open_trip: "यात्रा खोलें",
      saved_places: "सहेजे गए स्थान",
      impact: "यात्रा का प्रभाव",
      recommendations: "सिफारिशें"
    }
  }
};

const getInitialLang = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('norway_preferred_lang');
    if (saved && ['en', 'no', 'de', 'es', 'fr', 'hi'].includes(saved)) {
      return saved;
    }
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      no,
      de,
      es,
      fr,
      hi
    },
    lng: getInitialLang(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
