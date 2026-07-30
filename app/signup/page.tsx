"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"social" | "email">("social");
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  const handleSocialSignup = (provider: string) => {
    setIsLoading(provider);
    setTimeout(() => {
      setIsLoading(null);
      setStep("success");
    }, 2000);
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsLoading("email");
    setTimeout(() => {
      setIsLoading(null);
      setStep("success");
    }, 2000);
  };

  const passwordStrength = (() => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthColors = ["#EF4444", "#F59E0B", "#10B981", "#10B981"];
  const strengthLabels = ["Weak", "Fair", "Strong", "Very Strong"];

  const socialProviders = [
    {
      id: "google",
      name: "Google",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      ),
      bg: "rgba(66,133,244,0.06)",
      border: "rgba(66,133,244,0.2)",
      hoverBorder: "rgba(66,133,244,0.5)",
    },
    {
      id: "github",
      name: "GitHub",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      bg: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.1)",
      hoverBorder: "rgba(255,255,255,0.3)",
    },
    {
      id: "twitter",
      name: "X / Twitter",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      bg: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.1)",
      hoverBorder: "rgba(255,255,255,0.3)",
    },
    {
      id: "microsoft",
      name: "Microsoft",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
          <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
          <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
          <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
        </svg>
      ),
      bg: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.1)",
      hoverBorder: "rgba(255,255,255,0.3)",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-20">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute left-1/2 -top-32 h-[600px] w-[700px] -translate-x-1/2 rounded-full ai-glow"
          style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.22) 0%, transparent 70%)" }}
        />
        <div
          className="ai-glow absolute -left-20 top-1/2 h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)", animationDelay: "1.5s" }}
        />
        <div
          className="ai-glow absolute -right-16 bottom-32 h-64 w-64 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)", animationDelay: "3s" }}
        />
      </div>

      <nav className="nav-bar fixed top-0 left-0 right-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "linear-gradient(135deg, #059669, #10B981)", boxShadow: "0 0 20px rgba(16,185,129,0.5)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#030712" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(3,7,18,0.3)"/>
                <path d="M8 5V11M5 8H11" stroke="#030712" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-mono text-sm font-bold tracking-widest text-white">
              LEDGER<span style={{ color: "#10B981" }}>.</span>AI
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-wider" style={{ color: "rgba(156,163,175,0.7)" }}>Have an account?</span>
            <Link
              href="/login"
              className="rounded-full px-4 py-1.5 font-mono text-xs tracking-wider transition-all duration-200"
              style={{ border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)", color: "#10B981" }}
            >
              Sign In →
            </Link>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {step === "form" ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="card scan-sheen relative overflow-hidden p-8">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.9), transparent)" }}
              />

              <div className="mb-8 text-center">
                <div
                  className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "#10B981", boxShadow: "0 0 8px rgba(16,185,129,0.8)" }}
                  />
                  Join for free
                </div>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">Create your account</h1>
                <p className="mt-2 text-sm" style={{ color: "rgba(156,163,175,0.7)" }}>
                  Start your AI-powered investment research journey
                </p>
              </div>

              <div
                className="mb-6 flex rounded-xl p-1"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16,185,129,0.1)" }}
              >
                {(["social", "email"] as const).map((tab) => (
                  <button
                    key={tab}
                    id={`signup-tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className="relative flex-1 rounded-lg py-2.5 font-mono text-xs tracking-wider transition-all duration-300"
                    style={{
                      color: activeTab === tab ? "#030712" : "rgba(156,163,175,0.7)",
                      background: activeTab === tab ? "linear-gradient(135deg,#059669,#10B981)" : "transparent",
                      boxShadow: activeTab === tab ? "0 0 20px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" : "none",
                      fontWeight: activeTab === tab ? 700 : 500,
                    }}
                  >
                    {tab === "social" ? "Social Sign Up" : "Email & Password"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "social" ? (
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-3"
                  >
                    {socialProviders.map((p) => (
                      <SocialButton
                        key={p.id}
                        provider={p}
                        isLoading={isLoading === p.id}
                        onClick={() => handleSocialSignup(p.id)}
                        action="Sign up"
                      />
                    ))}
                    <p className="pt-1 text-center font-mono text-[10px]" style={{ color: "rgba(156,163,175,0.4)" }}>
                      By signing up you agree to our Terms & Privacy Policy
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="email"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.22 }}
                    onSubmit={handleEmailSignup}
                    className="space-y-4"
                  >
                    <div>
                      <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest" style={{ color: "rgba(156,163,175,0.7)" }}>
                        Full name
                      </label>
                      <input
                        id="signup-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        required
                        className="auth-input w-full"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest" style={{ color: "rgba(156,163,175,0.7)" }}>
                        Email address
                      </label>
                      <input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="auth-input w-full"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest" style={{ color: "rgba(156,163,175,0.7)" }}>
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 8 characters"
                          required
                          className="auth-input w-full pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: "rgba(156,163,175,0.5)" }}
                        >
                          {showPassword ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          )}
                        </button>
                      </div>
                      {password.length > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                style={{
                                  background: i <= passwordStrength ? strengthColors[passwordStrength - 1] : "rgba(255,255,255,0.08)",
                                }}
                              />
                            ))}
                          </div>
                          <p className="mt-1 font-mono text-[10px]" style={{ color: passwordStrength > 0 ? strengthColors[passwordStrength - 1] : "rgba(156,163,175,0.5)" }}>
                            {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : ""}
                          </p>
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest" style={{ color: "rgba(156,163,175,0.7)" }}>
                        Confirm password
                      </label>
                      <input
                        id="signup-confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="auth-input w-full"
                        style={{
                          borderColor: confirmPassword && password !== confirmPassword
                            ? "rgba(239,68,68,0.4)"
                            : confirmPassword && password === confirmPassword
                            ? "rgba(16,185,129,0.4)"
                            : undefined,
                        }}
                      />
                      {confirmPassword && password !== confirmPassword && (
                        <p className="mt-1 font-mono text-[10px]" style={{ color: "#EF4444" }}>Passwords don&apos;t match</p>
                      )}
                    </div>

                    <label className="flex cursor-pointer items-start gap-3">
                      <div
                        onClick={() => setAgreed(!agreed)}
                        className="mt-0.5 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center rounded transition-all duration-200"
                        style={{
                          background: agreed ? "linear-gradient(135deg,#059669,#10B981)" : "rgba(255,255,255,0.05)",
                          border: agreed ? "1px solid #10B981" : "1px solid rgba(255,255,255,0.12)",
                          boxShadow: agreed ? "0 0 10px rgba(16,185,129,0.3)" : "none",
                        }}
                      >
                        {agreed && (
                          <svg className="h-2.5 w-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="font-mono text-[11px]" style={{ color: "rgba(156,163,175,0.6)" }}>
                        I agree to the{" "}
                        <span style={{ color: "#10B981" }}>Terms of Service</span> and{" "}
                        <span style={{ color: "#10B981" }}>Privacy Policy</span>
                      </span>
                    </label>

                    <button
                      id="signup-submit"
                      type="submit"
                      disabled={!!isLoading || !agreed || (!!confirmPassword && password !== confirmPassword)}
                      className="btn-neon mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold tracking-wider disabled:opacity-60"
                    >
                      {isLoading === "email" ? (
                        <><LoadingSpinner /> Creating account…</>
                      ) : (
                        <>Create Account <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1" style={{ background: "rgba(16,185,129,0.08)" }} />
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(156,163,175,0.4)" }}>or</span>
                <div className="h-px flex-1" style={{ background: "rgba(16,185,129,0.08)" }} />
              </div>

              <p className="text-center font-mono text-xs" style={{ color: "rgba(156,163,175,0.6)" }}>
                Already have an account?{" "}
                <Link href="/login" className="font-semibold transition-colors" style={{ color: "#10B981" }}>
                  Sign in →
                </Link>
              </p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest"
              style={{ color: "rgba(156,163,175,0.3)" }}
            >
              Secure: 256-bit TLS · OAuth 2.0 · SOC 2 Compliant
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="card relative overflow-hidden p-10 text-center">
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.9), transparent)" }} />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.08))",
                  border: "2px solid rgba(16,185,129,0.4)",
                  boxShadow: "0 0 40px rgba(16,185,129,0.3), inset 0 1px 0 rgba(16,185,129,0.2)",
                }}
              >
                <svg className="h-10 w-10" style={{ color: "#10B981" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <div
                  className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}
                >
                  Account Created
                </div>
                <h2 className="mt-3 text-2xl font-bold text-white">You&apos;re in!</h2>
                <p className="mt-3 text-sm" style={{ color: "rgba(156,163,175,0.7)" }}>
                  Your Ledger.AI account is ready. Start researching your first stock now.
                </p>

                <Link
                  href="/"
                  className="btn-neon mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold tracking-wider"
                >
                  Go to Dashboard
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function SocialButton({
  provider,
  isLoading,
  onClick,
  action = "Continue",
}: {
  provider: { id: string; name: string; icon: React.ReactNode; bg: string; border: string; hoverBorder: string };
  isLoading: boolean;
  onClick: () => void;
  action?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.98 }}
      id={`signup-${provider.id}`}
      onClick={onClick}
      disabled={isLoading}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-white transition-all duration-200 disabled:opacity-60"
      style={{ background: provider.bg, border: `1px solid ${provider.border}`, backdropFilter: "blur(8px)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = provider.hoverBorder; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = provider.border; }}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        {isLoading ? <LoadingSpinner /> : provider.icon}
      </span>
      <span>{action} with {provider.name}</span>
      {!isLoading && (
        <svg className="ml-auto h-4 w-4" style={{ color: "rgba(156,163,175,0.4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </motion.button>
  );
}

function LoadingSpinner() {
  return (
    <svg className="h-4 w-4 animate-spin" style={{ color: "#10B981" }} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
