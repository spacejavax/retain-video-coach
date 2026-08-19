import type { Analysis } from "./schema";

export const sampleAnalysis: Analysis = {
  overallScore: 72, scoreLabel: "Strong",
  summary: "Idén är användbar och framförandet känns trovärdigt, men inledningen tar för lång tid på sig att avslöja poängen. Om du strular till de första fem sekunderna och lägger till visuella växlingar förbättras retentionspotentialen.",
  strongestElement: "Tydliga, praktiska råd som framförs med en tillgänglig ton.",
  biggestProblem: "Tittaren får vänta åtta sekunder innan de förstår vad de kommer att lära sig.",
  scores: { hook: 58, pacing: 67, clarity: 84, visualEngagement: 62, audioDelivery: 78, payoff: 76, audienceFit: 81 },
  hookAnalysis: {
    currentHook: "Så idag ville jag dela några saker som hjälpte mig göra bättre videor.",
    assessment: "Vänligt, men brett och långsamt. Det namnger inte problemet eller lovar ett konkret resultat tillräckligt snabbt.",
    improvedHooks: ["Dina första tre sekunder får tittarna att scrolla vidare — fixa de här två sakerna.", "Om dina videor känns bra men ändå tappar folk tidigt, kolla in det här.", "Jag ändrade en enda rad i min hook och gjorde hela videon lättare att titta på."],
  },
  timelineIssues: [
    { startTime: "0:00", endTime: "0:08", severity: "high", category: "Hook", issue: "Upplägget skjuter upp huvudlöftet.", whyItMatters: "Nya tittare har ingen anledning att vänta på poängen.", exactFix: "Öppna med tittarens problem, ange sedan de två lösningarna i en enda mening." },
    { startTime: "0:19", endTime: "0:25", severity: "medium", category: "Tempo", issue: "En upprepad förklaring bromsar farten.", whyItMatters: "Den andra versionen tillför ingen ny information.", exactFix: "Behåll den tydligare andra meningen och ta bort den första." },
    { startTime: "0:37", endTime: "0:43", severity: "low", category: "Visuellt", issue: "Bilden förblir statisk när en ny idé introduceras.", whyItMatters: "En visuell växling kan signalera framsteg och återfå uppmärksamheten.", exactFix: "Lägg till en subtil inzoomning och en text-overlay på tre ord." },
  ],
  recommendedCuts: [{ startTime: "0:03", endTime: "0:07", reason: "Tar bort harklandet innan löftet." }, { startTime: "0:19", endTime: "0:22", reason: "Tar bort en upprepad inledningsmening." }],
  textOverlaySuggestions: [{ timestamp: "0:00", text: "SLUTA TAPPA TITTARE", purpose: "Gör problemet tydligt utan ljud." }, { timestamp: "0:26", text: "2. BYT BILD", purpose: "Markerar övergången till det andra tipset." }],
  strengths: ["Rådet är specifikt nog för att agera på.", "Röstframförandet är varmt och lätt att förstå.", "Slutexemplet ger videon en tillfredsställande avslutning."],
  priorityActions: ["Ersätt den åtta sekunder långa introduktionen med en rak problem-och-löfte-hook.", "Klipp bort den upprepade förklaringen vid 0:19 och flytta exemplet tidigare.", "Lägg till en visuell eller textbaserad växling varje gång videon går vidare till ett nytt tips."],
  revisedScript: "Dina första tre sekunder får tittarna att scrolla vidare — fixa de här två sakerna. Först: säg exakt vad de kommer att få ut av videon innan du förklarar varför. Sedan: byt bild när du byter idé. Här är skillnaden: istället för att säga 'idag vill jag prata om hooks', säg 'det här ena hook-misstaget kostar dig tittare'. Samma budskap, mycket större anledning att stanna kvar. Testa båda ändringarna i ditt nästa inlägg och jämför hur inledningen känns.",
  disclaimer: "Den här poängen bedömer kreativa egenskaper och retentionsegenskaper. Det är AI-genererad vägledning och kan inte garantera resultat, visningar eller engagemang.",
};
