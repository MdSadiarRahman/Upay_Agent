/**
 * Google Maps Platform Integration Service
 * Provides coordinates, routing polyline generators, and Maps JavaScript API integration points
 */

export interface GeoLocation {
  lat: number;
  lng: number;
  name: string;
  nameBn: string;
}

export const DINAJPUR_SADAR_BOUNDS = {
  center: { lat: 25.6279, lng: 88.6332 },
  zoom: 15,
};

export const MFS_GEO_ENTITIES: Record<string, GeoLocation> = {
  'sadar-14': {
    lat: 25.6281,
    lng: 88.6335,
    name: 'Agent Dinajpur Sadar-14 (Shahid Telecom)',
    nameBn: 'এজেন্ট সদর-১৪ (শহিদ টেলিকম)',
  },
  'sadar-09': {
    lat: 25.6294,
    lng: 88.6382,
    name: 'Agent Sadar-09 (Bhuiyan Brothers)',
    nameBn: 'এজেন্ট সদর-০৯ (ভুঁইয়া ব্রাদার্স)',
  },
  'sadar-11': {
    lat: 25.6265,
    lng: 88.6298,
    name: 'Agent Sadar-11 (Al-Modina Store)',
    nameBn: 'এজেন্ট সদর-১১ (আল-মদিনা স্টোর)',
  },
  'merch-01': {
    lat: 25.6272,
    lng: 88.6321,
    name: 'Rahman Pharmacy',
    nameBn: 'রহমান ফার্মেসি',
  },
  'merch-02': {
    lat: 25.6288,
    lng: 88.6348,
    name: 'Rafiq Grocery',
    nameBn: 'রফিক গ্রোসারি',
  },
};

/**
 * Calculates straight line / road distance in kilometers using Haversine formula
 */
export function calculateGeoDistanceKm(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Generate Google Directions API URL for Zero-Cash Route
 */
export function getGoogleMapsRouteUrl(origin: GeoLocation, destination: GeoLocation, waypoints?: GeoLocation[]): string {
  const originStr = `${origin.lat},${origin.lng}`;
  const destStr = `${destination.lat},${destination.lng}`;
  let url = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&travelmode=walking`;
  if (waypoints && waypoints.length > 0) {
    const wpStr = waypoints.map((w) => `${w.lat},${w.lng}`).join('|');
    url += `&waypoints=${wpStr}`;
  }
  return url;
}
