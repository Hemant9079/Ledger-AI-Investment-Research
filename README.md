# Ledger — AI Investment Research Agent's

A multi-agent AI system that takes a company name and returns an **INVEST / PASS**
decision, backed by real research, financial data, and risk analysis — with full
reasoning, not a black box.

Built for the **InsideIIM × Altuni AI Labs** AI Engineer assignment.

---

## 1. Project Overview

You type a company name — "Tesla", "Zomato", "Nvidia" — and four AI agents go to work:

1. **Research Agent** — who is this company, what do they do, what's in the news
2. **Financial Agent** — what does the market say: price, market cap, P/E, trend
3. **Risk Agent** — what could go wrong: competition, market, financial, regulatory
4. **Decision Agent** — weighs all three reports into one verdict with a confidence score

The agents are orchestrated as a **LangGraph.js** state machine, each one calling a
free external API for real data and an LLM (Gemini or OpenAI, your choice) to reason
over it.

---

## 2. Architecture

```
┌─────────────┐      POST /api/analyze       ┌──────────────────────────────┐
│   Frontend   │ ────────────────────────────▶│         API Route             │
│  (Next.js)   │                               │   app/api/analyze/route.ts    │
└─────────────┘                               └──────────────┬─────────────────┘
                                                               │
                                                               ▼
                                              ┌────────────────────────────────┐
                                              │     LangGraph Workflow          │
                                              │      (agents/graph.ts)          │
                                              │                                  │
                                              │  START                          │
                                              │    │                            │
                                              │    ▼                            │
                                              │  ┌─────────────────┐            │
                                              │  │ Research Agent  │──▶ Wikipedia│
                                              │  └────────┬────────┘──▶ Google News RSS
                                              │           ▼                     │
                                              │  ┌─────────────────┐            │
                                              │  │ Financial Agent │──▶ Yahoo Finance
                                              │  └────────┬────────┘            │
                                              │           ▼                     │
                                              │  ┌─────────────────┐            │
                                              │  │  Risk Agent     │            │
                                              │  └────────┬────────┘            │
                                              │           ▼                     │
                                              │  ┌─────────────────┐            │
                                              │  │ Decision Agent  │            │
                                              │  └────────┬────────┘            │
                                              │           ▼                     │
                                              │          END                    │
                                              └────────────────────────────────┘
                                                               │
                                                               ▼
                                                   Gemini / OpenAI (via LangChain.js)
```

Every agent follows the same three-step internal pattern:

**GATHER** (call a free API for real data) → **REASON** (hand it to the LLM with a
structured prompt) → **SHAPE** (parse the LLM's JSON into a typed object and merge
it into the shared graph state).

### Folder structure

```
app/                      Next.js App Router — pages & API routes
  page.tsx                 Home page (search)
  analyze/[company]/       Result Dashboard (dynamic route)
  api/analyze/route.ts     The one backend endpoint — runs the LangGraph workflow
  layout.tsx, globals.css  Shared shell, fonts, Tailwind base styles

components/                Presentational React components (dumb, reusable)
  SearchBar, LoadingState, CompanyOverviewCard, ResearchSummaryCard,
  FinancialAnalysisCard, RiskAnalysisCard, DecisionCard, ConfidenceGauge

agents/                    The AI layer — LangGraph nodes + shared state
  state.ts                 TypeScript types for everything flowing through the graph
  researchAgent.ts          Node 1
  financialAgent.ts         Node 2
  riskAgent.ts               Node 3
  decisionAgent.ts           Node 4 (terminal)
  graph.ts                  Wires the four nodes into a StateGraph

services/                  Pure I/O — talk to external free APIs, no LLM calls here
  companyInfoService.ts     Wikipedia REST API
  newsService.ts             GNews (optional key) → Google News RSS (fallback)
  financialService.ts       Yahoo Finance via yahoo-finance2

lib/
  llm.ts                    LLM factory — swaps between Gemini and OpenAI

utils/
  promptTemplates.ts        All prompt text, centralized and versioned
  parseJSON.ts               Safe JSON extraction from LLM text output
```

**Why this separation?** `services/` never touches the LLM, and `agents/` never
makes a raw `fetch()` call directly — each agent calls into `services/` for data.
This means you can unit-test a service without mocking an LLM, and unit-test an
agent's reasoning without mocking the network. It's the same separation of concerns
you'd defend in a system design interview: **I/O layer**, **reasoning layer**,
**orchestration layer**, **presentation layer**.

---

## 3. The Complete Request Lifecycle

```
1. User types "Tesla" on the Home Page and clicks Analyze
2. Frontend router pushes them to /analyze/Tesla
3. That page's useEffect fires: POST /api/analyze { companyName: "Tesla" }
4. The API route builds the initial AgentState and calls graph.invoke(state)
5. LangGraph runs the nodes in order:
      research  → calls Wikipedia + Google News, then Gemini/OpenAI to synthesize
      financial → calls Yahoo Finance, then the LLM to interpret the numbers
      risk      → reads research + financial from state, asks the LLM for risks
      decision  → reads all three summaries, asks the LLM for a final verdict
6. The final, fully-populated AgentState is returned as JSON
7. The dashboard renders it: overview, research summary, financials, risks,
   and the decision card with a confidence gauge
```

---

## 4. LangChain.js & LangGraph.js — what they're doing here

**LangChain.js** is used narrowly and deliberately: as a **vendor-agnostic LLM
client**. `lib/llm.ts` returns a `BaseChatModel` — either `ChatGoogleGenerativeAI`
or `ChatOpenAI` — and every agent just calls `.invoke([new HumanMessage(prompt)])`
on it. No agent file knows or cares which provider is behind that interface. This
is the practical value of LangChain in a small project: swap `LLM_PROVIDER` in
`.env` and every agent's brain changes with zero code edits.

**LangGraph.js** provides the **StateGraph** — a directed graph where:
- **Nodes** are functions: `(state) => Partial<state>`. Each agent file exports one.
- **Edges** define execution order: `START → research → financial → risk → decision → END`.
- **Channels** define how a node's partial return gets merged into the shared state.
  Most fields are "last write wins" (`(x, y) => y ?? x`); `errors` is special — it
  **accumulates** across nodes via `array.concat`, so one agent's problem doesn't
  erase another's.

For this assignment the graph is a straight line, which you could technically
replace with four `await` calls in a row. We use LangGraph anyway because it's the
architecture that **scales** — see [Future Improvements](#7-future-improvements)
for how a straight line becomes a graph with branches, retries, and loops without
restructuring the whole app.

---

## 5. Setup

### Prerequisites
- Node.js 18.17 or later
- A free Google Gemini API key ([aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
  — or an OpenAI API key if you'd rather use `gpt-4o-mini`

### Install & run

```bash
# 1. Clone / unzip the project, then install dependencies
npm install

# 2. Copy the env template and fill in your key(s)
cp .env.example .env

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:3000
```

### Environment variables

| Variable          | Required | Description                                                      |
|--------------------|----------|--------------------------------------------------------------------|
| `LLM_PROVIDER`     | No       | `gemini` (default) or `openai`                                    |
| `GOOGLE_API_KEY`   | If using Gemini | Free tier at Google AI Studio                                |
| `OPENAI_API_KEY`   | If using OpenAI | Only needed when `LLM_PROVIDER=openai`                        |
| `GNEWS_API_KEY`    | No       | Optional — improves news quality. Without it, the app falls back to Google News RSS (no key needed at all) |

### External APIs used (all free)

| Purpose            | API                        | Key required? |
|---------------------|------------------------------|----------------|
| Company background  | Wikipedia REST API           | No             |
| Latest news          | GNews.io → Google News RSS  | Optional       |
| Financial data       | Yahoo Finance (`yahoo-finance2`) | No         |
| LLM reasoning         | Google Gemini / OpenAI      | Yes (one of them) |

---

## 6. Key Decisions & Trade-offs

- **Sequential graph, not parallel.** Financial and Risk analysis could run in
  parallel after Research. We kept it sequential so the workflow is trivially easy
  to trace and explain in a demo/interview. The trade-off is slightly higher
  latency (~15-25s per full run instead of ~10-15s). See Future Improvements.

- **JSON-in-prompt structured output, not function calling.** Every agent asks the
  LLM to "return ONLY valid JSON" and parses it with a defensive `safeParseJSON`
  helper, rather than using LangChain's tool/function-calling APIs. This is simpler
  to reason about for four sequential, single-purpose calls, and avoids
  provider-specific function-calling quirks between Gemini and OpenAI. The
  trade-off: occasionally an LLM wraps JSON in prose, which `safeParseJSON` handles
  by extracting the outermost `{...}` block and falling back to safe defaults if
  parsing still fails.

- **Yahoo Finance over a paid financial API (e.g. Alpha Vantage).** No API key, no
  rate-limit signup friction, and it covers global exchanges — important since this
  assignment should work for both US and Indian companies. Trade-off: it's an
  unofficial wrapper around a public endpoint, so it's not meant for production
  trading systems — clearly fine for a research/demo tool.

- **Google News RSS as a zero-key fallback.** The project works out of the box
  before a user even touches `.env` for news (only the LLM key is mandatory). This
  matters for an assignment that reviewers will clone and run themselves.

- **Client-rendered dashboard with a single `fetch`, not streaming.** LangGraph
  supports streaming intermediate node outputs, which would let the UI show live
  progress per agent. We kept the API route as one request/response for simplicity
  and reliability under a grading environment; the `LoadingState` component
  simulates progress narratively instead. This is the most natural extension point
  — see below.

---

## 7. Future Improvements

- **Stream the graph.** Use LangGraph's `.stream()` instead of `.invoke()`, and
  Server-Sent Events / a streaming Response, so the dashboard can light up each
  agent's card the moment it finishes instead of waiting for all four.
- **Parallel fan-out.** Run `financial` and `risk` concurrently after `research`
  using LangGraph's parallel-branch + fan-in support, cutting latency.
  (Note: `risk` currently depends on `financial`'s output, so this would need a
  small prompt restructure — e.g. run risk on research alone, financial in
  parallel, then let Decision reconcile.)
  ```
  START -> research -> [financial, risk in parallel] -> decision -> END
  ```
- **Confidence-triggered re-analysis loop.** If the Decision Agent's confidence
  score is below a threshold (say 40), loop back to the Risk Agent for a deeper
  pass instead of returning a low-confidence answer — a genuine graph *cycle*.
  ```
  risk -> decision -> (if confidence < 40) -> risk -> decision -> END
  ```
- **Persist past analyses** (e.g. Postgres/Supabase) so a user can revisit a
  company's history and compare decisions over time.
- **Add a real financial statements API** (e.g. SEC EDGAR for US filings) for
  revenue/earnings trend lines beyond what a stock quote alone can show.
- **Tool-calling agents.** Convert each agent from "one shaped prompt" into a
  LangChain agent with bound tools (news search, financial lookup) so the LLM
  itself decides which queries to run, rather than the service layer deciding
  upfront.

---

## 8. Example Output (abridged)

**Input:** `Tesla`

```json
{
  "companyName": "Tesla",
  "research": {
    "industry": "Automotive / Clean Energy",
    "marketPosition": "Global leader in battery-electric vehicles...",
    "researchSummary": "Tesla designs and manufactures electric vehicles..."
  },
  "financial": {
    "tickerSymbol": "TSLA",
    "financialStrengthScore": 72,
    "financialSummary": "Tesla maintains a strong balance sheet..."
  },
  "risk": {
    "overallRiskLevel": "Medium",
    "competitiveRisks": ["Intensifying EV competition from BYD and legacy automakers..."]
  },
  "decision": {
    "decision": "INVEST",
    "confidenceScore": 68,
    "reasons": ["Strong brand and market leadership in EVs", "..."]
  }
}
```

---

## 9. Deployment (Vercel)

```bash
# 1. Push this project to a new GitHub repository
git init
git add .
git commit -m "Initial commit: AI Investment Research Agent"
git branch -M main
git remote add origin https://github.com/<your-username>/ai-investment-research-agent.git
git push -u origin main

# 2. Go to vercel.com -> New Project -> Import your GitHub repo
# 3. Add the same environment variables from .env in the Vercel dashboard
#    (Project Settings -> Environment Variables)
# 4. Deploy — Vercel auto-detects Next.js, no config needed
```

Notes for deployment:
- `app/api/analyze/route.ts` sets `export const runtime = "nodejs"` because
  `yahoo-finance2` and LangChain need full Node APIs (not the Edge runtime).
- `maxDuration = 60` gives the multi-agent workflow enough time; on Vercel's Hobby
  plan max duration is capped at 60s for serverless functions, which comfortably
  fits four sequential LLM calls with `gemini-1.5-flash` or `gpt-4o-mini`.

---

## 10. Interview Talking Points (cheat sheet)

- **"Walk me through the request lifecycle"** → use the diagram in Section 3.
- **"Why LangGraph instead of just calling functions?"** → explicit state machine,
  self-documenting data flow, and the architecture already supports branches/loops
  (Section 4 + 7) without a rewrite.
- **"Why both Gemini and OpenAI?"** → demonstrates LangChain's `BaseChatModel`
  abstraction — the Strategy pattern — swapping the "brain" with one env var.
- **"How do you handle a bad/unparseable LLM response?"** → `safeParseJSON` with
  typed fallbacks per agent, plus an `errors[]` channel in the graph state that
  accumulates non-fatal issues instead of crashing the whole run.
- **"What would you change for production?"** → streaming responses, parallel
  branches, persistence, and moving from prompt-based JSON to LangChain tool
  calling — all covered in Section 7.
