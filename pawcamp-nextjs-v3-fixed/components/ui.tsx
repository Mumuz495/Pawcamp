import { ReactNode } from 'react';

export function SectionHeader({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        {eyebrow ? <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p> : null}
        <h2 className="text-[26px] leading-tight font-semibold text-foreground">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[30px] border border-border bg-surface p-4 shadow-soft ${className}`}>{children}</div>;
}

export function Pill({ children, active = false, tone = 'default' }: { children: ReactNode; active?: boolean; tone?: 'default' | 'success' | 'warning' | 'danger'; }) {
  const tones = {
    default: active ? 'bg-primary text-white' : 'bg-surface-alt text-muted',
    success: active ? 'bg-primary text-white' : 'bg-success-soft text-primary',
    warning: active ? 'bg-primary text-white' : 'bg-warning-soft text-foreground',
    danger: active ? 'bg-primary text-white' : 'bg-danger-soft text-foreground',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function MetricCard({ value, label }: { value: string | number; label: string }) {
  return (
    <Card className="p-4 text-center">
      <div className="text-[32px] leading-none font-semibold">{value}</div>
      <div className="mt-2 text-xs text-muted">{label}</div>
    </Card>
  );
}

export function ToggleChip({ active, label, onClick }: { active: boolean; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${active ? 'bg-primary text-white shadow-soft' : 'bg-surface-alt text-muted'}`}>
      {label}
    </button>
  );
}

export function SegmentedControl({ options, value, onChange }: { options: { label: string; value: string }[]; value: string; onChange: (next: string) => void; }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-surface-alt p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? 'bg-surface text-foreground shadow-soft' : 'text-muted'}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
