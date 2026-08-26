import type { Metadata } from "next";
import { Inter, Geist_Mono, Newsreader } from "next/font/google";
import { copy } from "../lib/copy";
import { AuthProvider } from "../lib/auth-context";
import "./globals.css";

const geist = Inter({subsets:["latin"],variable:"--geist-sans"});const mono=Geist_Mono({variable:"--geist-mono",subsets:["latin"]});const serif=Newsreader({variable:"--newsreader-serif",subsets:["latin"],style:["normal","italic"]});
const siteUrl=process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000";
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:copy.meta.title,description:copy.meta.description,icons:{icon:"/favicon.svg"},openGraph:{title:copy.meta.ogTitle,description:copy.meta.ogDescription,images:["/og.png"]},twitter:{card:"summary_large_image",images:["/og.png"]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="sv" className={`dark ${geist.variable} ${mono.variable} ${serif.variable}`}><body><AuthProvider>{children}</AuthProvider></body></html>}
