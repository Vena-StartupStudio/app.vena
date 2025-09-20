import type { ReactNode } from 'react';
import type { Persona } from '../lib/theme';
import { personaTokens } from '../lib/theme';
import { cn } from '../lib/utils';
import { MetricPill } from './MetricPill';
import { PersonaToggle } from './PersonaToggle';

interface TabLink {
  id: string;
  label: string;
  icon: ReactNode;
  helper?: string;
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
  tabs: TabLink[];
  activeTab: string;
  onTabChange: (id: string) => void;
  highlights: Highlight[];
  children: ReactNode;
}

export function Shell({
  persona,
  onPersonaChange,
  tabs,
  activeTab,
  onTabChange,
  highlights,
  children,
}: ShellProps) {
  const personaToken = personaTokens[persona];

  return (
    <div className="flex min-h-screen flex-col bg-night">
      <header className="border-b border-slate-100/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-6 px-6 py-6 md:px-10">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-100 via-white to-accent-100 shadow-soft">
              <img src="/assets/glow.svg" alt="" className="absolute inset-0 h-full w-full opacity-70" />
              <span className="relative z-10 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">FF</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Future Features</p>
              <p className="text-lg font-semibold text-ink">Experience Prototype</p>
            </div>
          </div>
          <PersonaToggle value={persona} onChange={onPersonaChange} />
        </div>
        <div className="border-t border-slate-100/70 bg-white/90">
          <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-6 py-4 md:px-10">
            <p className="text-sm text-slate-500">{personaToken.blurb}</p>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 md:inline-flex">
              Local-only mock · No live data
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-shell flex-1 px-6 pb-20 pt-12 md:px-10">
        <div className="overflow-x-auto">
          <nav className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white p-1 shadow-soft">
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ease-soft',
                    active
                      ? 'bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-soft'
                      : 'text-slate-500 hover:text-ink'
                  )}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <MetricPill key={highlight.id} label={highlight.label} value={highlight.value} helper={highlight.helper} />
          ))}
        </div>

        <section className="mt-12 space-y-10">{children}</section>
      </main>
    </div>
  );
}
