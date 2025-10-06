let mapsPromise;

export function loadGoogleMaps() {
  if (mapsPromise) return mapsPromise;
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) || '';
  const winKey = (typeof window !== 'undefined' && window.__GMAPS_KEY__) || '';
  const lsKey = (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('gmapsApiKey')) || '';
  const apiKey = envKey || winKey || lsKey;
  if (!apiKey) {
    return Promise.reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY (or window.__GMAPS_KEY__ / localStorage.gmapsApiKey)'));
  }
  mapsPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve(window.google);
      return;
    }
    const existing = document.getElementById('google-maps-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps')));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-js';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&v=quarterly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
  return mapsPromise;
}
