import Link from "next/link";
import { Crown } from "lucide-react";
import PredictionClient from "@/components/client/PredictionClient";

export const metadata = {
  title: "Your Vedic Prediction | PanditAI",
  description:
    "Explore your personalized Vedic astrology insights powered by AI",
};

export default function PredictionPage() {
  return (
    <div className="min-h-screen relative bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
      {/* Background: Subtle Warm Gradient (SSR) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

      {/* Interactive Content (Client-Rendered) */}
      <PredictionClient />
    </div>
  );
}
