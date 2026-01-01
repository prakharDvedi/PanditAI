"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ChartViewer from "@/components/ChartViewer";
import TimelineViewer from "@/components/TimelineViewer";
import YogaList from "@/components/YogaList";
import AstrologerChat from "@/components/AstrologerChat";

type CategoryKey =
  | "personality"
  | "health"
  | "money"
  | "career"
  | "love"
  | "miscellaneous";

const categories: { key: CategoryKey; title: string; icon: string }[] = [
  { key: "personality", title: "Personality", icon: "🧑‍🦱👧" },
  { key: "health", title: "Health", icon: "❤️‍🩹" },
  { key: "money", title: "Money", icon: "🤑🫰" },
  { key: "career", title: "Career", icon: "🏢💼" },
  { key: "love", title: "Love", icon: "🥰💌" },
  { key: "miscellaneous", title: "Miscellaneous", icon: "🥀" },
];

export default function PredictionPage() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("analysis");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("prediction");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setData(parsed);
      } catch (e) {
        console.error("Failed to parse prediction data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Tabs Configuration
  const tabs = [
    { id: "analysis", label: "📏 Analysis" },
    { id: "charts", label: "🗺️ Charts" },
    { id: "timeline", label: "⏳ Timeline" },
    { id: "yogas", label: "🧘 Yogas" },
    { id: "chat", label: "💬 Chat" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#08080a] text-[#f5f5f7] font-sans selection:bg-amber-200/30 flex flex-col">
      {/* 🌌 Atmospheric Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1a1a2e,_transparent_70%)] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_#0d0d0d,_transparent_50%)] pointer-events-none" />

      {/* 🏛️ Dashboard Header */}
      <header className="relative z-20 pt-8 px-8 pb-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
        {/* Top Navigation Bar */}
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-6 text-xs uppercase tracking-widest text-white/40">
          <div className="flex gap-6">
            <Link href="/" className="hover:text-amber-200 transition-colors">
              Home
            </Link>
            <Link
              href="/matching"
              className="hover:text-amber-200 transition-colors"
            >
              MatchMaking
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand & Title */}
          <div className="text-center md:text-left">
            <h1 className="text-xs tracking-[0.6em] uppercase text-white/40 mb-1">
              PanditAI
            </h1>
            <div className="text-2xl font-serif text-amber-100/90 tracking-wide">
              Vedic Life Architect
            </div>
          </div>

          {/* Destiny Score (Placeholder if data missing) */}
          <div className="group relative flex items-center gap-4 bg-white/5 rounded-full px-6 py-2 border border-white/10 cursor-help">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-white/50">
                Destiny Score
              </div>
              <div className="text-xl font-bold text-amber-200">
                {data?.meta ? data.meta.destiny_score : "--"}/100
              </div>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-amber-200/30 flex items-center justify-center">
              <span className="text-lg">🌟</span>
            </div>

            {/* tooltip */}
            <div className="absolute top-full mt-2 right-0 w-64 p-4 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-xs text-zinc-300 leading-relaxed translate-y-2 group-hover:translate-y-0">
              <p>
                <strong className="text-amber-200 block mb-1">
                  Vedic Strength Index
                </strong>
                Aggregated score based on planetary strengths (Shadbala),
                benefic aspects, and Raja Yogas formatted in your birth chart.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-8 flex gap-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={`relative px-1 py-2 text-sm tracking-widest uppercase transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-amber-200"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-px bg-amber-200 shadow-[0_0_10px_#fcd34d]" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto min-h-[500px]">
          {/* TAB: ANALYSIS */}
          {activeTab === "analysis" && (
            <div
              className={`transition-all duration-700 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <Link
                    key={cat.key}
                    href={`/prediction/${cat.key}`}
                    className="group relative text-left outline-none block"
                  >
                    <div className="absolute inset-0 bg-amber-200/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative h-48 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm flex flex-col justify-between transition-all duration-500 group-hover:border-amber-200/20 group-hover:-translate-y-1">
                      <span className="text-2xl font-light text-amber-100/40 group-hover:text-amber-100/80 transition-colors duration-500">
                        {cat.icon}
                      </span>
                      <div>
                        <h3 className="text-lg font-serif tracking-widest text-white/80 group-hover:text-white transition-colors duration-500">
                          {cat.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CHARTS */}
          {activeTab === "charts" && <ChartViewer />}

          {/* TAB: TIMELINE */}
          {activeTab === "timeline" && (
            <TimelineViewer timeline={data?.dasha?.timeline} />
          )}

          {/* TAB: YOGAS */}
          {activeTab === "yogas" && <YogaList yogas={data?.yogas} />}

          {/* TAB: CHAT */}
          {activeTab === "chat" && (
            <AstrologerChat context={data?.meta?.fact_sheet} />
          )}
        </div>
      </main>
    </div>
  );
}
