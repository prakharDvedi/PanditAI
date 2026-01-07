"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type CategoryKey =
  | "personality"
  | "health"
  | "money"
  | "career"
  | "love"
  | "miscellaneous";

const categoryMeta: Record<CategoryKey, { title: string; image: string }> = {
  personality: { title: "Personality", image: "/personality-bg.png" },
  health: { title: "Health", image: "/health.png" },
  money: { title: "Money", image: "/money.png" },
  career: { title: "Career", image: "/career.png" },
  love: { title: "Love", image: "/love.png" },
  miscellaneous: { title: "Miscellaneous", image: "/misc.png" },
};

export default function AnalysisCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as CategoryKey;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check if category is valid
    if (!categoryMeta[category]) {
      router.push("/prediction");
      return;
    }

    const cached = localStorage.getItem("prediction");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setData(parsed);
      } catch (e) {
        console.error("Failed to parse prediction data", e);
      }
    }
    setLoading(false);
  }, [category, router]);

  if (loading) {
    return <div className="min-h-screen bg-[#08080a]" />;
  }

  const meta = categoryMeta[category];
  const content =
    data?.ai_reading && typeof data.ai_reading === "object"
      ? data.ai_reading[category]
      : "No detailed analysis available for this section.";

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#08080a] text-[#f5f5f7] font-sans selection:bg-amber-200/30 flex flex-col">
      {/* background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1a1a2e,_transparent_70%)] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_#0d0d0d,_transparent_50%)] pointer-events-none" />

      {/* header */}
      <header className="relative z-20 pt-8 px-8 pb-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
        {/* header background image (subtle) */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm pointer-events-none"
          style={{ backgroundImage: `url('${meta.image}')` }}
        />
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        <div className="max-w-4xl mx-auto flex items-center gap-4 relative z-10">
          <Link
            href="/prediction"
            className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-sm tracking-widest uppercase text-amber-100/90 flex items-center gap-3">
              {meta.title} Analysis
            </h1>
          </div>
        </div>
      </header>

      {/* content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto animate-reveal">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-zinc-300 font-light whitespace-pre-line">
                {content}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
