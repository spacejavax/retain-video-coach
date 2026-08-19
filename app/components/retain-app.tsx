"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, FileVideo, Pause, Play, ShieldCheck, Upload, X } from "lucide-react";
import { copy } from "../../lib/copy";
import { sampleAnalysis } from "../../lib/mock-analysis";
import type { Analysis } from "../../lib/schema";
import { validateVideo } from "../../lib/upload-validation";
import { usePrefersReducedMotion } from "../../lib/use-prefers-reduced-motion";
import type { COBEOptions } from "cobe";
import { Button } from "../../components/ui/button";
import { BlurFade } from "../../components/ui/blur-fade";
import { BorderBeam } from "../../components/ui/border-beam";
import { Globe } from "../../components/ui/globe";
import { MagicCard } from "../../components/ui/magic-card";
import { NumberTicker } from "../../components/ui/number-ticker";
import { Particles } from "../../components/ui/particles";
import { AnalysisReport } from "./report";

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;
  return <BlurFade delay={delay} duration={0.5} className={className}>{children}</BlurFade>;
}

function Beam() {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return null;
  return <BorderBeam size={90} duration={7} colorFrom="#d84a31" colorTo="#ff8f6b" />;
}

type View = "landing" | "form" | "loading" | "report";
type FormState = {
  platform: "TikTok" | "Instagram Reels" | "YouTube Shorts";
  niche: string;
  audience: string;
  goal: "views" | "engagement" | "followers" | "conversions";
};

const stages = ["Laddar upp video", "Läser inledningen", "Granskar tempot", "Markerar svaga ögonblick", "Skriver din redigering"];
const platformOptions = ["TikTok", "Instagram Reels", "YouTube Shorts"] as const;
const goalOptions = ["views", "engagement", "followers", "conversions"] as const;

const workflowSteps = [
  { title: "Ladda upp utkastet", body: "Dra in ett råklipp i MP4, MOV eller WEBM — upp till 90 sekunder, oavsett var du filmar det." },
  { title: "Retain analyserar bild för bild", body: "Hook, tempo, tydlighet och avslutning granskas mot vad som faktiskt håller kvar tittare." },
  { title: "Få en redigering med tidsstämplar", body: "Konkreta ändringar, redo att klippa in — ingen gissningslek om vad som saknades." },
];

const RETAIN_GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.32,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.09, 0.09, 0.11],
  markerColor: [216 / 255, 74 / 255, 49 / 255],
  glowColor: [216 / 255, 74 / 255, 49 / 255],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
    { location: [59.3293, 18.0686], size: 0.05 },
    { location: [51.5072, -0.1276], size: 0.07 },
  ],
};

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className="flex items-start gap-0.5 border-0 bg-transparent p-0 font-serif text-lg font-semibold tracking-tight text-foreground"
      onClick={onClick}
      aria-label={`${copy.brand.name} — startsida`}
    >
      <span>{copy.brand.name}</span>
      <sup className="mt-0.5 font-mono text-[7px]">®</sup>
    </button>
  );
}

function SiteHeader({ demoMode, onHome, onDemo }: { demoMode: boolean; onHome: () => void; onDemo: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur md:px-10">
      <Brand onClick={onHome} />
      <span className="hidden font-mono text-[10px] tracking-[.12em] text-muted-foreground sm:inline">{copy.brand.descriptor}</span>
      {demoMode ? (
        <button className="border-0 border-b border-primary bg-transparent pb-0.5 font-mono text-[10px] tracking-[.08em] text-primary" onClick={onDemo}>
          ÖPPNA EXEMPEL ↗
        </button>
      ) : (
        <span className="flex items-center gap-2 font-mono text-[9px] tracking-[.08em] text-muted-foreground">
          <i className="inline-block h-1.5 w-1.5 rounded-full bg-primary" /> GEMINI REDO
        </span>
      )}
    </header>
  );
}

function DemoConsole() {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const consoleRef = useRef<HTMLDivElement>(null);
  const active = progress >= 36;

  useEffect(() => {
    const node = consoleRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setPlaying(current => entry.isIntersecting ? current : false), { threshold: .2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setProgress(value => value >= 100 ? 0 : value + .5), 70);
    const visibility = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", visibility);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", visibility); };
  }, [playing]);

  return (
    <div ref={consoleRef} aria-label="Exempel på pågående Retain-analys" className="relative overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/40">
      <Beam />
      <div className="flex h-10 items-center justify-between border-b border-border px-4 font-mono text-[9px] tracking-[.08em] text-muted-foreground">
        <span className="text-foreground"><i className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />EXEMPELANALYS</span>
        <span className="hidden sm:inline">utkast_07.mp4</span>
        <span>00:{String(Math.floor(progress * .12)).padStart(2, "0")} / 00:12</span>
      </div>
      <div className="grid gap-0 sm:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:border-b-0 sm:border-r">
          <div className="relative mx-auto aspect-[9/16] w-40 overflow-hidden rounded-md">
            <div className="absolute inset-0 bg-gradient-to-b from-[#2a1512] via-[#1a1110] to-[#0d0b0a]" />
            <div className="absolute left-1/2 top-[40%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-2xl" />
            <div className="absolute inset-x-[18%] top-[24%] bottom-[32%] rounded-sm border border-primary/70">
              <span className="absolute -top-[18px] left-0 rounded-t-sm bg-primary px-1.5 py-0.5 font-mono text-[7px] font-semibold tracking-wide text-primary-foreground">MOTIV</span>
            </div>
            <span className="absolute right-2 top-2 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[8px] text-foreground/80">00:05.2</span>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2.5 pb-2.5 pt-8">
              <span className="block text-center text-[11px] leading-snug text-foreground/90">”En del undrar hur jag...”</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="grid h-7 w-7 shrink-0 place-items-center rounded border border-border text-foreground" onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pausa exempelanalys" : "Spela upp exempelanalys"}>
              {playing ? <Pause className="size-3" /> : <Play className="size-3" />}
            </button>
            <div className="flex h-6 flex-1 items-center gap-[3px]" aria-hidden="true">
              {Array.from({ length: 24 }, (_, i) => <i key={i} className="w-[2px] bg-border" style={{ height: `${22 + (i * 17) % 68}%` }} />)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 content-start">
          <div className="border-b border-border p-5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[8px] tracking-[.1em] text-muted-foreground">RETENTIONSPOÄNG</span>
              <NumberTicker value={active ? 78 : 61} className="font-mono text-4xl tabular-nums text-primary" />
            </div>
            <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-border">
              <i className="block h-full origin-left bg-primary transition-transform duration-700" style={{ transform: `scaleX(${active ? .78 : .61})` }} />
            </div>
            <small className="mt-2 block font-mono text-[9px] text-muted-foreground">{active ? "+17 efter föreslagen ändring" : "Originalklipp"}</small>
          </div>
          <div className={`border-b border-border p-5 transition-opacity duration-200 ${active ? "opacity-100" : "opacity-50"}`}>
            <div className="flex justify-between font-mono text-[8px] text-muted-foreground"><span>00:05</span><b className="text-primary">STOR EFFEKT</b></div>
            <h3 className="mt-2 text-lg tracking-tight text-foreground">Löftet kommer för sent</h3>
            <p className="mt-1 text-xs text-muted-foreground">Tittarna hör sammanhanget innan de vet vad de får ut av det.</p>
          </div>
          <div className={`p-5 transition-opacity duration-200 ${active ? "opacity-100" : "opacity-50"}`}>
            <span className="font-mono text-[8px] tracking-[.1em] text-muted-foreground">REKOMMENDERAD ÄNDRING</span>
            <p className="mt-2 text-xs text-foreground">Öppna med resultatet, förklara sedan hur du kom dit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Landing({ onStart, onDemo }: { onStart: () => void; onDemo: () => void }) {
  return (
    <div className="page-enter min-h-screen bg-background text-foreground">
      <div className="grain-overlay" aria-hidden="true" />
      <header className="relative z-10 flex h-16 items-center justify-between border-b border-border px-5 md:px-10">
        <Brand />
        <nav aria-label="Huvudnavigation" className="hidden items-center gap-7 md:flex">
          <a className="text-xs text-muted-foreground hover:text-foreground" href="#product">Produkt</a>
          <button className="text-xs text-muted-foreground hover:text-foreground" onClick={onDemo}>Exempelrapport</button>
          <a className="text-xs text-muted-foreground hover:text-foreground" href="#workflow">Så funkar det</a>
        </nav>
        <Button variant="default" size="sm" onClick={onStart}>Analysera video <ArrowRight /></Button>
      </header>
      <main className="relative z-10 mx-auto grid max-w-6xl gap-14 px-5 py-16 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-24" id="product">
        <div className="relative overflow-hidden">
          <Particles className="absolute -inset-x-10 -inset-y-16 -z-10" quantity={60} color="#d84a31" size={0.5} ease={70} />
          <Reveal>
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[.14em] text-muted-foreground">
              <i className="inline-block h-1.5 w-1.5 rounded-full bg-primary" style={{ boxShadow: "0 0 12px var(--primary)" }} /> AI-REDIGERARE FÖR RETENTION
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-text mt-6 text-5xl md:text-7xl">Se var tittarna hoppar av <span className="text-muted-foreground">innan du publicerar.</span></h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="body-text mt-6">Ladda upp ett utkast. Retain analyserar videon, markerar ögonblicken som försvagar retentionen och ger dig exakta redigeringar med tidsstämplar.</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="default" size="lg" className="h-12 px-6" onClick={onStart}>Analysera din video <ArrowRight /></Button>
              <Button variant="outline" size="lg" className="h-12 px-6" onClick={onDemo}>Visa exempelrapport</Button>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <p className="mt-5 font-mono text-[8px] tracking-[.08em] text-muted-foreground">MP4 · MOV · WEBM <span className="mx-2">·</span> MAX 50 MB <span className="mx-2">·</span> MAX 90 SEK</p>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <DemoConsole />
        </Reveal>
      </main>
      <Reveal>
        <div className="relative z-10 grid grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { label: "AI-MOTOR", value: "Gemini 2.5" },
            { label: "EFTER ANALYS", value: "Videon raderas" },
            { label: "FEEDBACKFORMAT", value: "Tidsstämplad, inte generisk" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between gap-4 px-5 py-4 md:px-10">
              <span className="font-mono text-[9px] tracking-[.08em] text-muted-foreground">{item.label}</span>
              <span className="text-right text-xs font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </Reveal>
      <section id="workflow" className="relative z-10 border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-20 md:grid-cols-[.95fr_1.05fr] md:items-center md:py-28">
          <Reveal>
            <div>
              <p className="flex items-center gap-2 font-mono text-[10px] tracking-[.14em] text-muted-foreground">
                <i className="inline-block h-1.5 w-1.5 rounded-full bg-primary" style={{ boxShadow: "0 0 12px var(--primary)" }} /> SÅ FUNKAR DET
              </p>
              <h2 className="display-text mt-6 text-4xl md:text-5xl">Byggt för skapare, var du än filmar.</h2>
              <p className="body-text mt-5">Retain granskar din video mot samma retentionsmönster oavsett tidszon, nisch eller plattform.</p>
              <ol className="mt-10 border-t border-border">
                {workflowSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4 border-b border-border py-5">
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-primary">0{index + 1}</span>
                    <div>
                      <strong className="text-sm font-medium text-foreground">{step.title}</strong>
                      <p className="mt-1 text-xs text-muted-foreground">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-lg border border-border bg-card">
                <Beam />
                <Globe config={RETAIN_GLOBE_CONFIG} className="!inset-auto !size-full cursor-grab active:cursor-grabbing" />
                <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_center,transparent_60%,var(--card)_100%)]" />
              </div>
              <p className="mt-3 text-center font-mono text-[8px] tracking-[.08em] text-muted-foreground">DRA FÖR ATT ROTERA</p>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="relative z-10 overflow-hidden">
        <Particles className="absolute inset-0 -z-10" quantity={40} color="#d84a31" size={0.4} ease={70} />
        <div className="mx-auto max-w-2xl px-5 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="display-text text-4xl md:text-5xl">Sluta gissa vad som tappar tittarna.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="body-text mx-auto mt-5">Ladda upp ett utkast och få en tidsstämplad redigering på under en minut.</p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-9 flex justify-center">
              <Button variant="default" size="lg" className="h-12 px-6" onClick={onStart}>Analysera din video <ArrowRight /></Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function SegmentedField<T extends string>({ legend, options, value, onChange, labels }: { legend: string; options: readonly T[]; value: T; onChange: (value: T) => void; labels?: Record<T, string> }) {
  return (
    <fieldset className="mt-6 border-0 p-0">
      <legend className="mb-2 block font-mono text-[9px] tracking-[.08em] text-muted-foreground">{legend}</legend>
      <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-border">
        {options.map(option => (
          <button
            type="button"
            key={option}
            aria-pressed={value === option}
            className={`min-h-11 border-r border-border px-2 text-xs transition-colors last:border-r-0 ${value === option ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-secondary"}`}
            onClick={() => onChange(option)}
          >
            {labels ? labels[option] : option[0].toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function UploadForm({ demoMode, onHome, onDemo, file, duration, form, error, onFile, onRemove, onForm, onAnalyse }: {
  demoMode: boolean; onHome: () => void; onDemo: () => void; file: File | null; duration: number; form: FormState; error: string;
  onFile: (file: File) => void; onRemove: () => void; onForm: (form: FormState) => void; onAnalyse: () => void;
}) {
  return (
    <div className="page-enter min-h-screen bg-background text-foreground">
      <SiteHeader demoMode={demoMode} onHome={onHome} onDemo={onDemo} />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-8 md:px-10">
        <button className="border-0 bg-transparent p-0 font-mono text-[9px] tracking-[.08em] text-muted-foreground hover:text-foreground" onClick={onHome}>← TILLBAKA</button>
        <div className="border-b border-border py-10">
          <p className="font-mono text-[10px] tracking-[.1em] text-primary">NY REDIGERING / 001</p>
          <h1 className="display-text mt-4 text-4xl md:text-6xl">Ge oss råklippet.</h1>
          <p className="body-text mt-4">Lägg till tillräckligt med sammanhang för användbara kommentarer. Retain sköter genomgången bild för bild.</p>
        </div>

        {demoMode && (
          <aside className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-5 py-4">
            <div>
              <span className="font-mono text-[9px] tracking-[.08em] text-primary">DEMOLÄGE</span>
              <p className="mt-1 text-xs text-muted-foreground">Anslut en Gemini-nyckel för riktig analys, eller granska exempelredigeringen.</p>
            </div>
            <button className="shrink-0 border-0 border-b border-foreground bg-transparent pb-0.5 font-mono text-[10px] text-foreground" onClick={onDemo}>Öppna exempel ↗</button>
          </aside>
        )}

        <form onSubmit={event => { event.preventDefault(); onAnalyse(); }}>
          <section className="border-t border-border py-10">
            <div className="mb-6 flex items-baseline justify-between">
              <strong className="font-serif text-2xl font-medium">Lägg till ditt utkast</strong>
              <span className="font-mono text-[9px] text-muted-foreground">En vertikal video</span>
            </div>
            <MagicCard className="rounded-lg" gradientColor="#16161b" gradientFrom="#d84a31" gradientTo="#a43120" gradientOpacity={0.5}>
              <label
                className={`relative flex cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed border-transparent bg-card transition-colors hover:border-primary/60 ${file ? "h-28 flex-row justify-start gap-4 px-5" : "h-52 text-center"}`}
                onDragOver={event => event.preventDefault()}
                onDrop={event => { event.preventDefault(); const next = event.dataTransfer.files[0]; if (next) onFile(next); }}
              >
                <input type="file" accept="video/mp4,video/quicktime,video/webm" className="absolute inset-0 opacity-0" onChange={event => { const next = event.target.files?.[0]; if (next) onFile(next); }} />
                {file ? (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-foreground text-foreground"><FileVideo className="size-4" /></span>
                    <span className="flex flex-col gap-1">
                      <strong className="text-sm">{file.name}</strong>
                      <small className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB · {Math.round(duration)} SEK</small>
                    </span>
                    <button type="button" className="ml-auto border-0 bg-transparent p-2 text-muted-foreground hover:text-foreground" onClick={event => { event.preventDefault(); onRemove(); }} aria-label="Ta bort video"><X className="size-4" /></button>
                  </>
                ) : (
                  <>
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-foreground text-foreground"><Upload className="size-4" /></span>
                    <strong className="text-sm">Släpp den här</strong>
                    <span className="text-xs text-muted-foreground">eller välj en video</span>
                    <small className="mt-2 font-mono text-[8px] text-muted-foreground">MP4, MOV ELLER WEBM · 50 MB · 90 SEK</small>
                  </>
                )}
              </label>
            </MagicCard>
            <p className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground"><ShieldCheck className="size-3.5 shrink-0" />Din video bearbetas för den här redigeringen och raderas sedan. Den läggs aldrig i ett offentligt bibliotek.</p>
          </section>

          <section className="border-t border-border py-10">
            <div className="mb-6 flex items-baseline justify-between">
              <strong className="font-serif text-2xl font-medium">Ange sammanhang</strong>
              <span className="font-mono text-[9px] text-muted-foreground">Så att redigeringen passar din målgrupp</span>
            </div>
            <SegmentedField legend="Plattform" options={platformOptions} value={form.platform} onChange={platform => onForm({ ...form, platform })} />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[9px] tracking-[.08em] text-muted-foreground">Innehållsnisch</span>
                <input required value={form.niche} onChange={event => onForm({ ...form, niche: event.target.value })} placeholder="Privatekonomi" className="h-12 rounded-lg border border-border bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[9px] tracking-[.08em] text-muted-foreground">Målgrupp</span>
                <input required value={form.audience} onChange={event => onForm({ ...form, audience: event.target.value })} placeholder="Nybörjarinvesterare" className="h-12 rounded-lg border border-border bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50" />
              </label>
            </div>
            <SegmentedField legend="Huvudmål" options={goalOptions} value={form.goal} onChange={goal => onForm({ ...form, goal })} labels={copy.goals} />
          </section>

          {error && <div role="alert" className="my-4 flex gap-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4"><strong className="shrink-0 font-mono text-[9px] text-destructive">KONTROLLERA UTKASTET</strong><span className="text-xs text-foreground">{error}</span></div>}

          <div className="flex flex-col items-start gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
            <span className="max-w-xs text-[10px] text-muted-foreground">AI-feedback är vägledning. Resultatet varierar med innehåll och målgrupp.</span>
            <Button type="submit" variant="default" size="lg" className="h-12 w-full px-6 sm:w-auto" disabled={demoMode}>Analysera video <ArrowRight /></Button>
          </div>
        </form>
      </main>
    </div>
  );
}

function LoadingView({ stage }: { stage: number }) {
  return (
    <div className="page-enter min-h-screen bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border px-5 md:px-10">
        <Brand />
        <span className="hidden font-mono text-[10px] tracking-[.12em] text-muted-foreground sm:inline">REDIGERING PÅGÅR</span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">00:00:{String(stage + 1).padStart(2, "0")}</span>
      </header>
      <main className="mx-auto grid max-w-5xl gap-14 px-5 py-14 md:grid-cols-[.85fr_1.15fr] md:items-center md:py-24">
        <div className="relative h-64 overflow-hidden rounded-lg border border-border bg-card md:h-[60vh]">
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 8px, rgba(255,255,255,.03) 9px)" }} />
          <div className="absolute left-0 right-0 h-0.5 bg-primary" style={{ boxShadow: "0 0 16px var(--primary)", animation: "scan 2.2s linear infinite" }} />
          <span className="absolute left-3 top-3 font-mono text-[8px] text-foreground">ANALYSERAR BILD + LJUD</span>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[.1em] text-primary">OMGÅNG {stage + 1} / {stages.length}</p>
          <h1 className="display-text mt-4 text-4xl md:text-6xl">{stages[stage]}</h1>
          <p className="body-text mt-4">Retain läser videon själv. De flesta redigeringar tar ungefär en minut.</p>
          <ol className="mt-10 border-t border-border">
            {stages.map((label, index) => (
              <li key={label} className={`flex items-center gap-3.5 border-b border-border py-3 text-xs ${index < stage ? "text-[#65d89a]" : index === stage ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                <span className="w-6 font-mono text-[9px]">{index < stage ? <Check className="size-3" /> : `0${index + 1}`}</span>
                {label}
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}

export function RetainApp({ demoMode }: { demoMode: boolean }) {
  const [view, setView] = useState<View>("landing");
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [form, setForm] = useState<FormState>({ platform: "TikTok", niche: "", audience: "", goal: "views" });
  const [error, setError] = useState("");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<Analysis | null>(null);
  const tickerRef = useRef<number | null>(null);

  const goTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  const loadDemo = () => { setResult(sampleAnalysis); setView("report"); goTop(); };
  const reset = () => { setView("form"); setFile(null); setDuration(0); setError(""); setResult(null); setStage(0); goTop(); };

  function chooseFile(next: File) {
    setError("");
    const basic = validateVideo({ type: next.type, size: next.size });
    if (!basic.ok) { setFile(null); setError(basic.message); return; }
    const url = URL.createObjectURL(next);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.onloadedmetadata = () => { URL.revokeObjectURL(url); const checked = validateVideo({ type: next.type, size: next.size, duration: video.duration }); if (!checked.ok) { setFile(null); setError(checked.message); } else { setFile(next); setDuration(video.duration); } };
    video.onerror = () => { URL.revokeObjectURL(url); setError("Vi kunde inte läsa den här videon. Exportera den som MP4 och försök igen."); };
  }

  async function analyse() {
    if (!file) { setError("Välj en video innan du startar redigeringen."); return; }
    if (!form.niche.trim() || !form.audience.trim()) { setError("Ange din innehållsnisch och målgrupp."); return; }
    setError(""); setView("loading"); setStage(0);
    try {
      const session = await fetch("/api/upload-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: file.name, type: file.type, size: file.size }) });
      const sessionData = await session.json() as { uploadUrl: string; error?: { message: string } };
      if (!session.ok) throw new Error(sessionData.error?.message);
      setStage(1);
      const upload = await fetch(sessionData.uploadUrl, { method: "POST", headers: { "Content-Length": String(file.size), "X-Goog-Upload-Offset": "0", "X-Goog-Upload-Command": "upload, finalize" }, body: file });
      if (!upload.ok) throw new Error("Uppladdningen avbröts. Kontrollera din anslutning och försök igen.");
      const uploaded = await upload.json() as { file: { uri: string; name: string } };
      setStage(2);
      tickerRef.current = window.setInterval(() => setStage(current => Math.min(4, current + 1)), 3500);
      const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, fileUri: uploaded.file.uri, fileName: uploaded.file.name, mimeType: file.type }) });
      const data = await response.json() as { result: Analysis; error?: { message: string } };
      if (!response.ok) throw new Error(data.error?.message);
      setResult(data.result); setView("report"); goTop();
    } catch (cause) {
      setError(cause instanceof Error && cause.message ? cause.message : "Redigeringen misslyckades. Försök igen."); setView("form");
    } finally {
      if (tickerRef.current !== null) { window.clearInterval(tickerRef.current); tickerRef.current = null; }
    }
  }

  if (view === "report" && result) return <AnalysisReport result={result} onReset={reset} demo={result === sampleAnalysis} />;
  if (view === "loading") return <LoadingView stage={stage} />;
  if (view === "form") return <UploadForm demoMode={demoMode} onHome={() => setView("landing")} onDemo={loadDemo} file={file} duration={duration} form={form} error={error} onFile={chooseFile} onRemove={() => setFile(null)} onForm={setForm} onAnalyse={analyse} />;
  return <Landing onStart={() => setView("form")} onDemo={loadDemo} />;
}
