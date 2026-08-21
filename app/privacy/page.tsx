import type { Metadata } from "next";

export const metadata: Metadata = { title: "Integritetspolicy — Retain", description: "Hur Retain hanterar din video och dina uppgifter." };

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Vad vi samlar in",
    body: (
      <>
        <p>När du analyserar en video samlar vi in:</p>
        <ul>
          <li>Videofilen du laddar upp (MP4, MOV eller WebM, max 50 MB och 90 sekunder).</li>
          <li>Sammanhanget du anger: plattform, innehållsnisch, målgrupp och huvudmål.</li>
          <li>Teknisk information som krävs för att skydda tjänsten mot missbruk, till exempel din IP-adress (används endast för att räkna analyser per timme, se &quot;Lagring&quot; nedan).</li>
        </ul>
        <p>Vi ber aldrig om konto, lösenord eller betalningsuppgifter — Retain kräver ingen inloggning.</p>
      </>
    ),
  },
  {
    title: "Hur videon hanteras",
    body: (
      <>
        <p>Din video laddas upp direkt till Googles Gemini Files API via en tillfällig, säker uppladdningssession — den passerar aldrig genom och lagras aldrig på Retains egna servrar eller i någon databas.</p>
        <p>Google Gemini analyserar videon och returnerar strukturerad feedback (hook, tempo, tydlighet, avslut och retentionspotential). Så snart analysen är klar — oavsett om den lyckas eller misslyckas — raderar vi filen från Google igen. Retain behåller inget videobibliotek.</p>
      </>
    ),
  },
  {
    title: "Tredjepartsbehandling: Google Gemini",
    body: (
      <>
        <p>Analysen utförs av Googles Gemini-modeller via Google GenAI API. Din video och det sammanhang du anger skickas till Google för att generera feedbacken. Googles egen hantering av dessa uppgifter styrs av Googles integritetspolicy och användarvillkor för Gemini API.</p>
      </>
    ),
  },
  {
    title: "Lagring och radering",
    body: (
      <>
        <p>Retain använder ingen databas för videor, rapporter eller kontouppgifter. Ett analysresultat existerar bara i din webbläsare under sessionen — laddar du om sidan eller stänger fliken försvinner det, om du inte själv har kopierat eller sparat det.</p>
        <p>IP-adresser som används för att begränsa antalet analyser (max fem per timme) hålls tillfälligt i serverns minne och försvinner automatiskt efter en timme eller vid omstart av servern. De skrivs aldrig till disk.</p>
      </>
    ),
  },
  {
    title: "Cookies och analys",
    body: <p>Retain använder i dagsläget inga cookies, inget spårningsskript och ingen tredjepartsanalys. Om det ändras uppdaterar vi denna sida innan något nytt aktiveras.</p>,
  },
  {
    title: "Demoläge",
    body: <p>När ingen Gemini API-nyckel är konfigurerad körs Retain i demoläge. Då skickas ingen video eller information till Google — du ser enbart ett tydligt märkt exempelresultat.</p>,
  },
  {
    title: "Dina rättigheter",
    body: (
      <>
        <p>Eftersom Retain inte lagrar din video eller ditt resultat efter analysen finns det normalt inget kvar att begära utdrag av eller radering av. Har du frågor om en specifik analys eller om hur dina uppgifter behandlats, kontakta oss enligt nedan.</p>
      </>
    ),
  },
  {
    title: "Kontakt",
    body: <p>Frågor om denna policy eller om hur Retain hanterar dina uppgifter: [kontakt-e-post ej ännu ifylld].</p>,
  },
  {
    title: "Ändringar",
    body: <p>Vi kan uppdatera denna policy när tjänsten förändras. Väsentliga ändringar anges med nytt datum nedan.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
          <a href="/" className="font-mono text-[10px] tracking-[.08em] text-muted-foreground hover:text-foreground">← TILL STARTSIDAN</a>
          <span className="font-mono text-[10px] tracking-[.08em] text-muted-foreground">RETAIN</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <p className="font-mono text-[10px] tracking-[.14em] text-primary">INTEGRITETSPOLICY</p>
        <h1 className="display-text mt-4 text-4xl md:text-5xl">Hur vi hanterar din video och dina uppgifter.</h1>
        <p className="body-text mt-5">Retain är byggt för att lagra så lite som möjligt. Den här sidan förklarar exakt vad som händer med det du laddar upp — utan juridisk dimridå.</p>
        <p className="mt-2 font-mono text-[10px] tracking-[.08em] text-muted-foreground">SENAST UPPDATERAD: 2026-08-20</p>

        <div className="mt-12 space-y-10 border-t border-border pt-10">
          {sections.map(section => (
            <section key={section.title}>
              <h2 className="font-serif text-xl font-medium">{section.title}</h2>
              <div className="body-text mt-3 space-y-3 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">{section.body}</div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
