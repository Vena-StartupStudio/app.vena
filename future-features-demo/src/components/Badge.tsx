import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

type BadgeTone = 'default' | 'highlight' | 'soft' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  size?: BadgeSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  animated?: boolean;
}

const toneStyles: Record<BadgeTone, string> = {
  default: 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-slate-200/60 shadow-sm',
  highlight: 'bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500 text-white border-transparent shadow-lg shadow-brand-500/25',
  soft: 'bg-white/80 text-slate-600 border-slate-200/40 shadow-sm backdrop-blur-sm',
  success: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-transparent shadow-lg shadow-emerald-500/25',
  warning: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-lg shadow-amber-500/25',
  error: 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-transparent shadow-lg shadow-red-500/25',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-1 text-[10px] gap-1.5',
  md: 'px-3 py-1.5 text-xs gap-2',
  lg: 'px-4 py-2 text-sm gap-2.5',
};

const iconSizeStyles: Record<BadgeSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

export function Badge({
  children,
  tone = 'default',
  size = 'md',
  leadingIcon,
  trailingIcon,
  className,
  animated = false
}: BadgeProps) {
  return (
    <span
      className={cn(
        'group relative inline-flex items-center rounded-full border font-bold uppercase tracking-[0.2em] transition-all duration-300 ease-out',
        'hover:scale-105 hover:shadow-lg',
        animated && 'animate-pulse-soft',
        toneStyles[tone],
        sizeStyles[size],
        className
      )}
    >
      {/* Animated background shimmer */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

      {/* Subtle inner glow for colored badges */}
      {(tone === 'highlight' || tone === 'success' || tone === 'warning' || tone === 'error') && (
        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Animated border ring for special effects */}
      {(tone === 'highlight' || tone === 'success') && (
        <div className="absolute inset-0 rounded-full ring-1 ring-white/30 ring-inset animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-1">
        {leadingIcon && (
          <span className={cn(
            'flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12',
            iconSizeStyles[size]
          )}>
            {leadingIcon}
          </span>
        )}

        <span className="font-extrabold relative">
          {children}
          {/* Subtle text glow on hover for colored badges */}
          {(tone === 'highlight' || tone === 'success' || tone === 'warning' || tone === 'error') && (
            <span className="absolute inset-0 text-white opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-sm">
              {children}
            </span>
          )}
        </span>

        {trailingIcon && (
          <span className={cn(
            'flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12',
            iconSizeStyles[size]
          )}>
            {trailingIcon}
          </span>
        )}
      </span>

      {/* Subtle border highlight */}
      <div className="absolute inset-0 rounded-full ring-1 ring-white/20 ring-inset opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </span>
  );
}
