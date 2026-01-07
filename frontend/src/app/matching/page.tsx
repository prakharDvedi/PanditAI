"use client";

import { useState } from "react";
import Link from "next/link";
import LocationAutocomplete from "@/components/LocationAutocomplete";

interface BirthDetails {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone: number;
}

const DEFAULT_DETAILS: BirthDetails = {
  name: "",
  year: 1995,
  month: 1,
  day: 1,
  hour: 12,
  minute: 0,
  latitude: 28.61,
  longitude: 77.2,
  timezone: 5.5,
};

export default function MatchingPage() {
  const [p1, setP1] = useState<BirthDetails>({
    ...DEFAULT_DETAILS,
    name: "Narendra Modi",
    year: 1950,
    month: 9,
    day: 17,
    hour: 11,
    minute: 0,
    latitude: 23.62,
    longitude: 72.47,
  });
  const [p2, setP2] = useState<BirthDetails>({
    ...DEFAULT_DETAILS,
    name: "Giorgia Meloni",
    year: 1977,
    month: 1,
    day: 15,
    hour: 18,
    minute: 30,
    latitude: 41.9,
    longitude: 12.49,
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    setLoading(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ p1, p2 }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("Matching Failed");
    } finally {
      setLoading(false);
    }
  };

  const updateP1 = (field: keyof BirthDetails, val: any) =>
    setP1((prev) => ({ ...prev, [field]: val }));
  const updateP2 = (field: keyof BirthDetails, val: any) =>
    setP2((prev) => ({ ...prev, [field]: val }));

  const handleLocationSelectP1 = (loc: {
    city: string;
    lat: number;
    lon: number;
  }) => {
    setP1((prev) => ({ ...prev, latitude: loc.lat, longitude: loc.lon }));
  };

  const handleLocationSelectP2 = (loc: {
    city: string;
    lat: number;
    lon: number;
  }) => {
    setP2((prev) => ({ ...prev, latitude: loc.lat, longitude: loc.lon }));
  };

  return (
    <div className="min-h-screen w-full bg-[#030014] text-foreground flex flex-col relative overflow-hidden selection:bg-purple-500/30">
      {/* 1. Multi-stop Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0514] via-[#050505] to-[#020103] z-0" />

      {/* 2. Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow z-0 pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px] animate-pulse-slower z-0 pointer-events-none mix-blend-screen" />

      {/* 3. Subtle Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] z-[1] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-white/60 hover:text-amber-400 transition"
          >
            ← Back Home
          </Link>
          <h1 className="text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
            COMPATIBILITY CHECK
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Person 1 Input */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />

            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500/80 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              First Person
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition text-white placeholder-white/20"
                value={p1.name}
                onChange={(e) => updateP1("name", e.target.value)}
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="DD"
                  className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/50 transition text-white placeholder-white/20"
                  value={p1.day}
                  onChange={(e) => updateP1("day", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="MM"
                  className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/50 transition text-white placeholder-white/20"
                  value={p1.month}
                  onChange={(e) => updateP1("month", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="YYYY"
                  className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/50 transition text-white placeholder-white/20"
                  value={p1.year}
                  onChange={(e) => updateP1("year", parseInt(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Hour"
                  className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/50 transition text-white placeholder-white/20"
                  value={p1.hour}
                  onChange={(e) => updateP1("hour", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Min"
                  className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/50 transition text-white placeholder-white/20"
                  value={p1.minute}
                  onChange={(e) => updateP1("minute", parseInt(e.target.value))}
                />
              </div>
              <LocationAutocomplete onLocationSelect={handleLocationSelectP1} />
            </div>
          </section>

          {/* Person 2 Input */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />

            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400/80 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              Second Person
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition text-white placeholder-white/20"
                value={p2.name}
                onChange={(e) => updateP2("name", e.target.value)}
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="DD"
                  className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition text-white placeholder-white/20"
                  value={p2.day}
                  onChange={(e) => updateP2("day", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="MM"
                  className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition text-white placeholder-white/20"
                  value={p2.month}
                  onChange={(e) => updateP2("month", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="YYYY"
                  className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition text-white placeholder-white/20"
                  value={p2.year}
                  onChange={(e) => updateP2("year", parseInt(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Hour"
                  className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition text-white placeholder-white/20"
                  value={p2.hour}
                  onChange={(e) => updateP2("hour", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Min"
                  className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition text-white placeholder-white/20"
                  value={p2.minute}
                  onChange={(e) => updateP2("minute", parseInt(e.target.value))}
                />
              </div>
              <LocationAutocomplete onLocationSelect={handleLocationSelectP2} />
            </div>
          </section>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleMatch}
            disabled={loading}
            className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 disabled:opacity-50 active:scale-95 transition-all duration-300 uppercase tracking-widest text-sm"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Calculating Alignment...
              </span>
            ) : (
              "Calculate Match"
            )}
          </button>
        </div>

        {result && (
          // result display section
          <div className="mt-16 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(255,165,0,0.1)] animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row items-start gap-10 mb-10">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
                <div className="w-32 h-32 rounded-full border-2 border-white/10 flex items-center justify-center bg-black/40 relative z-10 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-orange-400">
                      {result.analysis?.score}
                    </div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">
                      / 36 Points
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-6 text-white/90 border-b border-white/10 pb-4">
                  Cosmic Alignment Report
                </h3>
                <div className="text-white/70 leading-relaxed text-base font-light space-y-4">
                  {result.ai_verdict
                    .split("\n")
                    .map((line: string, i: number) => {
                      // Check for list items with bold keys: * **Key**: Value
                      const match = line.match(/^\*\s*\*\*(.*?)\*\*:\s*(.*)/);
                      if (match) {
                        const [_, key, value] = match;
                        const isVerdict = key.toLowerCase().includes("verdict");
                        return (
                          <div
                            key={i}
                            className={`flex flex-col md:flex-row gap-2 md:gap-4 items-start ${
                              isVerdict
                                ? "bg-white/5 p-4 rounded-xl border border-white/5 mt-4"
                                : ""
                            }`}
                          >
                            <span
                              className={`text-amber-400 font-bold shrink-0 md:w-32 text-left ${
                                isVerdict ? "text-amber-200 md:w-auto" : ""
                              }`}
                            >
                              {key}:
                            </span>
                            <span
                              className={
                                isVerdict ? "test-white font-medium" : ""
                              }
                            >
                              {value}
                            </span>
                          </div>
                        );
                      }
                      // Handle regular lines or empty lines
                      if (!line.trim()) return <br key={i} />;
                      return <div key={i}>{line}</div>;
                    })}
                </div>
              </div>
            </div>

            {result.analysis?.details && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-8">
                {Object.entries(result.analysis.details).map(
                  ([key, val]: [string, any]) => (
                    <div
                      key={key}
                      className="bg-black/20 border border-white/5 rounded-xl p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="text-[10px] font-bold text-white/40 uppercase mb-2 tracking-widest">
                        {key}
                      </div>
                      <div className="text-xl font-bold text-white/90">
                        {val}{" "}
                        <span className="text-xs font-normal text-white/30">
                          pts
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
