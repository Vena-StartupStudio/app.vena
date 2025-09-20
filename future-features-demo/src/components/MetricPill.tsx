import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface MetricPillProps {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  className?: string;
}

export function MetricPill({ label, value, helper, icon, className }: MetricPillProps) {
  return (
    <div className={cn('rounded-3xl border border-slate-100 bg-white px-4 py-4 text-left shadow-soft transition hover:-translate-y-0.5', className)}>
      <div className="flex items-center gap-3">
        {icon ? <span className="text-brand-500">{icon}</span> : null}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
          <p className="text-xl font-semibold text-ink" aria-label={label}>{value}</p>
          {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
        </div>
      </div>
    </div>
  );
}
