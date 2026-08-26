import type { Metadata } from "next";

export const metadata: Metadata = { title: "Integritetspolicy — Retain", description: "Hur Retain hanterar din video och dina uppgifter." };

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Vem är personuppgiftsansvarig",
    body: (
      <>
        <p>Retain är personuppgiftsansvarig (&quot;data controller&quot; enligt EU:s dataskyddsförordning, GDPR) för de personuppgifter som beskrivs på den här sidan. Kontakta oss enligt avsnittet &quot;Kontakt&quot; nedan för alla frågor om dataskydd.</p>
      </>
    ),
  },
  {
    title: "Vad vi samlar in",
    body: (
      <>
        <p>Beroende på hur du använder Retain samlar vi in:</p>
        <ul>
          <li>Videofilen du laddar upp för analys (MP4, MOV eller WebM, max 50 MB och 90 sekunder).</li>
          <li>Sammanhanget du anger: plattform, innehållsnisch, målgrupp och huvudmål.</li>
          <li>Om du skapar ett konto med e-post: din e-postadress, använd enbart för att skicka en inloggningslänk och identifiera dina sparade rapporter.</li>
          <li>Om du loggar in med Google: din e-postadress, ditt namn och din profilbild, enligt vad Google delar vid inloggning.</li>
          <li>Om du väljer att spara en analys: rapportens innehåll (poäng, feedback och det omskrivna manuset) samt sammanhanget du angav för den videon.</li>
          <li>Teknisk information som krävs för att skydda tjänsten mot missbruk, till exempel din IP-adress (används endast för att räkna analyser per timme, se &quot;Lagring och radering&quot; nedan).</li>
        </ul>
        <p>Vi ber aldrig om lösenord eller betalningsuppgifter. Inloggning är valfri — Retain fungerar utan konto, men sparade rapporter kräver ett konto.</p>
      </>
    ),
  },
  {
    title: "Rättslig grund för behandlingen",
    body: (
      <>
        <p>Vi behandlar dina uppgifter baserat på ditt samtycke (när du laddar upp en video för analys eller väljer att skapa ett konto och spara en rapport) och på vårt berättigade intresse av att skydda tjänsten mot missbruk (IP-baserad hastighetsbegränsning).</p>
      </>
    ),
  },
  {
    title: "Hur videon hanteras",
    body: (
      <>
        <p>Din video laddas upp direkt till Googles Gemini Files API via en tillfällig, säker uppladdningssession — den passerar aldrig genom och lagras aldrig på Retains egna servrar.</p>
        <p>Google Gemini analyserar videon och returnerar strukturerad feedback (hook, tempo, tydlighet, avslut och retentionspotential). Så snart analysen är klar — oavsett om den lyckas eller misslyckas — raderar vi filen från Google igen. Retain behåller inget videobibliotek; det som eventuellt sparas är textrapporten, aldrig videofilen.</p>
      </>
    ),
  },
  {
    title: "Tredjepartsbehandling",
    body: (
      <>
        <p><strong>Google Gemini:</strong> Analysen utförs av Googles Gemini-modeller via Google GenAI API. Din video och det sammanhang du anger skickas till Google för att generera feedbacken. Googles egen hantering av dessa uppgifter styrs av Googles integritetspolicy och användarvillkor för Gemini API.</p>
        <p><strong>Supabase:</strong> Om du skapar ett konto hanteras inloggning och lagring av sparade rapporter av Supabase, vars databas för Retain finns inom EU. Supabase agerar personuppgiftsbiträde (&quot;data processor&quot;) åt Retain.</p>
        <p><strong>Google-inloggning:</strong> Väljer du att logga in med ditt Google-konto delar Google din e-postadress och grundläggande profilinformation (namn, profilbild) med Retain via Supabase, för att skapa och identifiera ditt konto. Vi begär ingen ytterligare åtkomst till ditt Google-konto. Googles egen hantering styrs av Googles integritetspolicy.</p>
      </>
    ),
  },
  {
    title: "Lagring och radering",
    body: (
      <>
        <p>Analyserar du en video utan att logga in existerar resultatet bara i din webbläsare under sessionen — laddar du om sidan eller stänger fliken försvinner det, om du inte själv har kopierat eller sparat det.</p>
        <p>Väljer du att logga in och spara en rapport lagras den i vår databas tills du själv raderar den eller tar bort ditt konto. Du kan radera enskilda sparade rapporter direkt under &quot;Sparade rapporter&quot;, och radera hela ditt konto (vilket omedelbart och permanent tar bort kontot och alla sparade rapporter) via kontoinställningarna i tjänsten. Har du problem med detta, kontakta oss enligt nedan.</p>
        <p>IP-adresser som används för att begränsa antalet analyser (max fem per timme) hålls tillfälligt i serverns minne och försvinner automatiskt efter en timme eller vid omstart av servern. De skrivs aldrig till disk.</p>
      </>
    ),
  },
  {
    title: "Cookies och analys",
    body: <p>Retain sätter ingen spårningscookie och använder ingen tredjepartsanalys. Om du loggar in lagrar din webbläsare en inloggningssession lokalt (via localStorage) för att hålla dig inloggad — den delas aldrig med tredje part utöver Supabase, som redan hanterar din session. Om det här ändras uppdaterar vi denna sida innan något nytt aktiveras.</p>,
  },
  {
    title: "Demoläge",
    body: <p>När ingen Gemini API-nyckel är konfigurerad körs Retain i demoläge. Då skickas ingen video eller information till Google — du ser enbart ett tydligt märkt exempelresultat.</p>,
  },
  {
    title: "Dina rättigheter enligt GDPR",
    body: (
      <>
        <p>Du har rätt att:</p>
        <ul>
          <li>Få tillgång till de personuppgifter vi har om dig (rätt till registerutdrag).</li>
          <li>Få felaktiga uppgifter rättade.</li>
          <li>Begära radering av dina uppgifter, till exempel ditt konto och sparade rapporter.</li>
          <li>Begära att behandlingen begränsas, eller invända mot den.</li>
          <li>Få ut dina sparade rapporter i ett strukturerat, maskinläsbart format (dataportabilitet).</li>
          <li>Återkalla ditt samtycke när som helst, utan att det påverkar behandling som redan skett.</li>
          <li>Lämna in ett klagomål till en tillsynsmyndighet — i Sverige Integritetsskyddsmyndigheten (IMY), imy.se.</li>
        </ul>
        <p>Kontakta oss enligt nedan för att utöva någon av dessa rättigheter.</p>
      </>
    ),
  },
  {
    title: "Kontakt",
    body: <p>Frågor om denna policy eller om hur Retain hanterar dina uppgifter: <a href="mailto:pongi.team@gmail.com" className="underline">pongi.team@gmail.com</a>.</p>,
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
        <p className="mt-2 font-mono text-[10px] tracking-[.08em] text-muted-foreground">SENAST UPPDATERAD: 2026-08-23</p>

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
