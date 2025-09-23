import type { Persona } from '../lib/theme';
import { personaTokens } from '../lib/theme';
import { cn } from '../lib/utils';
import { useRef, useEffect } from 'react';

interface PersonaToggleProps {
  value: Persona;
  onChange: (value: Persona) => void;
}

const personas: Persona[] = ['coach', 'client'];

function IconCoach() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconClient() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PersonaToggle({ value, onChange }: PersonaToggleProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // keyboard navigation: left/right or arrow keys
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      const idx = personas.indexOf(value);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        onChange(personas[(idx + 1) % personas.length]);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        onChange(personas[(idx - 1 + personas.length) % personas.length]);
        e.preventDefault();
      }
    };

    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [value, onChange]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Persona"
      tabIndex={0}
      className="relative inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-300"
    >
      {/* sliding indicator */}
      <div
        aria-hidden
        className={cn(
          'absolute top-0 bottom-0 m-1 rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-300 ease-soft shadow-md',
          value === 'coach' ? 'left-0 w-1/2' : 'right-0 w-1/2'
        )}
        style={{
          // fallback width for small containers
          minWidth: 48,
        }}
      />

      {personas.map((persona) => {
        const active = value === persona;
        return (
          <button
            key={persona}
            type="button"
            role="tab"
            aria-pressed={active}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(persona)}
            className={cn(
              'relative z-10 flex w-1/2 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ease-soft',
              active ? 'text-white' : 'text-slate-600 hover:text-ink'
            )}
          >
            <span className="sr-only">{personaTokens[persona].label}</span>
            <span className="inline-flex items-center gap-2">
              <span className={cn(active ? 'text-white' : 'text-slate-400')}>
                {persona === 'coach' ? <IconCoach /> : <IconClient />}
              </span>
              <span className="hidden sm:inline-block">{personaTokens[persona].label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
