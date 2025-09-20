import type { ReactNode } from 'react';
import type { Persona } from '../lib/theme';
import { personaTokens } from '../lib/theme';
import { cn } from '../lib/utils';
import { MetricPill } from './MetricPill';
import { PersonaToggle } from './PersonaToggle';

interface SectionLink {
  id: string;
  label: string;
  icon: ReactNode;
}

interface Highlight {
  id: string;
  label: string;
  value: string;
  helper: string;
}

interface ShellProps {
  persona: Persona;
  onPersonaChange: (value: Persona) => void;
  sections: SectionLink[];
  activeSection: string;
  onScrollToSection: (id: string) => void;
  highlights: Highlight[];
  children: ReactNode;
}

export function Shell({
  persona,
  onPersonaChange,
  sections,
  activeSection,
  onScrollToSection,
  highlights,
  children,
}: ShellProps) {
  const personaToken = personaTokens[persona];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-night/85 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-6 px-6 py-5 md:px-10">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-400/40 via-white/10 to-aqua-400/40 shadow-soft">
              <img src="/assets/glow.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
              <span className="relative z-10 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">FF</span>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/40">Future Features</p>
              <p className="text-base font-medium text-white">Prototype Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <PersonaToggle value={persona} onChange={onPersonaChange} />
          </div>
        </div>
        <div className="border-t border-white/5 bg-white/5 py-3">
          <div className="mx-auto flex w-full max-w-shell flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-10">
            <p className="max-w-3xl text-xs text-white/60 md:text-sm">{personaToken.blurb}</p>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Local-only mock • No live data
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-shell gap-6 px-6 pb-24 pt-10 md:px-10">
        <aside className="sticky top-36 hidden w-60 flex-shrink-0 flex-col gap-6 lg:flex">
          <nav className="rounded-3xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl">
            <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">Map</p>
            <ul className="space-y-1">
              {sections.map((section) => {
                const active = section.id === activeSection;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => onScrollToSection(section.id)}
                      className={cn(
                        'group flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-sm transition ease-soft',
                        active ? 'bg-gradient-to-r from-lavender-500/40 to-aqua-500/40 text-white shadow-soft' : 'text-white/60 hover:bg-white/8 hover:text-white'
                      )}
                    >
                      <span className="text-white/50 transition group-hover:text-white">{section.icon}</span>
                      <span className="font-medium">{section.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="flex-1 space-y-14">
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((highlight) => (
              <MetricPill key={highlight.id} label={highlight.label} value={highlight.value} helper={highlight.helper} />
            ))}
          </div>
          <main className="space-y-16">{children}</main>
        </div>
      </div>
    </div>
  );
}
