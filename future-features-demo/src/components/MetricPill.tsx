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
    <div className={cn('rounded-3xl border border-white/5 bg-white/5 px-4 py-3 text-left shadow-soft backdrop-blur-lg transition hover:-translate-y-0.5', className)}>
      <div className="flex items-center gap-3">
        {icon ? <span className="text-white/70">{icon}</span> : null}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">{label}</p>
          <p className="text-xl font-semibold text-white" aria-label={label}>{value}</p>
          {helper ? <p className="text-xs text-white/60">{helper}</p> : null}
        </div>
      </div>
    </div>
  );
}
