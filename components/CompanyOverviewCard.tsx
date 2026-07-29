import type { FinancialOutput, ResearchOutput } from "@/agents/state";

interface Props {
  research: ResearchOutput;
  financial?: FinancialOutput | null;
}

export default function CompanyOverviewCard({ research, financial }: Props) {
  const industry = financial?.industry || research.industry || "N/A";
  const country = financial?.country || "N/A";
  const sector = financial?.sector || industry || "N/A";
  const employees = research.employeeCount ?? financial?.fullTimeEmployees ?? null;
  const marketCap = financial?.marketCap;
  const totalCap = financial?.totalCapitalization;
  const currency = financial?.currency;

  return (
    <section className="card p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="label-eyebrow">Company Overview</span>
        {financial?.isPublic && (
          <span className="w-fit rounded-full px-3 py-1 font-mono text-xs" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}>
            {financial.tickerSymbol ?? "Public"}
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatField label="Industry" value={industry} icon="IN" accent />
        <StatField label="Sector" value={sector} icon="SE" />
        <StatField label="Headquarters" value={research.headquarters} icon="HQ" />
        <StatField label="Country" value={country} icon="CO" />
        <StatField label="Founded" value={research.foundedYear ?? "N/A"} icon="YR" />
        <StatField label="Employees" value={formatEmployees(employees)} icon="EM" />
      </div>

      {financial?.isPublic && (
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <StatField
            label="Market Cap"
            value={formatLargeNumber(marketCap, currency)}
            icon="MC"
            highlight
          />
          <StatField
            label="Enterprise Value"
            value={formatLargeNumber(totalCap, currency)}
            icon="EV"
            highlight
          />
          <StatField
            label="Live Price"
            value={formatMoney(financial.currentPrice, currency)}
            icon="PX"
            highlight
          />
        </div>
      )}

      <div className="mt-5 border-t border-border pt-5">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
          Business Model
        </div>
        <p className="text-sm leading-relaxed text-ink">{research.businessModel}</p>
      </div>
    </section>
  );
}

function StatField({
  label,
  value,
  icon,
  accent,
  highlight,
}: {
  label: string;
  value: string;
  icon: string;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="metric-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {label}
        </span>
        <span
          className="grid h-8 w-8 place-items-center rounded-lg font-mono text-[10px]"
          style={{
            background: accent || highlight ? 'rgba(16,185,129,0.1)' : 'rgba(10,20,14,0.6)',
            border: accent || highlight ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(16,185,129,0.1)',
            color: accent || highlight ? '#10B981' : '#6B7280'
          }}
        >
          {icon}
        </span>
      </div>
      <div
        className="break-words text-sm font-semibold"
        style={{ color: accent || highlight ? '#10B981' : '#F9FAFB' }}
      >
        {value}
      </div>
    </div>
  );
}

function formatEmployees(value: number | null | undefined) {
  if (!value) return "N/A";
  return value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toString();
}

function formatMoney(value: number | null | undefined, currency?: string | null) {
  if (value == null) return "N/A";
  return `${currency ?? ""} ${value.toFixed(2)}`.trim();
}

function formatLargeNumber(value: number | null | undefined, currency?: string | null) {
  if (value == null) return "N/A";
  const prefix = currency ? `${currency} ` : "";
  if (value >= 1e12) return `${prefix}${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${prefix}${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${prefix}${(value / 1e6).toFixed(2)}M`;
  return `${prefix}${value.toLocaleString()}`;
}
