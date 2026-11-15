"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setIsLoading(true);
    // Simulate a brief async login
    setTimeout(() => {
      const displayName = name.trim() || email.split("@")[0];
      auth.login(displayName, email);
      auth.resetGuestCount();
      router.push("/");
    }, 600);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-grid-pattern {
            background-image: 
                linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 24px 24px;
        }
        .glow-effect {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);
        }
        .glow-focus:focus {
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
            border-color: #22c55e;
        }
      `}} />
      <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-body-md text-body-md antialiased dark">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-grid-pattern pointer-events-none"></div>
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 30%, rgba(34, 197, 94, 0.15), transparent 60%)" }}></div>
        
        {/* Main Content */}
        <div className="relative z-10 w-full max-w-md px-margin-mobile md:px-margin-desktop flex flex-col items-center">
          
          {/* Branding */}
          <header className="w-full flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              <span className="font-label-md text-label-md font-bold tracking-[0.2em] text-primary">LEDGER INTELLIGENCE</span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-center text-on-surface">Enter the<br/><span className="text-primary">Intelligence Hub</span></h1>
          </header>
          
          {/* Login Form Card */}
          <div className="w-full bg-surface-container/80 backdrop-blur-xl border border-white/5 rounded-xl p-8 glow-effect">
            {error && (
              <div className="mb-4 rounded-lg border border-pass/30 bg-pass/10 px-4 py-3 font-mono text-xs text-pass">
                {error}
              </div>
            )}
            <form className="flex flex-col gap-6" onSubmit={handleLogin}>
              {/* Name Input (optional) */}
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider" htmlFor="name">
                  NAME <span className="normal-case tracking-normal opacity-50">(optional)</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">person</span>
                  <input
                    className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none glow-focus transition-all duration-300 font-label-md"
                    id="name"
                    placeholder="Your name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider" htmlFor="email">SECURE IDENTIFIER</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
                  <input
                    className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none glow-focus transition-all duration-300 font-label-md"
                    id="email"
                    placeholder="analyst@domain.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider" htmlFor="password">ACCESS KEY</label>
                  <a className="font-label-sm text-label-sm text-primary hover:text-primary-fixed transition-colors" href="#">Recover?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                  <input
                    className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none glow-focus transition-all duration-300 font-label-md"
                    id="password"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Submit */}
              <button
                className="w-full bg-primary-container text-on-primary-container font-headline-md text-body-lg font-bold py-3 px-6 rounded-lg hover:bg-primary-fixed transition-colors duration-300 flex items-center justify-center gap-2 mt-4 shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-60"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating…
                  </>
                ) : (
                  <>
                    Authenticate
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
            
            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">OR SSO</span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>
            
            {/* Social Login (decorative) */}
            <div className="flex gap-4 justify-center">
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-primary transition-all duration-300 text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">api</span>
              </button>
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-primary transition-all duration-300 text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">terminal</span>
              </button>
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-primary transition-all duration-300 text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
            Initiate new session? <Link className="text-primary hover:underline font-bold" href="/signup">Request Access</Link>
          </div>
        </div>
      </div>
    </>
  );
}
