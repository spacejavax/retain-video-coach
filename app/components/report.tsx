"use client";
/* eslint-disable react/no-unescaped-entities -- editorial labels intentionally use apostrophes */

import { useState } from "react";
import { ArrowRight, Check, Copy, RotateCcw } from "lucide-react";
import { copy } from "../../lib/copy";
import type { Analysis } from "../../lib/schema";
import { usePrefersReducedMotion } from "../../lib/use-prefers-reduced-motion";
import { Button } from "../../components/ui/button";
import { BorderBeam } from "../../components/ui/border-beam";
import { MagicCard } from "../../components/ui/magic-card";
import { NumberTicker } from "../../components/ui/number-ticker";

function Beam() {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return null;
  return <BorderBeam size={90} duration={7} colorFrom="#d84a31" colorTo="#ff8f6b" />;
}

function ReportTitle({ index, eyebrow, title }: { index: string; eyebrow: string; title: string }) {
  return (
    <header className="mb-8 grid grid-cols-[60px_1fr] border-t border-border pt-6">
      <span className="font-mono text-[10px] text-primary">{index}</span>
      <div>
        <p className="font-mono text-[8px] tracking-[.1em] text-muted-foreground">{eyebrow}</p>
        <h2 className="display-text mt-1.5 text-3xl md:text-5xl">{title}</h2>
      </div>
    </header>
  );
}

function ReportHeader({ onReset }: { onReset: () => void }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-5 md:px-10">
      <button className="border-0 bg-transparent p-0 font-serif text-lg font-semibold tracking-tight text-foreground" aria-label={`${copy.brand.name} rapport`}>
        <span>{copy.brand.name}</span><sup className="mt-0.5 font-mono text-[7px]">®</sup>
      </button>
      <span className="hidden font-mono text-[10px] tracking-[.12em] text-muted-foreground sm:inline">REDIGERINGSRAPPORT / SLUTGILTIG</span>
      <button className="border-0 border-b border-primary bg-transparent pb-0.5 font-mono text-[10px] tracking-[.08em] text-primary" onClick={onReset}>NY REDIGERING ↗</button>
    </header>
  );
}

export function AnalysisReport({ result, onReset, demo }: { result: Analysis; onReset: () => void; demo: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copyScript() { await navigator.clipboard.writeText(result.revisedScript); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }

  return (
    <div className="page-enter min-h-screen bg-background text-foreground">
      <ReportHeader onReset={onReset} />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-6 md:px-10">
        {demo && (
          <div className="mb-4 flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3">
            <span className="font-mono text-[9px] tracking-[.08em] text-primary">EXEMPELDATA</span>
            <p className="text-xs text-muted-foreground">Ingen video analyserades för den här rapporten.</p>
          </div>
        )}

        <section className="relative grid overflow-hidden rounded-lg border border-border bg-card md:grid-cols-[300px_1fr]">
          <Beam />
          <div className="flex flex-col items-center gap-4 border-b border-border p-8 text-center md:border-b-0 md:border-r">
            <div
              className="relative grid h-44 w-44 place-items-center rounded-full"
              style={{ background: `conic-gradient(var(--primary) ${result.overallScore * 3.6}deg, var(--border) 0)` }}
            >
              <div className="absolute inset-3 rounded-full bg-card" />
              <NumberTicker value={result.overallScore} className="z-10 font-mono text-6xl tabular-nums" />
              <span className="absolute bottom-11 z-10 font-mono text-[9px] text-muted-foreground">/100</span>
            </div>
            <p className="font-mono text-[8px] tracking-[.08em] text-muted-foreground">RETENTIONSPOTENTIAL</p>
            <b className="font-serif text-xl italic text-primary">{copy.scoreLabels[result.scoreLabel]}</b>
          </div>
          <div className="p-8 md:p-11">
            <p className="font-mono text-[10px] tracking-[.08em] text-muted-foreground">REDAKTÖRENS BEDÖMNING</p>
            <h1 className="display-text mt-5 text-3xl md:text-5xl">{result.summary}</h1>
            <div className="grid grid-cols-[110px_1fr] gap-2 border-t border-border pt-4">
              <span className="font-mono text-[8px] text-primary">FÖRSTA ÅTGÄRDEN</span>
              <p className="text-sm">{result.biggestProblem}</p>
            </div>
          </div>
        </section>

        <section className="my-4 grid overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7" aria-label="Kategoripoäng">
          {Object.entries(result.scores).map(([key, value], index) => (
            <div key={key} className="border-b border-r border-border p-4 [&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0">
              <span className="font-mono text-[8px] text-muted-foreground">0{index + 1}</span>
              <p className="mt-1 min-h-7 text-[11px]">{copy.categoryScores[key as keyof typeof copy.categoryScores]}</p>
              <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-border"><i className="block h-full origin-left bg-foreground" style={{ transform: `scaleX(${value / 100})` }} /></div>
              <strong className="mt-2 block text-right font-mono text-xl tabular-nums">{value}</strong>
            </div>
          ))}
        </section>

        <section className="pb-16">
          <ReportTitle index="01" eyebrow="STÖRST EFFEKT" title="Fixa detta först" />
          <div className="overflow-hidden rounded-lg border border-border">
            {result.priorityActions.map((action, index) => (
              <MagicCard key={action} className="rounded-none border-b border-border last:border-b-0" gradientColor="#16161b" gradientFrom="#d84a31" gradientTo="#a43120" gradientOpacity={0.4}>
                <article className="grid grid-cols-[50px_1fr_30px] items-center gap-2 px-5 py-5">
                  <span className="font-mono text-sm text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <p className="max-w-2xl text-sm">{action}</p>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </article>
              </MagicCard>
            ))}
          </div>
        </section>

        <section className="pb-16">
          <ReportTitle index="02" eyebrow="ÖPPNA STARKARE" title="Skriv om första raden" />
          <div className="border-l-4 border-primary bg-secondary p-6">
            <span className="font-mono text-[8px] tracking-[.08em] text-muted-foreground">ORIGINAL HOOK</span>
            <blockquote className="my-3 font-serif text-xl italic md:text-2xl">"{result.hookAnalysis.currentHook}"</blockquote>
            <p className="max-w-2xl text-xs text-muted-foreground">{result.hookAnalysis.assessment}</p>
          </div>
          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
            {result.hookAnalysis.improvedHooks.map((hook, index) => (
              <MagicCard key={hook} className="rounded-lg" gradientColor="#16161b" gradientFrom="#d84a31" gradientTo="#a43120" gradientOpacity={0.5}>
                <article className="p-5">
                  <span className="font-mono text-[8px] tracking-[.08em] text-muted-foreground">TAGNING {index + 1}</span>
                  <blockquote className="mt-4 font-serif text-lg italic">"{hook}"</blockquote>
                </article>
              </MagicCard>
            ))}
          </div>
        </section>

        <section className="pb-16">
          <ReportTitle index="03" eyebrow="ÖGONBLICK FÖR ÖGONBLICK" title="Var uppmärksamheten kan tappas" />
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            {result.timelineIssues.map((issue, index) => (
              <article key={`${issue.startTime}-${index}`} className="grid border-b border-border last:border-b-0 sm:grid-cols-[150px_1fr]">
                <div className="flex flex-col gap-1.5 border-b border-border p-5 sm:border-b-0 sm:border-r">
                  <strong className="font-mono text-2xl tabular-nums">{issue.startTime}</strong>
                  <span className="font-mono text-[8px] text-muted-foreground">TILL {issue.endTime}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-1 font-mono text-[8px] font-bold uppercase ${issue.severity === "high" ? "bg-destructive/20 text-destructive" : issue.severity === "medium" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>{copy.severity[issue.severity]}</span>
                    <b className="font-mono text-[9px] text-muted-foreground">{issue.category}</b>
                  </div>
                  <h3 className="mt-3 text-base font-semibold">{issue.issue}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{issue.whyItMatters}</p>
                  <div className="mt-4 grid grid-cols-[110px_1fr] gap-2 bg-background p-3">
                    <span className="font-mono text-[8px] text-primary">REDAKTÖRENS ANTECKNING</span>
                    <p className="text-[11px]">{issue.exactFix}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-8 pb-16 md:grid-cols-2">
          <section>
            <ReportTitle index="04" eyebrow="STRAMA ÅT KLIPPET" title="Ta bort dessa ögonblick" />
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {result.recommendedCuts.map(cut => (
                <article key={`${cut.startTime}-${cut.endTime}`} className="grid grid-cols-[105px_1fr] gap-2 border-b border-border p-4 last:border-b-0">
                  <span className="font-mono text-[9px] text-primary">{cut.startTime}–{cut.endTime}</span>
                  <p className="text-[11px] leading-relaxed">{cut.reason}</p>
                </article>
              ))}
            </div>
          </section>
          <section>
            <ReportTitle index="05" eyebrow="LÄGG TILL SAMMANHANG" title="Text värd att visa" />
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {result.textOverlaySuggestions.map(item => (
                <article key={item.timestamp} className="grid grid-cols-[105px_1fr] gap-2 border-b border-border p-4 last:border-b-0">
                  <span className="font-mono text-[9px] text-primary">{item.timestamp}</span>
                  <div>
                    <strong className="font-serif text-base">"{item.text}"</strong>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">{item.purpose}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="pb-16">
          <ReportTitle index="06" eyebrow="BEVARA DET SOM FUNGERAR" title="Behåll det som fungerar" />
          <p className="max-w-2xl font-serif text-2xl">{result.strongestElement}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {result.strengths.map(strength => (
              <span key={strength} className="flex items-center gap-1.5 rounded-full border border-[#65d89a] px-3 py-2 text-[11px] text-[#65d89a]"><Check className="size-3" />{strength}</span>
            ))}
          </div>
        </section>

        <section className="relative pb-16">
          <ReportTitle index="07" eyebrow="NÄSTA TAGNING" title="Omskrivet manus" />
          <button className="absolute right-0 top-6 flex items-center gap-1.5 border-0 border-b border-foreground bg-transparent pb-0.5 font-mono text-[9px] text-foreground" onClick={copyScript}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied ? "KOPIERAT" : "KOPIERA MANUS"}
          </button>
          <MagicCard className="rounded-lg" gradientColor="#16161b" gradientFrom="#d84a31" gradientTo="#a43120" gradientOpacity={0.5}>
            <div className="whitespace-pre-wrap p-8 font-serif text-xl leading-relaxed md:p-12 md:text-2xl">{result.revisedScript}</div>
          </MagicCard>
        </section>

        <section className="flex flex-col items-start gap-6 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[10px] text-muted-foreground">{result.disclaimer}</p>
          <Button variant="default" size="lg" className="h-12 w-full px-6 sm:w-auto" onClick={onReset}>Analysera en ny video <RotateCcw /></Button>
        </section>
      </main>
      <footer className="mx-auto flex max-w-5xl flex-col gap-2 border-t border-border px-5 py-6 font-mono text-[8px] text-muted-foreground sm:flex-row sm:justify-between md:px-10">
        <span>© 2026 {copy.brand.name}</span>
        <span>KREATIV VÄGLEDNING, INGEN RESULTATGARANTI</span>
      </footer>
    </div>
  );
}
