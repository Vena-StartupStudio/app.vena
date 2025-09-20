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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 via-rose-50 to-amber-50">
      <header className="relative z-10 border-b border-slate-100/70 bg-gradient-to-r from-brand-100 via-white to-accent-100 backdrop-blur-xl shadow-lg">
        <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-6 px-6 py-8 md:px-10">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-200 via-white to-accent-200 shadow-xl">
              <img src="/assets/glow.svg" alt="" className="absolute inset-0 h-full w-full opacity-60" />
              <span className="relative z-10 text-base font-extrabold uppercase tracking-[0.3em] text-brand-600 drop-shadow"></span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-500">Future Features</p>
              <p className="text-xl font-extrabold text-ink">Vena Prototype</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <PersonaToggle value={persona} onChange={onPersonaChange} />
          </div>
        </div>
        <div className="border-t border-slate-100/70 bg-white/90">
          <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-6 py-4 md:px-10">
            <p className="text-sm text-brand-600 font-semibold animate-fade-in">{personaToken.blurb}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-shell flex-1 px-6 pb-20 pt-12 md:px-10">
        <div className="overflow-x-auto">
          <nav
            className="relative flex w-full min-w-[320px] max-w-full items-center justify-center rounded-full border border-slate-100 bg-white p-2 shadow-xl"
            role="tablist"
            aria-label="Main navigation"
            tabIndex={0}
            onKeyDown={(e) => {
              const idx = tabs.findIndex((t) => t.id === activeTab);
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                onTabChange(tabs[(idx + 1) % tabs.length].id);
                e.preventDefault();
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                onTabChange(tabs[(idx - 1 + tabs.length) % tabs.length].id);
                e.preventDefault();
              }
            }}
          >
            {/* Sliding indicator */}
            <div
              aria-hidden
              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 shadow-lg transition-all duration-500 ease-out"
              style={{
                width: `calc(100% / ${tabs.length})`,
                transform: `translateX(${tabs.findIndex((t) => t.id === activeTab) * 100}%)`,
                zIndex: 1,
              }}
            />
            {tabs.map((tab, i) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={tab.label}
                  tabIndex={active ? 0 : -1}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-bold transition-all duration-300 ease-soft outline-none hover:scale-105',
                    active ? 'text-white drop-shadow' : 'text-brand-600 hover:text-brand-700 hover:bg-white/50',
                    'focus:ring-2 focus:ring-brand-300 focus:ring-offset-2'
                  )}
                  style={{ minWidth: 0 }}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="hidden sm:inline-block">{tab.label}</span>
                  {tab.helper && (
                    <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-600">{tab.helper}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {highlights.map((highlight, index) => (
            <div
              key={highlight.id}
              className="rounded-2xl bg-white/90 shadow-lg p-5 flex flex-col items-center gap-2 hover:scale-[1.03] transition-all duration-300 hover:shadow-xl"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0,
                transform: 'translateY(20px)',
              }}
            >
              <MetricPill label={highlight.label} value={highlight.value} helper={highlight.helper} />
            </div>
          ))}
        </div>

        <section className="mt-14 space-y-12 animate-fade-in">
          {children}
        </section>
      </main>
      {/* Decorative background shapes */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-brand-100 opacity-30 blur-2xl" />
        <div className="absolute right-0 bottom-0 h-32 w-32 rounded-full bg-accent-100 opacity-20 blur-2xl" />
      </div>
    </div>
  );
}
