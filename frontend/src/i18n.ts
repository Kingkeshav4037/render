import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Base English Dictionary
const en = {
  translation: {
    nav: {
      discover: "Discover",
      experiences: "Experiences",
      plan: "Plan",
      smart_city: "Smart City",
      login: "Log in",
      signup: "Sign Up",
      account: "Account",
      my_norway: "My Norway",
      my_bookings: "My Bookings",
      profile: "Profile",
      sign_out: "Sign Out"
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
      experiences: "Opplevelser",
      plan: "Planlegg",
      smart_city: "Smart Norge",
      login: "Logg inn",
      signup: "Registrer deg",
      account: "Konto",
      my_norway: "Mitt Norge",
      my_bookings: "Mine Bestillinger",
      profile: "Profil",
      sign_out: "Logg ut"
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
      open_trip: "Åpen Reise",
      saved_places: "Lagrede Steder",
      impact: "Reisens Påvirkning",
      recommendations: "Anbefalinger"
    }
  }
};

// German Dictionary (Deutsch)
const de = {
  translation: {
    nav: {
      discover: "Entdecken",
      experiences: "Erlebnisse",
      plan: "Planen",
      smart_city: "Smart Norwegen",
      login: "Anmelden",
      signup: "Registrieren",
      account: "Konto",
      my_norway: "Mein Norwegen",
      my_bookings: "Meine Buchungen",
      profile: "Profil",
      sign_out: "Abmelden"
    },
    home: {
      hero: {
        title: "Die norwegische Lebensart.",
        subtitle: "Ein personalisiertes Ökosystem zum Entdecken, Buchen und Erleben der majestätischen Landschaften und der nachhaltigen Zukunft Norwegens."
      }
    }
  }
};

// Hindi Dictionary (हिंदी)
const hi = {
  translation: {
    nav: {
      discover: "खोजें",
      experiences: "अनुभव",
      plan: "योजना बनाएं",
      smart_city: "स्मार्ट नॉर्वे",
      login: "लॉग इन",
      signup: "साइन अप",
      account: "खाता",
      my_norway: "मेरा नॉर्वे",
      my_bookings: "मेरी बुकिंग",
      profile: "प्रोफ़ाइल",
      sign_out: "साइन आउट"
    },
    home: {
      hero: {
        title: "नॉर्वेजियन जीवन शैली।",
        subtitle: "नॉर्वे के विहंगम दृश्यों, स्मार्ट शहरों और सतत भविष्य की खोज, बुकिंग और अनुभव के लिए एक व्यक्तिगत मंच।"
      }
    }
  }
};

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('norway_preferred_lang') || 'en' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      no,
      de,
      hi
    },
    lng: savedLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
