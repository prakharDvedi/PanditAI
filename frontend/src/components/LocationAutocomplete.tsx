"use client";

import { useState, useEffect, useRef } from "react";

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

interface LocationAutocompleteProps {
  onLocationSelect: (location: {
    city: string;
    lat: number;
    lon: number;
  }) => void;
}

export default function LocationAutocomplete({
  onLocationSelect,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // fetch suggestions from nominatim
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query,
        )}&format=json&limit=5&addressdetails=1`;
        const response = await fetch(url, {
          headers: {
            "User-Agent": "PanditAI/1.0",
          },
        });
        const data = await response.json();
        setSuggestions(data);
        setIsOpen(data.length > 0);
      } catch (error) {
        console.error("Geocoding error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // this 500 is  debounce: wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (suggestion: LocationSuggestion) => {
    setQuery(suggestion.display_name);
    setIsOpen(false);
    onLocationSelect({
      city: suggestion.display_name,
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing city name..."
        className="w-full px-4 py-3 rounded-xl bg-input/40 border border-white/10 text-foreground placeholder-muted-foreground/50 font-light focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
      />

      {isLoading && (
        <div className="absolute right-3 top-3.5">
          <div className="w-5 h-5 border-2 border-primary/50 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg bg-card border border-white/10 shadow-2xl">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-white/5 border-b border-white/5 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-foreground text-sm">
                {suggestion.display_name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {suggestion.type} • {parseFloat(suggestion.lat).toFixed(4)},{" "}
                {parseFloat(suggestion.lon).toFixed(4)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
