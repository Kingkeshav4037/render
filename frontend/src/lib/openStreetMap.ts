/**
 * OpenStreetMap & Leaflet Integration Utilities
 * Generates open-source, privacy-respecting OSM URLs for Norway destinations, directions, and geographic views.
 * Requires ZERO API keys, billing setup, or proprietary SDKs.
 */

export interface OpenStreetMapDirectionsOptions {
  destination: string | { lat: number; lng: number };
  origin?: string | { lat: number; lng: number };
  engine?: 'fossgis_osrm_car' | 'fossgis_osrm_bike' | 'fossgis_osrm_foot';
}

export interface OpenStreetMapSearchOptions {
  query: string;
  lat?: number | null;
  lng?: number | null;
  zoom?: number;
}

export const openStreetMap = {
  /**
   * Generates an official OpenStreetMap directions URL
   * Example: https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B69.6492%2C18.9553
   */
  getDirectionsUrl(options: OpenStreetMapDirectionsOptions): string {
    const engine = options.engine || 'fossgis_osrm_car';
    const destStr = typeof options.destination === 'string'
      ? encodeURIComponent(options.destination)
      : `${options.destination.lat}%2C${options.destination.lng}`;
    
    if (options.origin) {
      const origStr = typeof options.origin === 'string'
        ? encodeURIComponent(options.origin)
        : `${options.origin.lat}%2C${options.origin.lng}`;
      return `https://www.openstreetmap.org/directions?engine=${engine}&route=${origStr}%3B${destStr}`;
    }

    return `https://www.openstreetmap.org/directions?engine=${engine}&route=%3B${destStr}`;
  },

  /**
   * Generates an OpenStreetMap search/view URL
   * Example: https://www.openstreetmap.org/?mlat=69.6492&mlon=18.9553#map=13/69.6492/18.9553
   */
  getSearchUrl(options: OpenStreetMapSearchOptions): string {
    if (options.lat && options.lng) {
      const zoom = options.zoom || 13;
      return `https://www.openstreetmap.org/?mlat=${options.lat}&mlon=${options.lng}#map=${zoom}/${options.lat}/${options.lng}`;
    }
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(options.query + ', Norway')}`;
  }
};
