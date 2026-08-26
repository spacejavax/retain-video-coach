"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  sendMagicLink: (email: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function sendMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined } });
    return { error: error?.message ?? null };
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: typeof window !== "undefined" ? window.location.origin : undefined } });
    return { error: error?.message ?? null };
  }

  async function signOut() { await supabase.auth.signOut(); }

  return <AuthContext.Provider value={{ user: session?.user ?? null, session, loading, sendMagicLink, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
