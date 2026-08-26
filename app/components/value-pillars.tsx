"use client";

import { WobbleCard } from "../../components/ui/wobble-card";
import { BackgroundBeams } from "../../components/ui/background-beams";

export function ValuePillars() {
  return (
    <section className="relative z-10 overflow-hidden border-b border-border bg-background py-20 md:py-28">
      <BackgroundBeams className="opacity-60" />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-xl text-center">
          <p className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[.14em] text-muted-foreground">
            <i className="inline-block h-1.5 w-1.5 rounded-full bg-primary" style={{ boxShadow: "0 0 12px var(--primary)" }} /> VARFÖR RETAIN
          </p>
          <h2 className="display-text mt-6 text-4xl md:text-5xl">Byggt runt en enda fråga.</h2>
          <p className="body-text mx-auto mt-5">Var exakt tappar den här videon sina tittare — och vad gör du åt det innan du postar?</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 min-h-[280px] border border-border bg-[#150e0c]" className="py-10">
            <div className="max-w-md">
              <h3 className="text-balance font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">Tidsstämplad, inte generisk.</h3>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">Varje anmärkning pekar på ett exakt ögonblick i din video — inte allmänna tips som &quot;gör det mer engagerande&quot;.</p>
            </div>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[280px] border border-border bg-[#150e0c]" className="py-10">
            <h3 className="text-balance font-serif text-2xl font-medium tracking-tight text-foreground">Före och efter i samma rapport.</h3>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">Se din hook bredvid tre alternativ innan du väljer om du redigerar om.</p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[280px] border border-border bg-[#150e0c]" className="py-10">
            <h3 className="text-balance font-serif text-2xl font-medium tracking-tight text-foreground">Byggt för korta format.</h3>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">TikTok, Reels och Shorts — samma retentionslogik, granskad mot din plattform.</p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 min-h-[280px] border border-border bg-[#150e0c]" className="py-10">
            <div className="max-w-md">
              <h3 className="text-balance font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">Klart på under en minut.</h3>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">Ladda upp utkastet, få en färdig redigeringsplan innan du hunnit skriva klart texten till inlägget.</p>
            </div>
          </WobbleCard>
        </div>
      </div>
    </section>
  );
}
