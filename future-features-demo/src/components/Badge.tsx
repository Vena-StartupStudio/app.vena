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
  default: 'bg-white/5 text-slate-100 border border-white/10',
  highlight: 'bg-gradient-to-r from-lavender-500/40 to-aqua-500/40 text-white border border-white/10 shadow-soft',
  soft: 'bg-white/8 text-slate-100/80 border border-white/5',
};

export function Badge({ children, tone = 'default', leadingIcon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide',
        toneStyles[tone],
        className
      )}
    >
      {leadingIcon ? <span className="h-3.5 w-3.5 text-xs">{leadingIcon}</span> : null}
      {children}
    </span>
  );
}
