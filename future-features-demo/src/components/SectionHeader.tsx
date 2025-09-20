import type { ReactNode } from 'react';
import type { Persona } from '../lib/theme';
import { personaTokens } from '../lib/theme';
import { cn } from '../lib/utils';

interface SectionHeaderProps {
  title: string;
  description: string;
  persona?: Persona | 'all';
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

const personaAccent: Record<Exclude<SectionHeaderProps['persona'], undefined>, string> = {
  coach: 'bg-gradient-to-r from-lavender-500/40 to-aqua-500/40 text-white/90',
  client: 'bg-gradient-to-r from-aqua-400/30 to-lavender-300/30 text-white/85',
  all: 'bg-white/5 text-white/80',
};

export function SectionHeader({ title, description, persona = 'all', eyebrow, actions, className }: SectionHeaderProps) {
  const personaToken = persona === 'all' ? undefined : personaTokens[persona];

  return (
    <div className={cn('mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between', className)}>
      <div className="max-w-xl space-y-3">
        <div className="flex items-center gap-3">
          {eyebrow ? (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{eyebrow}</span>
          ) : null}
          <span className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]', personaAccent[persona])}>
            {personaToken?.label ?? 'Shared Space'}
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-white/70 md:text-base">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </div>
  );
}
