import type { ReactNode } from 'react';
import { useRef, useCallback, useState, useEffect } from 'react';
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
  const navRef = useRef<HTMLDivElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const focusTab = useCallback((idx: number) => {
    const nav = navRef.current;
    if (!nav) return;
    const buttons = nav.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
    if (idx >= 0 && idx < buttons.length) buttons[idx].focus();
  }, []);

  // Update indicator position when active tab changes
  useEffect(() => {
    const updateIndicator = () => {
      const nav = navRef.current;
      if (!nav) return;

      const activeButton = nav.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
      if (!activeButton) return;

      const navRect = nav.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        width: buttonRect.width,
        left: buttonRect.left - navRect.left,
      });
    };

    // Small delay to ensure DOM is updated
    setTimeout(updateIndicator, 10);
  }, [activeTab, tabs]);

  const handleTabChange = (tabId: string, index: number) => {
    if (tabId === activeTab) return;

    setIsAnimating(true);
    onTabChange(tabId);

    // Focus management
    requestAnimationFrame(() => {
      focusTab(index);
      setTimeout(() => setIsAnimating(false), 300);
    });
  };

  return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 via-rose-50 to-amber-50">
        <header className="relative z-10 border-b border-slate-100/70 bg-gradient-to-r from-brand-100 via-white to-accent-100 backdrop-blur-xl shadow-lg">
          <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-6 px-6 py-8 md:px-10">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-200 via-white to-accent-200 shadow-xl transition-transform duration-300 ease-soft hover:scale-105">
                <img src="/assets/glow.svg" alt="" className="absolute inset-0 h-full w-full opacity-60" />
                <span className="relative z-10 text-base font-extrabold uppercase tracking-[0.3em] text-brand-600 drop-shadow"></span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-500">Future Features</p>
                <p className="text-xl font-extrabold text-ink leading-none">Vena Prototype</p>
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
          {/* Redesigned Tab Selector */}
          <div className="overflow-x-auto">
            <nav
              ref={navRef}
              className="group relative flex w-full min-w-[320px] max-w-full items-center justify-center gap-2 rounded-3xl border border-slate-100/80 bg-gradient-to-br from-white/95 via-white/90 to-brand-50 p-3 shadow-glass backdrop-blur-lg hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-700 ease-out"
              role="tablist"
              aria-label="Main navigation"
              tabIndex={0}
              onKeyDown={(e) => {
                const idx = tabs.findIndex((t) => t.id === activeTab);
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  const next = (idx + 1) % tabs.length;
                  handleTabChange(tabs[next].id, next);
                  e.preventDefault();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  const prev = (idx - 1 + tabs.length) % tabs.length;
                  handleTabChange(tabs[prev].id, prev);
                  e.preventDefault();
                }
              }}
            >
              {/* Animated glass indicator */}
              <div
                className={cn(
                  "absolute top-2 bottom-2 rounded-xl bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 shadow-glow transition-all duration-700 ease-out overflow-hidden",
                  isAnimating && "scale-105 shadow-2xl"
                )}
                style={{
                  width: indicatorStyle.width,
                  left: indicatorStyle.left,
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3), 0 4px 16px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-section-shine opacity-0 group-hover:opacity-100" />
              </div>

              {/* Ambient glass glow */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.10) 0%, transparent 70%)',
                  filter: 'blur(12px)',
                }}
              />

              {tabs.map((tab, index) => {
                const active = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    data-tab-id={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={tab.label}
                    tabIndex={active ? 0 : -1}
                    onClick={() => handleTabChange(tab.id, index)}
                    className={cn(
                      'group/tab relative flex flex-1 items-center justify-center gap-3 rounded-xl px-7 py-3 text-base font-bold transition-all duration-500 ease-out outline-none min-w-0',
                      'hover:scale-105 hover:shadow-glow active:scale-95',
                      active
                        ? 'text-white drop-shadow-lg transform scale-105 z-10 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 shadow-glow'
                        : 'text-brand-700 hover:text-brand-800 hover:bg-gradient-to-r hover:from-white/60 hover:to-white/40',
                      'focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
                    )}
                  >
                    {/* Floating Icon with animation */}
                    <span className={cn(
                      "text-xl transition-all duration-500 ease-out relative z-10",
                      active ? "scale-115 drop-shadow-md animate-section-float" : "group-hover/tab:scale-110 group-hover/tab:animate-section-float"
                    )}>
                      {tab.icon}
                    </span>

                    {/* Label */}
                    <span className={cn(
                      "hidden sm:inline-block transition-all duration-500 ease-out relative z-10",
                      active ? "font-extrabold tracking-wide" : "group-hover/tab:font-semibold"
                    )}>
                      {tab.label}
                    </span>

                    {/* Helper badge with glass effect */}
                    {tab.helper && (
                      <span className={cn(
                        "ml-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-500 ease-out relative z-10 border backdrop-blur-sm",
                        active
                          ? "bg-white/20 text-white border-white/30 shadow-sm"
                          : "bg-brand-100 text-brand-700 border-brand-200 group-hover/tab:bg-brand-50 group-hover/tab:border-brand-300"
                      )}>
                        {tab.helper}
                      </span>
                    )}

                    {/* Hover ripple effect */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover/tab:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Active pulse effect */}
                    {active && (
                      <div className="absolute inset-0 rounded-xl bg-white/10 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Redesigned Metric Cards */}
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {highlights.map((highlight, index) => (
              <div
                key={highlight.id}
                className="relative rounded-4xl bg-gradient-to-br from-white/95 via-white/90 to-brand-50 shadow-glass p-8 flex flex-col items-center gap-2 hover:-translate-y-1 transition-all duration-500 hover:shadow-glow group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  opacity: 1,
                  transform: 'none',
                }}
              >
                {/* Layered glass effect */}
                <div className="absolute inset-0 rounded-4xl bg-gradient-to-br from-brand-100/10 via-white/30 to-accent-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                {/* Animated shine sweep */}
                <div className="absolute inset-0 rounded-4xl bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                {/* Inner card with glass morphism */}
                <div className="relative z-10 w-full">
                  <MetricPill label={highlight.label} value={highlight.value} helper={highlight.helper} className="shadow-none bg-white/90 rounded-3xl" />
                </div>
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
