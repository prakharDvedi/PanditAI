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
  LayoutDashboard,
  Compass,
  Hourglass,
  Crown,
  MessageCircle,
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

  // tabs config
  const tabs = [
    { id: "analysis", label: "Analysis", icon: LayoutDashboard },
    { id: "charts", label: "Charts", icon: Compass },
    { id: "timeline", label: "Timeline", icon: Hourglass },
    { id: "yogas", label: "Yogas", icon: Crown },
    { id: "chat", label: "Chat", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen relative bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
      {/* Background: Subtle Warm Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

      <header className="relative z-20 pt-8 px-8 pb-4 border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-6 text-xs uppercase tracking-widest text-muted-foreground/60">
          <div className="flex gap-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link
              href="/matching"
              className="hover:text-primary transition-colors"
            >
              MatchMaking
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-xs tracking-[0.6em] uppercase text-muted-foreground mb-1">
              PanditAI
            </h1>
            <div className="text-2xl font-serif text-foreground tracking-wide">
              Vedic Life Architect
            </div>
          </div>

          {/* destiny score */}
          <div className="group relative flex items-center gap-4 bg-card/40 rounded-full px-6 py-2 border border-white/5 cursor-help ring-1 ring-white/5">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Destiny Score
              </div>
              <div className="text-xl font-bold text-primary">
                {data?.meta ? data.meta.destiny_score : "--"}/100
              </div>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary bg-primary/5">
              <span className="text-lg">🌟</span>
            </div>

            <div className="absolute top-full mt-2 right-0 w-64 p-4 bg-popover border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-xs text-muted-foreground leading-relaxed translate-y-2 group-hover:translate-y-0">
              <p>
                <strong className="text-primary block mb-1">
                  Vedic Strength Index
                </strong>
                Aggregated score based on planetary strengths (Shadbala),
                benefic aspects, and Raja Yogas formatted in your birth chart.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 flex gap-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={`relative px-1 py-2 text-sm tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4 mb-0.5" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-px bg-primary shadow-[0_0_10px_var(--primary)]" />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto min-h-[500px]">
          {/* tab: analysis */}
          {activeTab === "analysis" && (
            <div
              className={`transition-all duration-700 space-y-12 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* insight header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs tracking-widest uppercase font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary "></span>
                  Key Cosmic Focus
                </div>
                <p className="text-2xl md:text-3xl font-light text-foreground/90 max-w-4xl mx-auto leading-relaxed">
                  {data?.ai_reading?.meta?.insight ? (
                    <span>"{data.ai_reading.meta.insight}"</span>
                  ) : (
                    <span>
                      "Your{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-normal">
                        Cosmic Energy
                      </span>{" "}
                      is shifting, bringing new opportunities for growth."
                    </span>
                  )}
                </p>
              </div>

              {/* categories grid */}
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
                          isDominant ? "ring-2 ring-primary/40" : ""
                        }`}
                      >
                        {/* hover gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-500 opacity-50 group-hover:opacity-100" />

                        <div className="relative h-40 p-6 rounded-2xl bg-card/60 backdrop-blur-xl flex flex-col justify-center items-center gap-4 transition-all duration-500 border border-white/5 group-hover:border-primary/20">
                          {/* dominant tag */}
                          {isDominant && (
                            <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-primary font-bold opacity-80 border border-primary/20 px-2 py-0.5 rounded-full">
                              Dominant
                            </div>
                          )}

                          {/* icon */}
                          <div
                            className={`p-3 rounded-full bg-white/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500 group-hover:scale-110 ${
                              isDominant ? "bg-primary/10 text-primary" : ""
                            }`}
                          >
                            {cat.icon}
                          </div>

                          <div className="text-center space-y-1">
                            <h3 className="text-sm tracking-widest uppercase text-foreground/70 group-hover:text-foreground transition-colors duration-500 font-semibold">
                              {cat.title}
                            </h3>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider group-hover:text-muted-foreground/80 transition-colors">
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

          {activeTab === "charts" && <ChartViewer />}

          {activeTab === "timeline" && (
            <TimelineViewer timeline={data?.dasha?.timeline} />
          )}

          {activeTab === "yogas" && <YogaList yogas={data?.yogas} />}

          {activeTab === "chat" && (
            <AstrologerChat context={data?.meta?.fact_sheet} />
          )}
        </div>
      </main>
    </div>
  );
}
