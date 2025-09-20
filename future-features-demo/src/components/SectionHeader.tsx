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
  coach: 'bg-gradient-to-r from-brand-500 to-brand-400 text-white',
  client: 'bg-gradient-to-r from-brand-300 to-brand-500 text-white',
  all: 'bg-accent-100 text-ink',
};

export function SectionHeader({ title, description, persona = 'all', eyebrow, actions, className }: SectionHeaderProps) {
  const personaToken = persona === 'all' ? undefined : personaTokens[persona];

  return (
    <div className={cn('mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between', className)}>
      <div className="max-w-xl space-y-3">
        <div className="flex items-center gap-3">
          {eyebrow ? (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">{eyebrow}</span>
          ) : null}
          <span className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]', personaAccent[persona])}>
            {personaToken?.label ?? 'Shared space'}
          </span>
        </div>
        <h2 className="text-3xl font-semibold text-ink md:text-4xl">
          {title}
        </h2>
        <p className="text-base text-slate-600">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </div>
  );
}
