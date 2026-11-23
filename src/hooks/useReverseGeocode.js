import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook to reverse geocode lat/lng to readable address
 * and forward search locations with OpenStreetMap Nominatim API.
 */
export function useReverseGeocode(defaultLat = 22.3384, defaultLng = 91.8317) {
  const [address, setAddress] = useState("");
  const [addressDetails, setAddressDetails] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debounceTimerRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const abortControllerRef = useRef(null);
  const searchAbortRef = useRef(null);

  /**
   * Helper to format Nominatim response into a clean GovTech municipal address
   */
  const formatAddress = (data) => {
    if (!data) return "";
    const addr = data.address || {};
    const parts = [];

    // Specific location: house number, road, amenity, building
    const specific = addr.amenity || addr.building || addr.road || addr.pedestrian || addr.street;
    if (specific) parts.push(specific);

    // Sub-district / Ward / Suburb
    const subArea = addr.suburb || addr.neighbourhood || addr.city_district || addr.residential;
    if (subArea && !parts.includes(subArea)) parts.push(subArea);

    // City / Town / Municipality
    const city = addr.city || addr.town || addr.municipality || addr.county || "Chattogram";
    if (city && !parts.includes(city)) parts.push(city);

    // Postal code
    if (addr.postcode) parts.push(addr.postcode);

    return parts.length > 0 ? parts.join(", ") : data.display_name || "Location pinned";
  };

  /**
   * Reverse geocode a latitude and longitude
   */
  const reverseGeocode = useCallback((lat, lng, immediate = false) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const executeFetch = async () => {
      setIsGeocoding(true);
      setGeocodeError(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            "Accept-Language": "en",
          },
        });

        if (!res.ok) {
          throw new Error(`Nominatim request failed with status: ${res.status}`);
        }

        const data = await res.json();
        const readable = formatAddress(data);
        setAddress(readable);
        setAddressDetails(data.address || null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Reverse geocode warning:", err);
          setGeocodeError("Unable to resolve address. Coordinates preserved.");
          // Fallback to coordinates label
          setAddress(`GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      } finally {
        setIsGeocoding(false);
      }
    };

    if (immediate) {
      executeFetch();
    } else {
      debounceTimerRef.current = setTimeout(executeFetch, 400);
    }
  }, []);

  /**
   * Forward search address query with debounce
   */
  const searchAddress = useCallback((query) => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }

    if (!query || query.trim().length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const controller = new AbortController();
      searchAbortRef.current = controller;

      try {
        // Bias search towards Chattogram area
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          query
        )}&countrycodes=bd&limit=5&addressdetails=1&viewbox=91.6,22.1,92.0,22.6&bounded=0`;

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            "Accept-Language": "en",
          },
        });

        if (!res.ok) throw new Error("Search request failed");

        const data = await res.json();
        const results = (data || []).map((item) => ({
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          displayName: item.display_name,
          formatted: formatAddress(item),
          type: item.type,
        }));
        setSearchResults(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Address search error:", err);
          setSearchResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 450);
  }, []);

  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (searchAbortRef.current) searchAbortRef.current.abort();
    };
  }, []);

  return {
    address,
    setAddress,
    addressDetails,
    isGeocoding,
    geocodeError,
    reverseGeocode,
    searchAddress,
    searchResults,
    isSearching,
    clearSearchResults,
  };
}
