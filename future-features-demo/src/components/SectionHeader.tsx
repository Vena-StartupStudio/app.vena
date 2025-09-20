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
  variant?: 'default' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

const personaAccent: Record<Exclude<SectionHeaderProps['persona'], undefined>, string> = {
  coach: 'bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500 text-white border-transparent shadow-lg shadow-brand-500/25',
  client: 'bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 text-white border-transparent shadow-lg shadow-brand-400/25',
  all: 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-slate-200/60 shadow-sm',
};

const variantStyles = {
  default: 'bg-white/95 border-slate-100/60 shadow-elegant backdrop-blur-sm',
  glass: 'bg-white/80 border-white/40 shadow-glass backdrop-blur-md',
  minimal: 'bg-transparent border-transparent shadow-none backdrop-blur-none',
};

const sizeStyles = {
  sm: 'mb-6 space-y-3',
  md: 'mb-8 space-y-4',
  lg: 'mb-12 space-y-6',
};

export function SectionHeader({
  title,
  description,
  persona = 'all',
  eyebrow,
  actions,
  className,
  variant = 'default',
  size = 'md'
}: SectionHeaderProps) {
  const personaToken = persona === 'all' ? undefined : personaTokens[persona];

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl border transition-all duration-700 ease-out',
        'hover:shadow-elegant hover:shadow-slate-200/60 hover:-translate-y-1',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Subtle border highlight */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/40 ring-inset group-hover:ring-white/60 transition-all duration-700" />

      {/* Animated corner accent */}
      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-br from-brand-400/20 to-accent-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between p-6 md:p-8">
        <div className="max-w-2xl space-y-4">
          {/* Eyebrow and Persona Badge Row */}
          <div className="flex items-center gap-4">
            {eyebrow && (
              <div className="relative">
                <span className="text-xs font-bold uppercase tracking-[0.25em] bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent group-hover:from-brand-500 group-hover:to-accent-500 transition-all duration-500">
                  {eyebrow}
                </span>
                {/* Subtle underline */}
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-brand-200/50 to-accent-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            )}

            <div className="relative">
              <span className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ease-out',
                'hover:scale-105 hover:shadow-lg',
                personaAccent[persona]
              )}>
                {/* Persona badge shimmer effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

                {/* Inner glow for colored badges */}
                {(persona === 'coach' || persona === 'client') && (
                  <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}

                <span className="relative z-10">
                  {personaToken?.label ?? 'Shared space'}
                </span>
              </span>
            </div>
          </div>

          {/* Title with enhanced typography */}
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-accent-500 transition-all duration-700 leading-tight">
              {title}
            </h2>

            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>

          {/* Description with improved styling */}
          <div className="relative">
            <p className="text-lg text-slate-600 group-hover:text-slate-700 transition-colors duration-500 leading-relaxed max-w-xl">
              {description}
            </p>

            {/* Bottom accent line */}
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </div>

        {/* Actions area with enhanced styling */}
        {actions && (
          <div className="flex shrink-0 items-center gap-3 relative">
            {/* Actions background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-50/50 to-accent-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -m-2" />

            <div className="relative z-10 flex items-center gap-3">
              {actions}
            </div>
          </div>
        )}
      </div>

      {/* Floating particles effect */}
      <div className="absolute top-6 right-6 w-1 h-1 rounded-full bg-brand-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
      <div className="absolute bottom-8 left-8 w-0.5 h-0.5 rounded-full bg-accent-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  );
}
