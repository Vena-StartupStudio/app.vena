import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface MetricPillProps {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'border-slate-100/60 bg-white/95 shadow-elegant backdrop-blur-sm',
  accent: 'border-transparent bg-gradient-to-br from-white via-white to-slate-50/80 shadow-elegant backdrop-blur-sm',
  minimal: 'border-slate-100/40 bg-white/80 shadow-md backdrop-blur-sm',
};

const sizeStyles = {
  sm: 'px-3 py-3',
  md: 'px-4 py-4',
  lg: 'px-5 py-5',
};

export function MetricPill({
  label,
  value,
  helper,
  icon,
  className,
  variant = 'default',
  size = 'md'
}: MetricPillProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border transition-all duration-500 ease-out',
        'hover:shadow-elegant hover:shadow-slate-200/60 hover:-translate-y-1 hover:scale-[1.02]',
        variantStyles[variant],
        'px-8 py-7', // Increased padding for better content fit
        className
      )}
    >
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-brand-200/50 via-accent-200/30 to-brand-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="h-full w-full rounded-2xl bg-white/95" />
      </div>

      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Elegant border highlight */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/40 ring-inset group-hover:ring-white/60 transition-all duration-500" />

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full w-full">
        {/* Label with enhanced typography */}
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 group-hover:text-slate-600 transition-colors duration-300 mb-2">
          {label}
        </p>

        {/* Value with gradient text effect */}
        <div className="relative mb-2">
          <p
            className="text-3xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-accent-500 transition-all duration-500"
            aria-label={`${label}: ${value}`}
          >
            {value}
          </p>

          {/* Subtle shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        </div>

        {/* Helper text with improved styling */}
        {helper && (
          <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300 mt-1 leading-relaxed">
            {helper}
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-brand-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Corner accent */}
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-brand-400/20 to-accent-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
