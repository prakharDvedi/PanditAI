"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Activity,
  Wallet,
  Briefcase,
  Heart,
  Sparkles,
} from "lucide-react";
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

  // tabs configuration
  const tabs = [
    { id: "analysis", label: "📏 Analysis" },
    { id: "charts", label: "🗺️ Charts" },
    { id: "timeline", label: "⏳ Timeline" },
    { id: "yogas", label: "🧘 Yogas" },
    { id: "chat", label: "💬 Chat" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#030014] text-[#f5f5f7] font-sans selection:bg-cyan-500/30 flex flex-col">
      {/* 1. Multi-stop Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0514] via-[#050505] to-[#020103] z-0" />

      {/* 2. Ambient Orbs - Variant Colors (Violet & Cyan) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse-slow z-0 pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse-slower z-0 pointer-events-none mix-blend-screen" />

      {/* 3. Subtle Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] z-[1] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* dashboard header */}
      <header className="relative z-20 pt-8 px-8 pb-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
        {/* top navigation bar */}
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
          {/* brand & title */}
          <div className="text-center md:text-left">
            <h1 className="text-xs tracking-[0.6em] uppercase text-white/40 mb-1">
              PanditAI
            </h1>
            <div className="text-2xl font-serif text-amber-100/90 tracking-wide">
              Vedic Life Architect
            </div>
          </div>

          {/* destiny score (placeholder if data missing) */}
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

        {/* navigation tabs */}
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

      {/* main content area */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto min-h-[500px]">
          {/* tab: analysis */}
          {activeTab === "analysis" && (
            <div
              className={`transition-all duration-700 space-y-12 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* 1. One-Line Insight Header (Dynamic) */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs tracking-widest uppercase font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                  Key Cosmic Focus
                </div>
                <p className="text-2xl md:text-3xl font-light text-white/90 max-w-2xl mx-auto leading-relaxed">
                  {data?.ai_reading?.meta?.insight ? (
                    <span>"{data.ai_reading.meta.insight}"</span>
                  ) : (
                    <span>
                      "Your{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300 font-normal">
                        Cosmic Energy
                      </span>{" "}
                      is shifting, bringing new opportunities for growth."
                    </span>
                  )}
                </p>
              </div>

              {/* 2. Symbolic Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const dominantKey =
                    data?.ai_reading?.meta?.dominant_category?.toLowerCase() ||
                    "career";

                  return [
                    {
                      key: "personality",
                      title: "Personality",
                      icon: <User className="w-6 h-6" />,
                      desc: "Inner Self & Ego",
                    },
                    {
                      key: "health",
                      title: "Health",
                      icon: <Activity className="w-6 h-6" />,
                      desc: "Vitality & Wellness",
                    },
                    {
                      key: "money",
                      title: "Money",
                      icon: <Wallet className="w-6 h-6" />,
                      desc: "Wealth & Assets",
                    },
                    {
                      key: "career",
                      title: "Career",
                      icon: <Briefcase className="w-6 h-6" />,
                      desc: "Purpose & Status",
                    },
                    {
                      key: "love",
                      title: "Love",
                      icon: <Heart className="w-6 h-6" />,
                      desc: "Relationships",
                    },
                    {
                      key: "miscellaneous",
                      title: "Miscellaneous",
                      icon: <Sparkles className="w-6 h-6" />,
                      desc: "Travel & Spirituality",
                    },
                  ].map((cat) => {
                    const isDominant = cat.key === dominantKey;
                    return (
                      <Link
                        key={cat.key}
                        href={`/prediction/${cat.key}`}
                        className={`group relative outline-none block p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                          isDominant ? "ring-2 ring-indigo-500/30" : ""
                        }`}
                      >
                        {/* Subtle Gradient Border on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover:from-indigo-500/50 group-hover:to-violet-500/50 transition-all duration-500 opacity-50 group-hover:opacity-100" />

                        <div className="relative h-40 p-6 rounded-2xl bg-[#030014]/90 backdrop-blur-xl flex flex-col justify-center items-center gap-4 transition-all duration-500">
                          {/* Dominant Highlight Tag */}
                          {isDominant && (
                            <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-indigo-300 font-bold opacity-80">
                              Dominant
                            </div>
                          )}

                          {/* Symbolic Icon */}
                          <div
                            className={`p-3 rounded-full bg-white/5 text-white/60 group-hover:text-white group-hover:bg-indigo-500/20 transition-all duration-500 group-hover:scale-110 ${
                              isDominant
                                ? "bg-indigo-500/20 text-indigo-200"
                                : ""
                            }`}
                          >
                            {cat.icon}
                          </div>

                          <div className="text-center space-y-1">
                            <h3 className="text-sm tracking-widest uppercase text-white/50 group-hover:text-white transition-colors duration-500 font-semibold">
                              {cat.title}
                            </h3>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider group-hover:text-white/50 transition-colors">
                              {cat.desc}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* tab: charts */}
          {activeTab === "charts" && <ChartViewer />}

          {/* tab: timeline */}
          {activeTab === "timeline" && (
            <TimelineViewer timeline={data?.dasha?.timeline} />
          )}

          {/* tab: yogas */}
          {activeTab === "yogas" && <YogaList yogas={data?.yogas} />}

          {/* tab: chat */}
          {activeTab === "chat" && (
            <AstrologerChat context={data?.meta?.fact_sheet} />
          )}
        </div>
      </main>
    </div>
  );
}
