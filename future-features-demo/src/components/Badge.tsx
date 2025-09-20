import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

type BadgeTone = 'default' | 'highlight' | 'soft';

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  leadingIcon?: ReactNode;
  className?: string;
}

const toneStyles: Record<BadgeTone, string> = {
  default: 'bg-accent-100 text-ink border border-accent-200',
  highlight: 'bg-gradient-to-r from-brand-500 to-brand-400 text-white border border-transparent shadow-soft',
  soft: 'bg-white text-slate-500 border border-slate-100',
};

export function Badge({ children, tone = 'default', leadingIcon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
        toneStyles[tone],
        className
      )}
    >
      {leadingIcon ? <span className="h-3.5 w-3.5 text-xs">{leadingIcon}</span> : null}
      {children}
    </span>
  );
}
