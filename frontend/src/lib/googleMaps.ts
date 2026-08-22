/**
 * OpenStreetMap compatibility alias (formerly googleMaps)
 * Redirects all direction and lookup requests to OpenStreetMap & Leaflet.
 * Requires ZERO API keys, billing setup, or proprietary credentials.
 */

import { openStreetMap, OpenStreetMapDirectionsOptions, OpenStreetMapSearchOptions } from './openStreetMap';

export type GoogleMapsDirectionsOptions = OpenStreetMapDirectionsOptions;
export type GoogleMapsPlaceOptions = OpenStreetMapSearchOptions & { placeName?: string; country?: string };

export const googleMaps = {
  getDirectionsUrl(options: any): string {
    return openStreetMap.getDirectionsUrl(options);
  },
  getPlaceUrl(options: any): string {
    return openStreetMap.getSearchUrl({
      query: options.placeName || options.query || 'Norway',
      lat: options.lat,
      lng: options.lng
    });
  },
  getEmbedUrl(_query: string): string {
    return '';
  }
};
