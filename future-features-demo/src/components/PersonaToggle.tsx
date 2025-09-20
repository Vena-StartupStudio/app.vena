import type { Persona } from '../lib/theme';
import { personaTokens } from '../lib/theme';
import { cn } from '../lib/utils';

interface PersonaToggleProps {
  value: Persona;
  onChange: (value: Persona) => void;
}

const personas: Persona[] = ['coach', 'client'];

export function PersonaToggle({ value, onChange }: PersonaToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
      {personas.map((persona) => {
        const active = value === persona;
        return (
          <button
            key={persona}
            type="button"
            onClick={() => onChange(persona)}
            className={cn(
              'relative rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ease-soft',
              active ? 'bg-gradient-to-r from-lavender-500/70 to-aqua-500/70 text-white shadow-soft' : 'text-white/60 hover:text-white'
            )}
          >
            <span>{personaTokens[persona].label}</span>
          </button>
        );
      })}
    </div>
  );
}
