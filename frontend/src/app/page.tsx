import { Metadata } from "next";
import HomeClient from "@/components/client/HomeClient";

export const metadata: Metadata = {
  title: "PanditAI - Vedic Life Architect",
  description:
    "Ancient Vedic astrology met with modern AI. Reveal your cosmic blueprint with precision.",
};

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <main className="relative z-10 flex flex-1 flex-col lg:flex-row items-center justify-center gap-12 p-6 lg:p-24">
        <div className="text-center lg:text-left space-y-4 max-w-2xl">
          <h2 className="type-xxl font-heading text-foreground">
            Welcome to <span className="text-primary">PanditAI</span>
          </h2>
          <p className="type-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
            Ancient Vedic astrology met with modern AI. Reveal your cosmic
            blueprint with precision.
          </p>
        </div>

        <HomeClient />
      </main>
    </div>
  );
}
