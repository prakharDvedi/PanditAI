"use client";

import { useState } from "react";
import LocationAutocomplete from "@/components/client/LocationAutocomplete";

export default function HomeClient() {
  const [formData, setFormData] = useState({
    dob: "2005-08-20",
    time: "08:24",
    city: "Delhi",
    lat: 28.6139,
    lon: 77.209,
    ayanamsa: "lahiri",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLocationSelect = (location: {
    city: string;
    lat: number;
    lon: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      city: location.city,
      lat: location.lat,
      lon: location.lon,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const date = new Date(formData.dob);
      const [hours, minutes] = formData.time.split(":").map(Number);

      const payload = {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // months are 0-indexed
        day: date.getDate(),
        hour: hours,
        minute: minutes,
        timezone: 5.5, // default to ist
        latitude: formData.lat,
        longitude: formData.lon,
        ayanamsa: formData.ayanamsa.toUpperCase(),
      };

      console.log("Sending to backend:", payload);

      // fetch predictions
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend response:", data);

      // cache data
      if (data) {
        localStorage.setItem("prediction", JSON.stringify(data));
        localStorage.setItem("birth_details", JSON.stringify(payload));
        window.location.href = "/prediction";
      } else {
        setError("No prediction data received from the server");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate horoscope");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-md">
      <div className="relative p-8 rounded-2xl bg-card/60 border border-white/5 ring-1 ring-white/5 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 mb-6 text-center">
          <h3 className="mb-2 text-2xl font-bold text-foreground">
            Enter Birth Details
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          <div>
            <label
              htmlFor="dob"
              className="block mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              required
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-input/40 border border-white/10 text-foreground placeholder-muted-foreground/50 font-light focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="time"
                className="block mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Time
              </label>
              <input
                type="time"
                id="time"
                required
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-input/40 border border-white/10 text-foreground font-light focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
              />
            </div>
            <div>
              <label
                htmlFor="ayanamsa"
                className="block mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Ayanamsa
              </label>
              <select
                id="ayanamsa"
                value={formData.ayanamsa}
                onChange={(e) =>
                  setFormData({ ...formData, ayanamsa: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-input/40 border border-white/10 text-foreground font-light appearance-none focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value="lahiri" className="bg-card text-foreground">
                  Lahiri
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Birth Location
            </label>

            <LocationAutocomplete onLocationSelect={handleLocationSelect} />
            {formData.lat !== 0 && (
              <div className="mt-2 text-[10px] font-medium text-primary uppercase tracking-widest">
                📍 {formData.city} ({formData.lat.toFixed(2)}°,{" "}
                {formData.lon.toFixed(2)}°)
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || formData.lat === 0}
            className="w-full py-4 mt-4 text-lg font-bold text-primary-foreground rounded-xl bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20 transform transition-all duration-300 hover:from-primary/90 hover:to-secondary/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Aligning Stars...
              </span>
            ) : (
              "Reveal Your Destiny"
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/matching"
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 group transition-colors hover:bg-white/10"
        >
          <span className="text-muted-foreground text-xs font-medium tracking-widest uppercase group-hover:text-primary transition-colors">
            Love Compatibility Check
          </span>
          <span className="text-muted-foreground group-hover:translate-x-1 transition-transform group-hover:text-primary">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
