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
      {/* bg gradient*/}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

      <main className="relative z-10 flex flex-1 flex-col lg:flex-row items-center justify-center gap-12 p-6 lg:p-24">
        {/* left side static */}
        <div className="text-center lg:text-left space-y-6 max-w-2xl">
          <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-xl font-serif">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              PanditAI
            </span>
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-lg mx-auto lg:mx-0">
            Ancient Vedic astrology met with modern AI. Reveal your cosmic
            blueprint with precision.
          </p>
        </div>

        {/* right side form */}
        <HomeClient />
      </main>
    </div>
  );
}
