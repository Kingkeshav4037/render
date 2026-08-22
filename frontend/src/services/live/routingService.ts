export interface RouteData {
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][]; // [lon, lat]
    type: string;
  };
  steps: any[];
  mode: string;
  elevation: number;
  warnings: any[];
  ferries: any[];
  tolls: any[];
  chargingStops: any[];
}

class RoutingService {
  private cache: Map<string, { data: RouteData; timestamp: number }> = new Map();
  private CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours local cache for routes

  private getCacheKey(startLat: number, startLon: number, endLat: number, endLon: number, mode: string): string {
    return `${startLat.toFixed(3)},${startLon.toFixed(3)}|${endLat.toFixed(3)},${endLon.toFixed(3)}|${mode}`;
  }

  async getRoute(startLat: number, startLon: number, endLat: number, endLon: number, mode: string = 'driving'): Promise<RouteData | null> {
    const key = this.getCacheKey(startLat, startLon, endLat, endLon, mode);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      // Map 'driving', 'walking', 'cycling' to OSRM profiles ('driving', 'foot', 'bicycle')
      let osrmProfile = 'driving';
      if (mode === 'walking') osrmProfile = 'foot';
      if (mode === 'cycling') osrmProfile = 'bicycle';

      const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('OSRM API failed');
      
      const json = await response.json();
      if (json.code !== 'Ok' || !json.routes || json.routes.length === 0) {
        throw new Error('OSRM returned no routes');
      }

      const route = json.routes[0];
      
      const data: RouteData = {
        distance: route.distance, // meters
        duration: route.duration, // seconds
        geometry: route.geometry, // GeoJSON LineString
        steps: [],
        mode,
        elevation: 0,
        warnings: [],
        ferries: [],
        tolls: [],
        chargingStops: []
      };
      
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (err) {
      console.error('Failed to fetch route from OSRM:', err);
      return cached ? cached.data : null;
    }
  }
}

export const routingService = new RoutingService();
