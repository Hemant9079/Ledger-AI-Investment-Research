"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "overview",       label: "Overview"           },
  { id: "how-it-works",  label: "How it works"       },
  { id: "agents",        label: "The 4 Agents"        },
  { id: "tabs",          label: "Result Tabs"         },
  { id: "auth",          label: "Authentication"      },
  { id: "tech",          label: "Tech Stack"          },
  { id: "faq",           label: "FAQ"                 },
];

export default function DocsPage() {
  const [active, setActive] = useState("overview");

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="ai-glow absolute left-1/2 -top-32 h-[500px] w-[600px] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.18) 0%, transparent 70%)" }}
        />
      </div>

      <nav className="nav-bar sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "linear-gradient(135deg, #059669, #10B981)", boxShadow: "0 0 20px rgba(16,185,129,0.5)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#030712" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(3,7,18,0.3)" />
                <path d="M8 5V11M5 8H11" stroke="#030712" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-mono text-sm font-bold tracking-widest text-white">
              LEDGER<span style={{ color: "#10B981" }}>.</span>AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest" style={{ color: "#10B981" }}>/ docs</span>
            <Link href="/" className="font-mono text-xs tracking-wider text-gray-400 transition-colors hover:text-white">
              ← Back to home
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto flex max-w-7xl gap-10 px-6 py-12">

        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(16,185,129,0.6)" }}>
              On this page
            </p>
            <nav className="flex flex-col gap-1">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActive(s.id)}
                  className="rounded-lg px-3 py-2 font-mono text-xs tracking-wide transition-all duration-200"
                  style={{
                    color: active === s.id ? "#10B981" : "rgba(156,163,175,0.7)",
                    background: active === s.id ? "rgba(16,185,129,0.08)" : "transparent",
                    borderLeft: active === s.id ? "2px solid #10B981" : "2px solid transparent",
                  }}
                >
                  {s.label}
                </a>
              ))}
            </nav>

            <div className="mt-8">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(156,163,175,0.4)" }}>
                Quick Links
              </p>
              <a
                href="https://github.com/Hemant9079/Ledger-AI-Investment-Research"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-xs tracking-wide text-gray-500 transition-colors hover:text-white"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub Repo
              </a>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-xs tracking-wide text-gray-500 transition-colors hover:text-white"
              >
                → Sign In
              </Link>
            </div>
          </div>
        </aside>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-w-0 flex-1"
        >
          <Section id="overview">
            <Eyebrow>Introduction</Eyebrow>
            <H1>Ledger.AI — Documentation</H1>
            <Lead>
              Ledger.AI is a multi-agent AI system that researches any publicly listed company and gives you a
              clear <strong style={{ color: "#10B981" }}>INVEST</strong> or <strong style={{ color: "#EF4444" }}>PASS</strong> verdict,
              backed by real data. It&apos;s built for people who want a quick but thorough read on a stock without spending hours
              digging through financial reports and news feeds.
            </Lead>

            <InfoBox>
              Just type a company name or stock ticker — the system does the rest in under 60 seconds.
            </InfoBox>

            <P>
              The idea is simple. Most retail investors don&apos;t have time to read earnings call transcripts,
              parse SEC filings, track competitor moves, and assess regulatory risk — all at once. Ledger.AI runs
              four specialized AI agents in parallel, each focused on a specific part of the research, and then
              combines everything into a single decision-grade report.
            </P>
            <P>
              It works for both US stocks (like <Code>AAPL</Code>, <Code>NVDA</Code>, <Code>TSLA</Code>) and
              Indian stocks on NSE/BSE (like <Code>RELIANCE.NS</Code>, <Code>TCS.NS</Code>, <Code>HDFCBANK.NS</Code>).
              Just enter the name as you know it — the agents figure out the ticker automatically.
            </P>
          </Section>

          <Divider />

          <Section id="how-it-works">
            <Eyebrow>Under the hood</Eyebrow>
            <H2>How it works</H2>
            <P>
              When you search for a company, the system kicks off a LangGraph workflow — basically a graph of
              AI agents that hand off results to each other in sequence. Each agent does one focused job, gets
              real data, reasons over it using an LLM, and produces a structured output. The final state
              from all four agents gets merged into the report you see.
            </P>

            <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StepCard num="1" title="You type a company name">
                The search bar accepts company names, tickers, or even partial names. The agents resolve the rest.
              </StepCard>
              <StepCard num="2" title="Four agents run in sequence">
                Research → Financial → Risk → Decision. Each reads the output of the previous agent and adds its own layer.
              </StepCard>
              <StepCard num="3" title="Real data, not hallucinations">
                Financial data comes from Yahoo Finance. News is pulled from live sources. The LLM reasons over facts, not fiction.
              </StepCard>
              <StepCard num="4" title="You get a complete report">
                Five tabs cover every angle — research summary, financials, risk heatmap, final verdict, and a full consolidated view.
              </StepCard>
            </div>
          </Section>

          <Divider />

          <Section id="agents">
            <Eyebrow>Core system</Eyebrow>
            <H2>The 4 Agents</H2>
            <P>
              Each agent is a separate LangChain/LangGraph node. They run in order, and each one has access
              to the previous agent&apos;s output — so the risk agent knows what the research agent found, and the
              decision agent has the full picture before making a call.
            </P>

            <div className="my-6 flex flex-col gap-4">
              <AgentDoc
                num="01"
                name="Research Agent"
                color="#10B981"
                what="Gathers the baseline intelligence on the company."
                how="Pulls the company profile, business model, recent news headlines, market position summary, industry classification, headquarters, founding year, and employee count. Uses the LLM to write a concise research narrative."
                output="Company name, legal summary, industry, HQ, founded year, employee count, business model, market position, up to 10 recent news items, and an AI-written research summary."
              />
              <AgentDoc
                num="02"
                name="Financial Agent"
                color="#34D399"
                what="Fetches and analyzes real market data."
                how="Looks up the stock ticker via Yahoo Finance. Pulls live price, market cap, P/E ratio, 52-week high/low, enterprise value, sector, country, full-time employees, and a business description. Scores financial health on a 0–100 scale and writes a financial summary."
                output="Ticker symbol, isPublic flag, currency, live price, market cap, P/E ratio, 52-week range, revenue trend, financial summary, financial strength score (0–100), and sector/country metadata."
              />
              <AgentDoc
                num="03"
                name="Risk Agent"
                color="#F59E0B"
                what="Identifies and categorizes risks across four dimensions."
                how="Reads the research and financial context, then uses the LLM to identify competitive risks, market risks, financial risks, and regulatory/other risks. Each category gets its own bullet list. The agent also assigns an overall risk level and writes a risk summary paragraph."
                output="Four risk arrays (competitive, market, financial, regulatory), an overall risk level (Low / Medium / High), and a risk summary."
              />
              <AgentDoc
                num="04"
                name="Decision Agent"
                color="#A78BFA"
                what="Makes the final INVEST or PASS call."
                how="Reads everything from the first three agents and synthesizes it into a single verdict. Produces a confidence score (0–100), a list of key reasons, growth opportunities, notable risks, and a short verdict summary paragraph."
                output="Decision (INVEST or PASS), confidence score, reasons, opportunities, risks, and a verdict summary."
              />
            </div>
          </Section>

          <Divider />

          <Section id="tabs">
            <Eyebrow>Result pages</Eyebrow>
            <H2>The 5 Result Tabs</H2>
            <P>
              After analysis completes, results are shown across five tabs. You can switch between them freely — all the data is already loaded, so tab switching is instant.
            </P>

            <div className="my-6 flex flex-col gap-3">
              <TabDoc icon="[R]" name="Research" desc="Company overview, AI research summary, recent news headlines, market position narrative, stock performance chart, and the INVEST/PASS verdict in the sidebar. This is the best starting tab to get a feel for the company." />
              <TabDoc icon="[F]" name="Financials" desc="Live price, 52-week range bar, AI health check gauge, financial snapshot metrics (market cap, P/E, enterprise value, strength score), revenue trend, balance sheet data, and the full AI financial summary with a fair value commentary." />
              <TabDoc icon="[!]" name="Risk" desc="Risk heatmap showing severity across Market, Regulatory, Financial, and Competitive dimensions. Regulatory alert feed with severity tags (CRITICAL / MODERATE / NEGLIGIBLE). Overall risk score ring with a breakdown of risk counts by category." />
              <TabDoc icon="✅" name="Decision" desc="The final verdict — STRATEGIC BUY or PASS — shown as a bold headline. Includes the agent consensus matrix (what each agent concluded), macro rationale, risk mitigation points, and a large confidence score ring. You can also export or simulate an order from here." />
              <TabDoc icon="📋" name="Summary" desc="A single scrollable view that combines all four agent outputs into one consolidated report. This is the same layout as the original analyze page — useful if you want to print or share the full research in one shot." />
            </div>
          </Section>

          <Divider />

          <Section id="auth">
            <Eyebrow>Accounts</Eyebrow>
            <H2>Authentication</H2>
            <P>
              Ledger.AI has a full authentication system with two dedicated pages — Login and Sign Up.
              You can sign in using any of the supported social providers or with a classic email and password.
            </P>

            <div className="my-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { provider: "Google",    note: "One-click via Google OAuth 2.0" },
                { provider: "GitHub",    note: "Great for developers already signed into GitHub" },
                { provider: "X / Twitter", note: "Quick login with your Twitter/X account" },
                { provider: "Microsoft", note: "Works with personal or work Microsoft accounts" },
                { provider: "Email + Password", note: "Classic signup with password strength meter and confirm field" },
              ].map(({ provider, note }) => (
                <div
                  key={provider}
                  className="flex flex-col gap-1 rounded-xl p-4"
                  style={{ background: "rgba(10,20,14,0.6)", border: "1px solid rgba(16,185,129,0.1)" }}
                >
                  <span className="text-sm font-semibold text-white">{provider}</span>
                  <span className="text-xs" style={{ color: "rgba(156,163,175,0.7)" }}>{note}</span>
                </div>
              ))}
            </div>

            <P>
              The Sign Up page also includes a live password strength meter that rates your password as Weak, Fair,
              Strong, or Very Strong as you type. You&apos;ll need to agree to the terms before your account is created.
              After signing up, you land on a success screen and get redirected to the dashboard.
            </P>
          </Section>

          <Divider />

          <Section id="tech">
            <Eyebrow>Built with</Eyebrow>
            <H2>Tech Stack</H2>
            <P>
              Everything in Ledger.AI is open source and self-hostable. Here&apos;s what&apos;s under the hood:
            </P>

            <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Next.js 14",      role: "App framework — handles routing, API routes, and SSR"              },
                { name: "LangGraph.js",    role: "Orchestrates the multi-agent workflow as a directed graph"          },
                { name: "LangChain.js",    role: "Chains and agents — connects LLMs to tools and structured outputs"  },
                { name: "Google Gemini",   role: "Primary LLM for all four agents (via @langchain/google-genai)"      },
                { name: "Yahoo Finance 2", role: "Live stock data — prices, fundamentals, market cap, P/E, 52W range" },
                { name: "Framer Motion",   role: "Page transitions, tab animations, hover effects"                    },
                { name: "TypeScript",      role: "Full type safety across agents, state, API routes, and components"  },
                { name: "Tailwind CSS",    role: "Utility-first styling — dark green terminal aesthetic"              },
                { name: "Zod",             role: "Schema validation for all agent outputs"                           },
              ].map(({ name, role }) => (
                <div
                  key={name}
                  className="rounded-xl p-4"
                  style={{ background: "rgba(10,20,14,0.6)", border: "1px solid rgba(16,185,129,0.1)" }}
                >
                  <div className="mb-1 font-mono text-sm font-bold" style={{ color: "#10B981" }}>{name}</div>
                  <div className="text-xs leading-5" style={{ color: "rgba(156,163,175,0.7)" }}>{role}</div>
                </div>
              ))}
            </div>

            <P>
              The agent graph is built with LangGraph&apos;s <Code>StateGraph</Code> API. Each node is a TypeScript async
              function that takes the current <Code>AgentState</Code>, runs its logic, and returns a partial state update.
              The graph handles sequencing, error isolation, and state merging automatically.
            </P>
          </Section>

          <Divider />

          <Section id="faq">
            <Eyebrow>Common questions</Eyebrow>
            <H2>FAQ</H2>

            <div className="my-5 flex flex-col gap-3">
              <FAQ q="Which markets does it support?">
                US markets (NYSE, NASDAQ) and Indian markets (NSE via Yahoo Finance tickers like <Code>RELIANCE.NS</Code>).
                Any ticker that Yahoo Finance supports should work.
              </FAQ>
              <FAQ q="How long does an analysis take?">
                Usually between 30 and 60 seconds. The bottleneck is the LLM reasoning over research and financial context —
                not the data fetching, which is fast.
              </FAQ>
              <FAQ q="Is the financial data real-time?">
                Yes. Prices, market cap, and fundamentals come from Yahoo Finance and reflect live or latest-close data.
                The AI summaries are generated fresh on each run — nothing is cached.
              </FAQ>
              <FAQ q="What if the company isn't publicly traded?">
                The Financial Agent will still run, but it will mark <Code>isPublic: false</Code> and skip the stock data.
                The research and risk agents work fine for private companies — you just won&apos;t get live price data or the stock chart.
              </FAQ>
              <FAQ q="Can I trust the INVEST/PASS verdict?">
                Use it as a starting point, not as financial advice. The system reasons over real data and gives you a structured
                perspective — but it doesn&apos;t know your personal risk tolerance, time horizon, or portfolio composition.
                Always do your own due diligence before investing.
              </FAQ>
              <FAQ q="Is the code open source?">
                Yes —{" "}
                <a
                  href="https://github.com/Hemant9079/Ledger-AI-Investment-Research"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:underline"
                  style={{ color: "#10B981" }}
                >
                  github.com/Hemant9079/Ledger-AI-Investment-Research
                </a>
                . Feel free to fork it, self-host it, or contribute.
              </FAQ>
              <FAQ q="How do I run it locally?">
                Clone the repo, copy <Code>.env.example</Code> to <Code>.env</Code>, add your API keys
                (Google Gemini or Groq, and optionally OpenAI), then run <Code>npm install && npm run dev</Code>.
                The app starts on <Code>localhost:3000</Code>.
              </FAQ>
            </div>
          </Section>

          <div
            className="mt-16 rounded-2xl p-6 text-center"
            style={{ background: "rgba(10,20,14,0.5)", border: "1px solid rgba(16,185,129,0.1)" }}
          >
            <p className="font-mono text-sm" style={{ color: "rgba(156,163,175,0.6)" }}>
              Built by{" "}
              <a
                href="https://github.com/Hemant9079"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:underline"
                style={{ color: "#10B981" }}
              >
                Hemant Kumar
              </a>
              {" "}· Open source ·{" "}
              <a
                href="https://github.com/Hemant9079/Ledger-AI-Investment-Research"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:underline"
                style={{ color: "#10B981" }}
              >
                View on GitHub
              </a>
            </p>
          </div>
        </motion.article>
      </div>
    </main>
  );
}


function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 pb-2">
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 font-mono text-[11px] uppercase tracking-widest" style={{ color: "rgba(16,185,129,0.7)" }}>
      {children}
    </div>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
      {children}
    </h1>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-2xl font-bold tracking-tight text-white">
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 text-lg leading-8" style={{ color: "rgba(209,213,219,0.9)" }}>
      {children}
    </p>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-sm leading-7" style={{ color: "rgba(209,213,219,0.8)" }}>
      {children}
    </p>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="rounded px-1.5 py-0.5 font-mono text-xs"
      style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}
    >
      {children}
    </code>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="my-5 flex items-start gap-3 rounded-xl p-4"
      style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}
    >
      <span style={{ color: "#10B981" }}>[Tip]</span>
      <p className="text-sm leading-6" style={{ color: "rgba(209,213,219,0.85)" }}>
        {children}
      </p>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="my-10 h-px"
      style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.15), transparent)" }}
    />
  );
}

function StepCard({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "rgba(10,20,14,0.6)", border: "1px solid rgba(16,185,129,0.1)" }}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold"
          style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}
        >
          {num}
        </span>
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>
      <p className="text-xs leading-5" style={{ color: "rgba(156,163,175,0.75)" }}>
        {children}
      </p>
    </div>
  );
}

function AgentDoc({ num, name, color, what, how, output }: {
  num: string; name: string; color: string; what: string; how: string; output: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "rgba(10,20,14,0.6)", border: `1px solid ${color}20` }}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className="rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold"
          style={{ background: `${color}12`, border: `1px solid ${color}30`, color }}
        >
          {num}
        </span>
        <span className="font-semibold text-white">{name}</span>
      </div>
      <div className="flex flex-col gap-2 text-xs leading-5">
        <div>
          <span className="font-mono uppercase tracking-wider" style={{ color: `${color}90` }}>What it does — </span>
          <span style={{ color: "rgba(209,213,219,0.8)" }}>{what}</span>
        </div>
        <div>
          <span className="font-mono uppercase tracking-wider" style={{ color: `${color}90` }}>How — </span>
          <span style={{ color: "rgba(209,213,219,0.8)" }}>{how}</span>
        </div>
        <div>
          <span className="font-mono uppercase tracking-wider" style={{ color: `${color}90` }}>Output — </span>
          <span style={{ color: "rgba(156,163,175,0.75)" }}>{output}</span>
        </div>
      </div>
    </div>
  );
}

function TabDoc({ icon, name, desc }: { icon: string; name: string; desc: string }) {
  return (
    <div
      className="flex gap-4 rounded-xl p-4"
      style={{ background: "rgba(10,20,14,0.5)", border: "1px solid rgba(16,185,129,0.08)" }}
    >
      <span className="text-xl">{icon}</span>
      <div>
        <span className="text-sm font-semibold text-white">{name}</span>
        <p className="mt-1 text-xs leading-5" style={{ color: "rgba(156,163,175,0.75)" }}>{desc}</p>
      </div>
    </div>
  );
}

function FAQ({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "rgba(10,20,14,0.5)", border: "1px solid rgba(16,185,129,0.08)" }}
    >
      <p className="mb-2 text-sm font-semibold text-white">{q}</p>
      <p className="text-xs leading-5" style={{ color: "rgba(156,163,175,0.75)" }}>{children}</p>
    </div>
  );
}
