"use client";

import { useState } from "react";
import LocationAutocomplete from "@/components/LocationAutocomplete";

export default function Home() {
  const [formData, setFormData] = useState({
    dob: "2005-08-20",
    time: "08:24",
    city: "Delhi",
    lat: 28.6139,
    lon: 77.209,
    ayanamsa: "lahiri",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
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
    setResult(null);

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
    <div className="relative flex flex-col min-h-screen w-full overflow-hidden bg-[#030014] text-foreground selection:bg-purple-500/30">
      {/* background gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#0f172a] bg-[length:200%_200%] animate-drift" />

      {/* ambient orbs */}
      <div className="absolute top-[-10%] left-[-10%] z-0 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none mix-blend-screen animate-breathe" />

      {/* bottom right one*/}
      <div
        className="absolute bottom-[-10%] right-[-10%] z-0 w-[600px] h-[600px] rounded-full bg-amber-600/10 blur-[150px] pointer-events-none mix-blend-screen animate-breathe"
        style={{ animationDelay: "5s" }}
      />

      {/* noise overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative z-10 flex flex-1 flex-col lg:flex-row items-center justify-center gap-12 p-6 lg:p-24">
        <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-2xl">
          Welcome to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-rose-200 animate-gradient-x">
            PanditAI
          </span>
        </h2>

        <div className="flex-1 w-full max-w-md">
          <div className="relative group p-8 rounded-2xl bg-white/5 border border-white/10 ring-1 ring-white/5 backdrop-blur-2xl overflow-hidden animate-shadow-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />

            <div className="relative z-10 mb-6 text-center">
              <h3 className="mb-2 text-2xl font-bold text-white/90">
                Enter Birth Details
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
              <div>
                <label
                  htmlFor="dob"
                  className="block mb-1 text-xs font-medium text-white/60 uppercase tracking-wider"
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
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/20 font-light focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="time"
                    className="block mb-1 text-xs font-medium text-white/60 uppercase tracking-wider"
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
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white font-light focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ayanamsa"
                    className="block mb-1 text-xs font-medium text-white/60 uppercase tracking-wider"
                  >
                    Ayanamsa
                  </label>
                  <select
                    id="ayanamsa"
                    value={formData.ayanamsa}
                    onChange={(e) =>
                      setFormData({ ...formData, ayanamsa: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white font-light appearance-none focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  >
                    <option value="lahiri" className="bg-[#1a0b2e]">
                      Lahiri
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium text-white/60 uppercase tracking-wider">
                  Birth Location
                </label>

                <LocationAutocomplete onLocationSelect={handleLocationSelect} />
                {formData.lat !== 0 && (
                  <div className="mt-2 text-[10px] font-medium text-amber-500/80 uppercase tracking-widest">
                    📍 {formData.city} ({formData.lat.toFixed(2)}°,{" "}
                    {formData.lon.toFixed(2)}°)
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || formData.lat === 0}
                className="w-full py-4 mt-4 text-lg font-bold text-white rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg shadow-amber-900/20 transform transition-all duration-300 hover:from-amber-500 hover:to-orange-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
              <span className="text-rose-200/80 text-xs font-medium tracking-widest uppercase group-hover:text-rose-200 transition-colors">
                Love Compatibility Check
              </span>
              <span className="text-rose-200/80 group-hover:translate-x-1 transition-transform group-hover:text-rose-200">
                →
              </span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
