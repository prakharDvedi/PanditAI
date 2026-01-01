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

  const handleLocationSelectP1 = (loc: { lat: number; lon: number }) => {
    setP1((prev) => ({ ...prev, latitude: loc.lat, longitude: loc.lon }));
  };

  const handleLocationSelectP2 = (loc: { lat: number; lon: number }) => {
    setP2((prev) => ({ ...prev, latitude: loc.lat, longitude: loc.lon }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition"
          >
            Back Home
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">
            Compatibility Check
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Person 1 */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
              First Person
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition"
                value={p1.name}
                onChange={(e) => updateP1("name", e.target.value)}
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="DD"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500/50"
                  value={p1.day}
                  onChange={(e) => updateP1("day", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="MM"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500/50"
                  value={p1.month}
                  onChange={(e) => updateP1("month", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="YYYY"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500/50"
                  value={p1.year}
                  onChange={(e) => updateP1("year", parseInt(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Hour"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500/50"
                  value={p1.hour}
                  onChange={(e) => updateP1("hour", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Min"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500/50"
                  value={p1.minute}
                  onChange={(e) => updateP1("minute", parseInt(e.target.value))}
                />
              </div>
              <LocationAutocomplete onLocationSelect={handleLocationSelectP1} />
            </div>
          </section>

          {/* Person 2 */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
              Second Person
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition"
                value={p2.name}
                onChange={(e) => updateP2("name", e.target.value)}
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="DD"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500/50"
                  value={p2.day}
                  onChange={(e) => updateP2("day", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="MM"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500/50"
                  value={p2.month}
                  onChange={(e) => updateP2("month", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="YYYY"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500/50"
                  value={p2.year}
                  onChange={(e) => updateP2("year", parseInt(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Hour"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500/50"
                  value={p2.hour}
                  onChange={(e) => updateP2("hour", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Min"
                  className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500/50"
                  value={p2.minute}
                  onChange={(e) => updateP2("minute", parseInt(e.target.value))}
                />
              </div>
              <LocationAutocomplete onLocationSelect={handleLocationSelectP2} />
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            onClick={handleMatch}
            disabled={loading}
            className="w-full md:w-auto px-10 py-3.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-500 transition shadow-lg shadow-orange-900/20 disabled:opacity-50 active:scale-95"
          >
            {loading ? "Processing..." : "Calculate Match"}
          </button>
        </div>

        {result && (
          <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="w-32 h-32 rounded-full border-4 border-zinc-800 flex items-center justify-center bg-zinc-950">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">
                    {result.analysis?.score}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase">
                    / 36 Points
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2 text-zinc-100">
                  Analysis Result
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm whitespace-pre-line">
                  {result.ai_verdict}
                </p>
              </div>
            </div>

            {result.analysis?.details && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-zinc-800 pt-8">
                {Object.entries(result.analysis.details).map(
                  ([key, val]: [string, any]) => (
                    <div
                      key={key}
                      className="bg-zinc-950 border border-zinc-800 rounded-lg p-3"
                    >
                      <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">
                        {key}
                      </div>
                      <div className="text-sm font-semibold text-zinc-200">
                        {val} pts
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
