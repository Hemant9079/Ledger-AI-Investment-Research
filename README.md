# Ledger — AI Investment Research Agent

A multi-agent AI system that takes a company name and returns an **INVEST / PASS**
decision, backed by real research, financial data, and risk analysis — with full
reasoning, not a black box.

Built for the **InsideIIM × Altuni AI Labs** AI Engineer assignment.

🔗 **Live Demo:** [ledger-ai-investment-research.vercel.app](https://ledger-ai-investment-research.vercel.app)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Folder Structure](#3-folder-structure)
4. [The Complete Request Lifecycle](#4-the-complete-request-lifecycle)
5. [LangChain.js & LangGraph.js — What They're Doing Here](#5-langchainjs--langgraphjs--what-theyre-doing-here)
6. [Tech Stack](#6-tech-stack)
7. [Setup](#7-setup)
8. [DevOps Infrastructure](#8-devops-infrastructure)
9. [Key Decisions & Trade-offs](#9-key-decisions--trade-offs)
10. [Future Improvements](#10-future-improvements)

---

## 1. Project Overview

You type a company name — "Tesla", "Zomato", "Nvidia" — and four AI agents go to work:

1. **Research Agent** — who is this company, what do they do, what's in the news
2. **Financial Agent** — what does the market say: price, market cap, P/E, trend
3. **Risk Agent** — what could go wrong: competition, market, financial, regulatory
4. **Decision Agent** — weighs all three reports into one verdict with a confidence score

The agents are orchestrated as a **LangGraph.js** state machine, each one calling a
free external API for real data and an LLM (Groq, Gemini, or OpenAI — your choice) to
reason over it. The LLM layer supports **automatic fallback** across providers: if the
primary provider rate-limits or fails, the next configured provider takes over
transparently.

---

## 2. Architecture

```
┌─────────────┐      POST /api/analyze       ┌──────────────────────────────┐
│   Frontend   │ ────────────────────────────▶│         API Route             │
│  (Next.js)   │                               │   app/api/analyze/route.ts    │
└─────────────┘                               └──────────────┬───────────────┘
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
                                              Groq / Gemini / OpenAI  (via LangChain.js)
                                              with automatic provider fallback chain
```

Every agent follows the same three-step internal pattern:

**GATHER** (call a free API for real data) → **REASON** (hand it to the LLM with a
structured prompt) → **SHAPE** (parse the LLM's JSON into a typed object and merge
it into the shared graph state).

---

## 3. Folder Structure

```
app/                        Next.js App Router — pages & API routes
  page.tsx                   Home page (search bar)
  layout.tsx                 Shared shell, fonts, Tailwind base styles
  globals.css
  analyze/[company]/         Result Dashboard (dynamic route)
  login/                     Auth: login page
  signup/                    Auth: sign-up page
  history/                   Past analyses page
  favourites/                Saved/favourited companies page
  docs/                      In-app documentation page
  api/
    analyze/route.ts         Main endpoint — runs the full LangGraph workflow
    health/route.ts          Health-check endpoint (used by Nagios monitoring)
    stock-performance/       Supplemental endpoint for chart data

agents/                     The AI layer — LangGraph nodes + shared state
  state.ts                   TypeScript types for everything flowing through the graph
  researchAgent.ts            Node 1
  financialAgent.ts           Node 2
  riskAgent.ts                Node 3
  decisionAgent.ts            Node 4 (terminal)
  graph.ts                   Wires the four nodes into a StateGraph

components/                 Presentational React components (dumb, reusable)
  SearchBar.tsx
  LoadingState.tsx
  CompanyOverviewCard.tsx
  ResearchSummaryCard.tsx
  FinancialAnalysisCard.tsx
  FinancialStrengthGauge.tsx
  PriceRangeBar.tsx
  RiskAnalysisCard.tsx
  RiskBarChart.tsx
  DecisionCard.tsx
  ConfidenceGauge.tsx
  StockPerformanceGraph.tsx
  tabs/                      Tab-navigation sub-components

services/                   Pure I/O — talks to external APIs, no LLM calls here
  companyInfoService.ts      Wikipedia REST API
  newsService.ts             GNews.io (optional key) → Google News RSS (fallback)
  financialService.ts        Yahoo Finance via yahoo-finance2

lib/
  llm.ts                     LLM factory — priority-ordered provider selection
                             with automatic fallback chain (Groq → Gemini → OpenAI)

utils/
  promptTemplates.ts         All prompt text, centralized and versioned
  parseJSON.ts               Safe JSON extraction from LLM text output

devops/
  terraform/                 IaC — provisions two AWS EC2 instances + VPC/networking
  ansible/
    playbooks/               Six-step automation: base setup → deploy → monitoring → recovery
    templates/               Jinja2 templates for Nginx, PM2, Nagios configs
    inventory/               Dynamically generated hosts.ini (from Terraform output)
```

**Why this separation?** `services/` never touches the LLM, and `agents/` never
makes a raw `fetch()` call directly — each agent calls into `services/` for data.
This means you can unit-test a service without mocking an LLM, and unit-test an
agent's reasoning without mocking the network. It's the same separation of concerns
you'd defend in a system design interview: **I/O layer**, **reasoning layer**,
**orchestration layer**, **presentation layer**.

---

## 4. The Complete Request Lifecycle

```
1. User types "Tesla" on the Home Page and clicks Analyze
2. Frontend router pushes them to /analyze/Tesla
3. That page's useEffect fires: POST /api/analyze { companyName: "Tesla" }
4. The API route builds the initial AgentState and calls graph.invoke(state)
5. LangGraph runs the nodes in order:
      research  → calls Wikipedia + Google News, then the LLM to synthesize
      financial → calls Yahoo Finance, then the LLM to interpret the numbers
      risk      → reads research + financial from state, asks the LLM for risks
      decision  → reads all three summaries, asks the LLM for a final verdict
6. The final, fully-populated AgentState is returned as JSON
7. The dashboard renders it: overview, research summary, financials, risks,
   and the decision card with a confidence gauge
```

---

## 5. LangChain.js & LangGraph.js — What They're Doing Here

**LangChain.js** is used narrowly and deliberately: as a **vendor-agnostic LLM
client**. `lib/llm.ts` returns a `BaseChatModel` and every agent just calls
`.invoke([new HumanMessage(prompt)])` on it. No agent file knows or cares which
provider is behind that interface.

The factory also builds an **automatic fallback chain** using LangChain's
`.withFallbacks()`. If the primary provider returns an error or rate-limit response,
the next provider in the chain takes over — transparently and without retrying the
whole request from the top. This means the app stays up even during Groq or Gemini
outages as long as at least one provider key is configured.

**LangGraph.js** provides the **StateGraph** — a directed graph where:
- **Nodes** are functions: `(state) => Partial<state>`. Each agent file exports one.
- **Edges** define execution order: `START → research → financial → risk → decision → END`.
- **Channels** define how a node's partial return gets merged into the shared state.
  Most fields are "last write wins" (`(x, y) => y ?? x`); `errors` is special — it
  **accumulates** across nodes via `array.concat`, so one agent's problem doesn't
  erase another's.

For this assignment the graph is a straight line, which you could technically
replace with four `await` calls in a row. We use LangGraph anyway because it's the
architecture that **scales** — see [Future Improvements](#10-future-improvements)
for how a straight line becomes a graph with branches, retries, and loops without
restructuring the whole app.

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| AI Orchestration | LangGraph.js (`@langchain/langgraph`) |
| LLM Client | LangChain.js (`@langchain/core`, `langchain`) |
| LLM Providers | Groq (`@langchain/groq`), Google Gemini (`@langchain/google-genai`), OpenAI (`@langchain/openai`) |
| Financial Data | yahoo-finance2 |
| Animations | Framer Motion |
| Schema Validation | Zod |
| Styling | Tailwind CSS |
| Infrastructure | Terraform + Ansible (AWS EC2) |
| Monitoring | Nagios Core + NRPE |
| Production Hosting | Vercel |

---

## 7. Setup

### Prerequisites

- Node.js 18.17 or later
- At least one LLM API key:
  - **Groq** (default, recommended — free tier at [console.groq.com](https://console.groq.com))
  - **Google Gemini** (free tier at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
  - **OpenAI** (paid, `gpt-4o-mini` works fine)

### Install & Run

```bash
# 1. Clone / unzip the project, then install dependencies
npm install

# 2. Copy the env template and fill in your key(s)
cp .env.example .env

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:3000
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `LLM_PROVIDER` | No | `groq` | Primary LLM provider: `groq`, `gemini`, or `openai` |
| `GROQ_API_KEY` | If using Groq | — | Free tier at [console.groq.com](https://console.groq.com) |
| `GROQ_MODEL` | No | `llama-3.1-8b-instant` | Groq model to use |
| `GOOGLE_API_KEY` | If using Gemini | — | Free tier at Google AI Studio |
| `GEMINI_MODEL` | No | `gemini-2.0-flash` | Gemini model to use |
| `OPENAI_API_KEY` | If using OpenAI | — | Only needed when `LLM_PROVIDER=openai` |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | OpenAI model to use |
| `GNEWS_API_KEY` | No | — | Optional — improves news quality. Without it, falls back to Google News RSS (no key needed) |

> **Tip:** You can configure multiple API keys. The LLM factory will use your preferred
> provider as primary and automatically fall back to others if it hits errors or rate limits.

### External APIs Used (All Free)

| Purpose | API | Key Required? |
|---|---|---|
| Company background | Wikipedia REST API | No |
| Latest news | GNews.io → Google News RSS fallback | Optional |
| Financial data | Yahoo Finance (`yahoo-finance2`) | No |
| LLM reasoning | Groq / Google Gemini / OpenAI | Yes (at least one) |

---

## 8. DevOps Infrastructure

The `devops/` folder contains a complete infrastructure-as-code pipeline for
deploying and monitoring the application on AWS.

### Infrastructure Overview

```
AWS Cloud (ap-south-1 / Mumbai)
└── VPC (10.0.0.0/16)
    └── Public Subnet (10.0.1.0/24)
        ├── App Server (EC2 t3.medium)
        │     Node.js 20 + PM2 Cluster
        │     Nginx Reverse Proxy (Port 80)
        │     NRPE Monitoring Agent (Port 5666)
        └── Nagios Server (EC2 t3.micro)
              Nagios Core 4.5.1
              Apache2 + PHP Web UI (Port 80)
              check_nrpe Plugin
```

Production is also deployed on **Vercel** at
[ledger-ai-investment-research.vercel.app](https://ledger-ai-investment-research.vercel.app),
monitored by Nagios via SSL/HTTPS checks.

### Step-by-Step Deployment Runbook

#### Step 1 — Provision Infrastructure (Terraform)

```bash
cd devops/terraform
terraform init
terraform plan
terraform apply -auto-approve
```

Outputs: EC2 public IPs, SSH commands, and auto-generates `devops/ansible/inventory/hosts.ini`.

#### Step 2 — Base System Hardening (Ansible)

```bash
cd devops/ansible
ansible-playbook -i inventory/hosts.ini playbooks/01_base_setup.yml
```

#### Step 3 — Application Deployment (Ansible)

```bash
ansible-playbook -i inventory/hosts.ini playbooks/02_app_deployment.yml
```

Deploys Node.js 20, pulls code from GitHub, starts PM2 in cluster mode, configures Nginx reverse proxy.

#### Step 4 — Install & Configure Nagios Monitoring (Ansible)

```bash
ansible-playbook -i inventory/hosts.ini playbooks/03_nagios_server_install.yml
ansible-playbook -i inventory/hosts.ini playbooks/04_setup_monitoring_checks.yml
```

Access Nagios at: `http://<NAGIOS_PUBLIC_IP>/nagios` (User: `admin`, Password: `LedgerAI@2026`)

Monitored checks include: HTTP availability, PM2 process health, memory usage, and
Vercel SSL certificate validity.

#### Step 5 — Failure Simulation & Automated Recovery

```bash
# Simulate a failure (e.g. kill PM2)
ansible-playbook -i inventory/hosts.ini playbooks/05_simulate_failure.yml -e "scenario=pm2"

# Observe: Nagios turns CRITICAL (RED)

# Auto-heal
ansible-playbook -i inventory/hosts.ini playbooks/06_recovery_service.yml

# Confirm: Nagios returns to OK (GREEN)
```

---

## 9. Key Decisions & Trade-offs

- **Sequential graph, not parallel.** Financial and Risk analysis could run in
  parallel after Research. We kept it sequential so the workflow is trivially easy
  to trace and explain in a demo/interview. The trade-off is slightly higher
  latency (~15–25 s per full run instead of ~10–15 s). See Future Improvements.

- **Multi-provider LLM with automatic fallback.** Rather than hard-coding a single
  provider, `lib/llm.ts` reads `LLM_PROVIDER` and builds a fallback chain so the app
  stays functional if any one provider is unavailable. Groq is the default because
  its free tier is fastest for the small models used here.

- **JSON-in-prompt structured output, not function calling.** Every agent asks the
  LLM to "return ONLY valid JSON" and parses it with a defensive `safeParseJSON`
  helper, rather than using LangChain's tool/function-calling APIs. This is simpler
  to reason about for four sequential, single-purpose calls, and avoids
  provider-specific function-calling quirks between providers. The
  trade-off: occasionally an LLM wraps JSON in prose, which `safeParseJSON` handles
  by extracting the outermost `{...}` block and falling back to safe defaults if
  parsing still fails.

- **Yahoo Finance over a paid financial API.** No API key, no rate-limit signup
  friction, and it covers global exchanges — important since this assignment should
  work for both US and Indian companies. Trade-off: it's an unofficial wrapper around
  a public endpoint, so it's not suitable for production trading systems — clearly
  fine for a research/demo tool.

- **Google News RSS as a zero-key fallback.** The project works out of the box
  before a user even touches `.env` for news (only the LLM key is mandatory). This
  matters for an assignment that reviewers will clone and run themselves.

- **Client-rendered dashboard with a single `fetch`, not streaming.** LangGraph
  supports streaming intermediate node outputs, which would let the UI show live
  progress per agent. We kept the API route as one request/response for simplicity
  and reliability; the `LoadingState` component simulates progress narratively
  instead. This is the most natural extension point — see below.

---

## 10. Future Improvements

- **Stream the graph.** Use LangGraph's `.stream()` instead of `.invoke()`, and
  Server-Sent Events / a streaming Response, so the dashboard can light up each
  agent's card the moment it finishes instead of waiting for all four.

- **Parallel fan-out.** Run `financial` and `risk` concurrently after `research`
  using LangGraph's parallel-branch + fan-in support, cutting latency.
  (Note: `risk` currently depends on `financial`'s output, so this would need a
  small prompt restructure — e.g. run risk on research alone, financial in parallel,
  then let Decision reconcile.)
  ```
  START -> research -> [financial, risk in parallel] -> decision -> END
  ```

- **Confidence-triggered re-analysis loop.** If the Decision Agent's confidence
  score is below a threshold (say 40), loop back to the Risk Agent for a deeper
  pass instead of returning a low-confidence answer — a genuine graph *cycle*.
  ```
  risk -> decision -> (if confidence < 40) -> risk -> decision -> END
  ```

- **Persist past analyses** (e.g. Postgres / Supabase) so a user can revisit a
  company's history and compare decisions over time.

- **Add a real financial statements API** (e.g. SEC EDGAR for US filings) for
  revenue/earnings trend lines beyond what a stock quote alone can show.

- **Tool-calling agents.** Convert each agent from "one shaped prompt" into a
  LangChain agent with bound tools (news search, financial lookup) so the LLM
  itself decides which queries to run, rather than the service layer deciding
  upfront.

- **Authentication & user accounts.** The `login/` and `signup/` pages exist as
  UI stubs; wire them to a real auth provider (NextAuth.js / Supabase Auth) so
  each user gets their own history and favourites.
