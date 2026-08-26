"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { Heart, MessageCircle, Share2, UserPlus } from "lucide-react";
import { AnimatedList } from "../../components/ui/animated-list";
import { Particles } from "../../components/ui/particles";

type Notification = {
  platform: "TikTok" | "Instagram" | "YouTube";
  kind: "like" | "follow" | "share" | "dm";
  title: string;
  body: string;
  time: string;
};

const kindIcon = { like: Heart, follow: UserPlus, share: Share2, dm: MessageCircle };
const platformColor = { TikTok: "#25f4ee", Instagram: "#f7622e", YouTube: "#ff0033" };
const platformGradient = {
  TikTok: "linear-gradient(135deg, rgba(37,244,238,.16), rgba(254,44,85,.10))",
  Instagram: "linear-gradient(135deg, rgba(247,98,46,.18), rgba(225,48,108,.10))",
  YouTube: "linear-gradient(135deg, rgba(255,0,51,.18), rgba(255,0,51,.05))",
};

const notifications: Notification[] = [
  { platform: "TikTok", kind: "like", title: "+842 nya gilla-markeringar", body: "”Hooken var perfekt” börjar spridas", time: "nu" },
  { platform: "Instagram", kind: "follow", title: "+61 nya följare", body: "Efter att omklippet postades i morse", time: "2 min" },
  { platform: "YouTube", kind: "share", title: "Delad 214 gånger", body: "Tittarna skickar klippet vidare", time: "5 min" },
  { platform: "TikTok", kind: "dm", title: "Ny DM", body: "”Hur gjorde du den övergången?!”", time: "8 min" },
  { platform: "Instagram", kind: "like", title: "+1,3k gilla-markeringar", body: "Reels-versionen tar fart", time: "12 min" },
  { platform: "YouTube", kind: "follow", title: "+128 nya prenumeranter", body: "Retention höll hela vägen till avslutet", time: "19 min" },
  { platform: "TikTok", kind: "share", title: "På väg mot För dig-sidan", body: "Delningskvoten är dubbelt så hög som snittet", time: "24 min" },
  { platform: "Instagram", kind: "dm", title: "Ny DM", body: "”Skicka mallen du använde här”", time: "31 min" },
];

function NotificationCard({ item }: { item: Notification }) {
  const Icon = kindIcon[item.kind];
  const color = platformColor[item.platform];
  const ref = useRef<HTMLElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const springX = useSpring(rotateX, { stiffness: 260, damping: 20, mass: 0.5 });
  const springY = useSpring(rotateY, { stiffness: 260, damping: 20, mass: 0.5 });
  const glow = useMotionTemplate`radial-gradient(180px circle at ${glowX}% ${glowY}%, ${color}22, transparent 60%)`;

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 14);
    rotateX.set((py - 0.5) * -14);
    glowX.set(px * 100);
    glowY.set(py * 100);
  }
  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.figure
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ backgroundImage: platformGradient[item.platform], rotateX: springX, rotateY: springY, transformPerspective: 600 }}
      className="relative flex w-full max-w-md items-center gap-3.5 overflow-hidden rounded-xl border border-white/10 bg-card/80 p-4 shadow-[0_8px_24px_-12px_rgba(0,0,0,.6)] backdrop-blur-sm transition-[border-color] duration-200 hover:border-white/25"
    >
      <motion.i className="pointer-events-none absolute -inset-6" style={{ background: glow }} />
      <i className="absolute inset-y-0 left-0 w-[3px]" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
      <span
        className="grid size-10 shrink-0 place-items-center rounded-full ring-1"
        style={{ backgroundColor: `${color}22`, color, boxShadow: `0 0 16px ${color}33`, ["--tw-ring-color" as string]: `${color}55` }}
      >
        <Icon className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <strong className="truncate text-sm font-medium text-foreground">{item.title}</strong>
          <span className="shrink-0 font-mono text-[8px] text-white/45">{item.time}</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-white/60">{item.body}</p>
      </div>
      <span className="shrink-0 rounded-full px-2 py-1 font-mono text-[8px] font-semibold tracking-[.08em]" style={{ backgroundColor: `${color}1f`, color }}>
        {item.platform.toUpperCase()}
      </span>
    </motion.figure>
  );
}

export function SocialProof() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-10 overflow-hidden border-b border-border bg-[#0a0a0b]">
      <Particles className="absolute inset-0 -z-0" quantity={50} color="#d84a31" size={0.4} ease={70} />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-20 md:grid-cols-[.95fr_1.05fr] md:items-center md:py-28">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] tracking-[.14em] text-muted-foreground">
            <i className="inline-block h-1.5 w-1.5 rounded-full bg-primary" style={{ boxShadow: "0 0 12px var(--primary)" }} /> DET HÄR ÄR MÅLET
          </p>
          <h2 className="display-text mt-6 text-4xl md:text-5xl">Videor som folk faktiskt reagerar på.</h2>
          <p className="body-text mt-5">Retain är byggt för de tre plattformarna där sekunder avgör: TikTok, Instagram och YouTube. Fixa retentionen innan du postar, och det här är vad som väntar.</p>
        </div>
        <div ref={containerRef} className="relative flex h-[440px] w-full flex-col overflow-hidden rounded-xl border border-border bg-card/30 p-4 [mask-image:linear-gradient(to_bottom,transparent_0%,white_8%,white_88%,transparent_100%)]">
          <AnimatedList delay={850} active={inView}>
            {notifications.map((item, index) => (
              <NotificationCard key={index} item={item} />
            ))}
          </AnimatedList>
        </div>
      </div>
    </section>
  );
}
