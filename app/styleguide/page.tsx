"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "../../components/ui/button";
import { copy } from "../../lib/copy";

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-8 flex items-baseline gap-4 border-t border-border pt-6">
      <span className="font-mono text-xs text-primary">{eyebrow}</span>
      <h2 className="display-text text-3xl md:text-4xl">{title}</h2>
    </header>
  );
}

function Swatch({ name, value, className }: { name: string; value: string; className: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className={`h-24 rounded-lg border border-border ${className}`} />
      <div className="font-mono text-xs text-muted-foreground">
        <div className="text-foreground">{name}</div>
        <div>{value}</div>
      </div>
    </div>
  );
}

export default function StyleguidePage() {
  const { styleguide: sg } = copy;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grain-overlay" aria-hidden="true" />
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-24 md:px-10">
        <Reveal>
          <p className="font-mono text-xs tracking-[.12em] text-muted-foreground">{copy.brand.name.toUpperCase()} / {copy.brand.descriptor}</p>
          <h1 className="display-text mt-6 text-5xl md:text-7xl">{sg.title}</h1>
          <p className="body-text mt-6">{sg.intro}</p>
        </Reveal>

        {/* Palette */}
        <section className="mt-24">
          <SectionHeader eyebrow={sg.sections.palette.eyebrow} title={sg.sections.palette.title} />
          <Reveal>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
              <Swatch name={sg.paletteLabels.background} value="#08080A" className="bg-background" />
              <Swatch name={sg.paletteLabels.surface} value="#101014" className="bg-card" />
              <Swatch name={sg.paletteLabels.border} value="rgba(255,255,255,.08)" className="bg-background" />
              <Swatch name={sg.paletteLabels.text} value="#FAFAFA" className="bg-foreground" />
              <Swatch name={sg.paletteLabels.textMuted} value="#A1A1AA" className="bg-muted-foreground" />
              <Swatch name={sg.paletteLabels.accent} value="#D84A31" className="bg-primary" />
            </div>
          </Reveal>
        </section>

        {/* Typography */}
        <section className="mt-24">
          <SectionHeader eyebrow={sg.sections.typography.eyebrow} title={sg.sections.typography.title} />
          <Reveal className="flex flex-col gap-10">
            <div>
              <p className="mb-3 font-mono text-xs text-muted-foreground">{sg.typographyLabels.display}</p>
              <p className="display-text text-5xl md:text-7xl">Fixa hooken.</p>
            </div>
            <div>
              <p className="mb-3 font-mono text-xs text-muted-foreground">{sg.typographyLabels.body}</p>
              <p className="body-text">
                Varje siffra som visas i rapporten går att spåra till något modellen faktiskt observerat i videon —
                aldrig en gissning, aldrig en påhittad visningssiffra.
              </p>
            </div>
            <div>
              <p className="mb-3 font-mono text-xs text-muted-foreground">{sg.typographyLabels.tabular}</p>
              <p className="tabular-nums text-6xl font-semibold text-primary">87 / 100</p>
            </div>
          </Reveal>
        </section>

        {/* Spacing */}
        <section className="mt-24">
          <SectionHeader eyebrow={sg.sections.spacing.eyebrow} title={sg.sections.spacing.title} />
          <Reveal className="flex flex-col gap-3">
            {[8, 16, 24, 32, 48, 64, 96, 128].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">{size}px</span>
                <div className="h-2 rounded-full bg-primary" style={{ width: size * 2 }} />
              </div>
            ))}
          </Reveal>
        </section>

        {/* Buttons */}
        <section className="mt-24">
          <SectionHeader eyebrow={sg.sections.buttons.eyebrow} title={sg.sections.buttons.title} />
          <Reveal className="flex flex-wrap items-center gap-4">
            <Button variant="default">{copy.actions.analyse}</Button>
            <Button variant="outline">{copy.actions.tryAgain}</Button>
            <Button variant="secondary">{copy.actions.copy}</Button>
            <Button variant="ghost">{copy.actions.reset}</Button>
            <Button variant="destructive">Ta bort</Button>
            <Button variant="link">{copy.actions.loadDemo}</Button>
          </Reveal>
        </section>

        {/* Form field */}
        <section className="mt-24">
          <SectionHeader eyebrow={sg.sections.form.eyebrow} title={sg.sections.form.title} />
          <Reveal className="max-w-sm">
            <label className="mb-2 block font-mono text-xs tracking-[.08em] text-muted-foreground" htmlFor="sg-niche">
              {sg.formLabel}
            </label>
            <input
              id="sg-niche"
              type="text"
              placeholder={sg.formPlaceholder}
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </Reveal>
        </section>

        {/* Score */}
        <section className="mt-24">
          <SectionHeader eyebrow={sg.sections.score.eyebrow} title={sg.sections.score.title} />
          <Reveal className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-col gap-4">
              {sg.scoreSample.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="w-24 shrink-0 text-sm text-muted-foreground">{item.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${item.value}%` }} />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-sm tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Motion */}
        <section className="mt-24 mb-16">
          <SectionHeader eyebrow={sg.sections.motion.eyebrow} title={sg.sections.motion.title} />
          <Reveal className="rounded-lg border border-border bg-card p-8">
            <p className="body-text">{sg.motionCaption}</p>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
