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
      free: "Free",
      back: "Back",
      continue: "Continue",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel"
    },
    booking: {
      secure_stay: "Secure Your Stay",
      trip_details: "Trip Details",
      check_in: "Check-in",
      check_out: "Check-out",
      guests: "Guests",
      price_details: "Price Details",
      room_rate: "Room Rate",
      duration: "Duration",
      party_size: "Party Size",
      total_due: "Total Due",
      confirm_pay: "Confirm & Pay With Razorpay",
      add_to_cart: "Add to Cart",
      back_to_stays: "Back to Stays"
    },
    footer: {
      tagline: "Discover the beauty, sustainability, and technological innovation of Norway. Your premium ecosystem for exploring and experiencing the Nordic way of life.",
      explore: "Explore",
      destinations: "Destinations",
      planner: "AI Trip Planner",
      flora: "Plants & Trees",
      history: "History & Heritage",
      trails: "Hiking Trails",
      stays: "Stays & Lodges",
      food: "Food & Dining",
      insights: "Insights",
      smart_city: "Smart City Hub",
      map: "Interactive Map",
      sustainability: "Sustainability",
      infrastructure: "Infrastructure",
      aurora: "Aurora Forecast",
      legal: "Legal & Tax",
      sitemap: "Site Directory",
      invoices: "Invoices & Receipts",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookie Policy",
      rights: "All rights reserved.",
      powered_by: "Powered by"
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
      free: "Gratis",
      back: "Tilbake",
      continue: "Fortsett",
      loading: "Laster...",
      save: "Lagre",
      cancel: "Avbryt"
    },
    booking: {
      secure_stay: "Sikre Oppholdet Ditt",
      trip_details: "Reisedetaljer",
      check_in: "Innsjekking",
      check_out: "Utsjekking",
      guests: "Gjester",
      price_details: "Prisdetaljer",
      room_rate: "Rompris",
      duration: "Varighet",
      party_size: "Antall gjester",
      total_due: "Totalpris",
      confirm_pay: "Bekreft og Betal med Razorpay",
      add_to_cart: "Legg i handlekurv",
      back_to_stays: "Tilbake til overnattingssteder"
    },
    footer: {
      tagline: "Oppdag skjønnheten, bærekraften og den teknologiske innovasjonen i Norge. Ditt premium økosystem for å utforske den nordiske livsstilen.",
      explore: "Utforsk",
      destinations: "Destinasjoner",
      planner: "AI Reiseplanlegger",
      flora: "Planter og Trær",
      history: "Historie og Kulturarv",
      trails: "Fjellturer og Stier",
      stays: "Overnatting og Hytter",
      food: "Mat og Gastronomi",
      insights: "Innsikt",
      smart_city: "Smartby-senter",
      map: "Interaktivt Kart",
      sustainability: "Bærekraft",
      infrastructure: "Infrastruktur",
      aurora: "Nordlys-varsel",
      legal: "Juridisk og Skatt",
      sitemap: "Nettstedskart",
      invoices: "Fakturaer og Kvitteringer",
      privacy: "Personvernerklæring",
      terms: "Vilkår for bruk",
      cookies: "Retningslinjer for informasjonskapsler",
      rights: "Alle rettigheter forbeholdt.",
      powered_by: "Levert av"
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
      free: "Kostenlos",
      back: "Zurück",
      continue: "Weiter",
      loading: "Wird geladen...",
      save: "Speichern",
      cancel: "Abbrechen"
    },
    booking: {
      secure_stay: "Sichern Sie Ihren Aufenthalt",
      trip_details: "Reisedetails",
      check_in: "Check-in",
      check_out: "Check-out",
      guests: "Gäste",
      price_details: "Preisdetails",
      room_rate: "Zimmerpreis",
      duration: "Dauer",
      party_size: "Anzahl Gäste",
      total_due: "Gesamtbetrag",
      confirm_pay: "Mit Razorpay bestätigen & bezahlen",
      add_to_cart: "In den Warenkorb",
      back_to_stays: "Zurück zu Unterkünften"
    },
    footer: {
      tagline: "Entdecken Sie die Schönheit, Nachhaltigkeit und technologische Innovation Norwegens. Ihr Premium-Ökosystem für den nordischen Lebensstil.",
      explore: "Erkunden",
      destinations: "Reiseziele",
      planner: "KI-Reiseplaner",
      flora: "Pflanzen & Bäume",
      history: "Geschichte & Kulturerbe",
      trails: "Wanderwege",
      stays: "Unterkünfte & Lodges",
      food: "Gastronomie & Kulinarik",
      insights: "Einblicke",
      smart_city: "Smart City Hub",
      map: "Interaktive Karte",
      sustainability: "Nachhaltigkeit",
      infrastructure: "Infrastruktur",
      aurora: "Nordlicht-Prognose",
      legal: "Rechtliches & Steuern",
      sitemap: "Seitenübersicht",
      invoices: "Rechnungen & Belege",
      privacy: "Datenschutzerklärung",
      terms: "Nutzungsbedingungen",
      cookies: "Cookie-Richtlinie",
      rights: "Alle Rechte vorbehalten.",
      powered_by: "Bereitgestellt von"
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
      free: "Gratis",
      back: "Volver",
      continue: "Continuar",
      loading: "Cargando...",
      save: "Guardar",
      cancel: "Cancelar"
    },
    booking: {
      secure_stay: "Asegura Tu Estancia",
      trip_details: "Detalles del Viaje",
      check_in: "Check-in",
      check_out: "Check-out",
      guests: "Huéspedes",
      price_details: "Detalles del Precio",
      room_rate: "Tarifa por noche",
      duration: "Duración",
      party_size: "Número de huéspedes",
      total_due: "Total a pagar",
      confirm_pay: "Confirmar y Pagar con Razorpay",
      add_to_cart: "Añadir al carrito",
      back_to_stays: "Volver a alojamientos"
    },
    footer: {
      tagline: "Descubra la belleza, la sostenibilidad y la innovación tecnológica de Noruega. Su ecosistema de primer nivel para vivir el estilo de vida nórdico.",
      explore: "Explorar",
      destinations: "Destinos",
      planner: "Planificador con IA",
      flora: "Flora y Bosques",
      history: "Historia y Patrimonio",
      trails: "Rutas de Senderismo",
      stays: "Alojamientos",
      food: "Gastronomía",
      insights: "Innovación",
      smart_city: "Ciudades Inteligentes",
      map: "Mapa Interactivo",
      sustainability: "Sostenibilidad",
      infrastructure: "Infraestructura",
      aurora: "Predicción de Auroras",
      legal: "Legal y Fiscal",
      sitemap: "Directorio del Sitio",
      invoices: "Facturas y Recibos",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      cookies: "Política de Cookies",
      rights: "Todos los derechos reservados.",
      powered_by: "Desarrollado por"
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
      free: "Gratuit",
      back: "Retour",
      continue: "Continuer",
      loading: "Chargement...",
      save: "Enregistrer",
      cancel: "Annuler"
    },
    booking: {
      secure_stay: "Sécurisez Votre Séjour",
      trip_details: "Détails du Séjour",
      check_in: "Arrivée",
      check_out: "Départ",
      guests: "Voyageurs",
      price_details: "Détails du Prix",
      room_rate: "Tarif par nuit",
      duration: "Durée",
      party_size: "Nombre de personnes",
      total_due: "Total à payer",
      confirm_pay: "Confirmer et Payer avec Razorpay",
      add_to_cart: "Ajouter au panier",
      back_to_stays: "Retour aux hébergements"
    },
    footer: {
      tagline: "Découvrez la beauté, la durabilité et l'innovation technologique de la Norvège. Votre écosystème d'exception pour vivre l'art de vivre nordique.",
      explore: "Explorer",
      destinations: "Destinations",
      planner: "Planificateur IA",
      flora: "Plantes & Forêts",
      history: "Histoire & Patrimoine",
      trails: "Sentiers de Randonnée",
      stays: "Hébergements",
      food: "Gastronomie",
      insights: "Innovations",
      smart_city: "Smart Cities",
      map: "Carte Interactive",
      sustainability: "Durabilité",
      infrastructure: "Infrastructures",
      aurora: "Prévisions Aurores",
      legal: "Mentions Légales",
      sitemap: "Plan du Site",
      invoices: "Factures & Reçus",
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
      cookies: "Politique des Cookies",
      rights: "Tous droits réservés.",
      powered_by: "Propulsé par"
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
      free: "मुफ्त",
      back: "पीछे जाएं",
      continue: "जारी रखें",
      loading: "लोड हो रहा है...",
      save: "सहेजें",
      cancel: "रद्द करें"
    },
    booking: {
      secure_stay: "अपना निवास सुरक्षित करें",
      trip_details: "यात्रा का विवरण",
      check_in: "चेक-इन",
      check_out: "चेक-आउट",
      guests: "अतिथि",
      price_details: "मूल्य विवरण",
      room_rate: "कमरे का किराया",
      duration: "अवधि",
      party_size: "अतिथियों की संख्या",
      total_due: "कुल देय राशि",
      confirm_pay: "Razorpay से पुष्टि और भुगतान करें",
      add_to_cart: "कार्ट में जोड़ें",
      back_to_stays: "निवास सूची पर वापस जाएं"
    },
    footer: {
      tagline: "नॉर्वे की प्राकृतिक सुंदरता, स्थिरता और तकनीकी नवाचार की खोज करें। नॉर्डिक जीवन शैली का अनुभव करने के लिए आपका प्रमुख मंच।",
      explore: "अन्वेषण करें",
      destinations: "गंतव्य",
      planner: "एआई यात्रा योजनाकार",
      flora: "वनस्पति और पेड़",
      history: "इतिहास और विरासत",
      trails: "हाइकिंग ट्रेल्स",
      stays: "निवास और लॉज",
      food: "भोजन और खान-पान",
      insights: "नवाचार",
      smart_city: "स्मार्ट सिटी हब",
      map: "इंटरएक्टिव मानचित्र",
      sustainability: "स्थिरता",
      infrastructure: "बुनियादी ढांचा",
      aurora: "अरोरा पूर्वानुमान",
      legal: "कानूनी और कर",
      sitemap: "साइट निर्देशिका",
      invoices: "चालान और रसीदें",
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      cookies: "कुकी नीति",
      rights: "सर्वाधिकार सुरक्षित।",
      powered_by: "द्वारा संचालित"
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
