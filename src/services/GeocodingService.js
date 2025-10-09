const geoCache = new Map();

export const reverseGeocode = async (lat, lon) => {
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (geoCache.has(cacheKey)) {
    return geoCache.get(cacheKey);
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error("Failed to fetch address");
    
    const data = await response.json();
    const address = data.display_name || "Unknown Location";
    
    geoCache.set(cacheKey, address); // Cache the result
    return address;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`; // Fallback to coordinates on error
  }
};