"use client";

import { useState, useEffect } from "react";

export default function ChartViewer() {
  const [d1Image, setD1Image] = useState<string | null>(null);
  const [d9Image, setD9Image] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // helper function to fetch chart image
  const fetchChart = async (style: "d1" | "d9", details: any) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/chart-image?style=${style}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      if (res.ok) {
        const blob = await res.blob();
        return URL.createObjectURL(blob);
      }
    } catch (e) {
      console.error(`Failed to fetch ${style} chart`, e);
    }
    return null;
  };

  useEffect(() => {
    const loadCharts = async () => {
      const storedDetails = localStorage.getItem("birth_details");
      if (!storedDetails) {
        setLoading(false);
        return;
      }

      const details = JSON.parse(storedDetails);

      // fetch both charts in parallel
      const [d1, d9] = await Promise.all([
        fetchChart("d1", details),
        fetchChart("d9", details),
      ]);

      setD1Image(d1);
      setD9Image(d9);
      setLoading(false);
    };

    loadCharts();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground animate-pulse">
        Generating your Vedic Charts...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-reveal">
      {/* d1 chart card */}
      <div className="flex flex-col items-center p-6 rounded-2xl bg-card/40 border border-white/5">
        <h3 className="text-xl font-serif text-foreground mb-4">
          Lagna Chart (D1)
        </h3>
        {d1Image ? (
          <img
            src={d1Image}
            alt="D1 Chart"
            className="w-full max-w-sm rounded-lg shadow-lg border border-white/5"
          />
        ) : (
          <div className="w-full h-64 bg-black/20 rounded flex items-center justify-center text-muted-foreground/50 text-sm">
            Chart Unavailable
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-4 text-center">
          The primary birth chart representing your physical body and general
          destiny.
        </p>
      </div>

      {/* d9 chart card */}
      <div className="bg-card/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center">
        <h3 className="text-xl font-serif text-foreground mb-4">
          Navamsa Chart (D9)
        </h3>
        {d9Image ? (
          <img
            src={d9Image}
            alt="D9 Chart"
            className="w-full max-w-sm rounded-lg shadow-lg border border-white/5"
          />
        ) : (
          <div className="w-full h-64 bg-black/20 rounded flex items-center justify-center text-muted-foreground/50 text-sm">
            Chart Unavailable
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-4 text-center">
          The chart of the soul and internal strength, primarily used for
          marriage and fruit of karma.
        </p>
      </div>
    </div>
  );
}
