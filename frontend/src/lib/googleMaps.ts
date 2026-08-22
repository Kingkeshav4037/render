/**
 * Google Maps Integration Utilities
 * Generates official Google Maps search, directions, and embed URLs for Norway locations.
 */

export interface GoogleMapsDirectionsOptions {
  destination: string | { lat: number; lng: number };
  origin?: string | { lat: number; lng: number };
  travelMode?: 'driving' | 'walking' | 'bicycling' | 'transit';
}

export interface GoogleMapsPlaceOptions {
  placeName: string;
  lat?: number | null;
  lng?: number | null;
  country?: string;
}

export const googleMaps = {
  /**
   * Generates an official Google Maps Directions URL
   * Example: https://www.google.com/maps/dir/?api=1&destination=69.6492,18.9553
   */
  getDirectionsUrl(options: GoogleMapsDirectionsOptions): string {
    const params = new URLSearchParams({ api: '1' });

    if (typeof options.destination === 'string') {
      params.set('destination', options.destination);
    } else {
      params.set('destination', `${options.destination.lat},${options.destination.lng}`);
    }

    if (options.origin) {
      if (typeof options.origin === 'string') {
        params.set('origin', options.origin);
      } else {
        params.set('origin', `${options.origin.lat},${options.origin.lng}`);
      }
    }

    if (options.travelMode) {
      params.set('travelmode', options.travelMode);
    }

    return `https://www.google.com/maps/dir/?${params.toString()}`;
  },

  /**
   * Generates an official Google Maps Place Search URL
   * Example: https://www.google.com/maps/search/?api=1&query=Tromso+Norway
   */
  getPlaceUrl(options: GoogleMapsPlaceOptions): string {
    const params = new URLSearchParams({ api: '1' });
    
    if (options.lat && options.lng) {
      params.set('query', `${options.lat},${options.lng}`);
      params.set('query_place_id', options.placeName);
    } else {
      const country = options.country || 'Norway';
      params.set('query', `${options.placeName}, ${country}`);
    }

    return `https://www.google.com/maps/search/?${params.toString()}`;
  },

  /**
   * Generates an embeddable Google Maps Iframe URL using API Key
   */
  getEmbedUrl(query: string, apiKey?: string): string {
    const key = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    if (!key) return '';
    const params = new URLSearchParams({
      key,
      q: `${query}, Norway`,
    });
    return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
  }
};
