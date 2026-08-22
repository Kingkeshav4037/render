export interface HomePlace {
  id: string;
  name: string;
  slug: string;
  category: 'Fjord' | 'Mountain' | 'Waterfall' | 'Glacier' | 'National Park' | 'Island' | 'City' | 'Landmark';
  region: string;
  short_description: string;
  image: string;
  latitude: number;
  longitude: number;
  rating: number;
  featured?: boolean;
}

export interface HomeAnimal {
  id: string;
  name: string;
  scientific_name: string;
  category: 'Land' | 'Marine' | 'Bird';
  habitat: string;
  short_description: string;
  image: string;
  best_season: string;
}

export interface HomeFood {
  id: string;
  name: string;
  category: 'Seafood' | 'Land Food' | 'Traditional' | 'Bakery' | 'Dessert';
  origin_region: string;
  short_description: string;
  image: string;
}

export interface HomeRestaurant {
  id: string;
  name: string;
  cuisine: string;
  city: string;
  region: string;
  rating: number;
  price_range: '€' | '€€' | '€€€' | '€€€€';
  image: string;
  latitude: number;
  longitude: number;
}

export interface HomeHotel {
  id: string;
  name: string;
  category: 'Luxury' | 'Fjord' | 'Mountain' | 'Cabin' | 'Boutique' | 'Aurora';
  city: string;
  region: string;
  rating: number;
  price_indicator: string;
  image: string;
  latitude: number;
  longitude: number;
}

export interface HomeActivity {
  id: string;
  name: string;
  category: string;
  region: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
}

export interface HomeInfrastructure {
  id: string;
  name: string;
  type: 'Airport' | 'Train Station' | 'Ferry' | 'EV Charging' | 'Hospital' | 'Tourist Info';
  city: string;
  status: 'Operational' | 'Delayed' | 'Closed';
  latitude: number;
  longitude: number;
}

export interface HomeProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  rating: number;
}

export interface HomeDeal {
  id: string;
  title: string;
  discount: string;
  description: string;
  type: 'Hotel' | 'Activity' | 'Package';
  image: string;
}

export interface HomeEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  image: string;
}

export interface HomeContent {
  trendingPlaces: HomePlace[];
  famousFjords: HomePlace[];
  famousMountains: HomePlace[];
  wildlife: HomeAnimal[];
  food: HomeFood[];
  restaurants: HomeRestaurant[];
  hotels: HomeHotel[];
  activities: HomeActivity[];
  infrastructure: HomeInfrastructure[];
  products: HomeProduct[];
  deals: HomeDeal[];
  events: HomeEvent[];
}
