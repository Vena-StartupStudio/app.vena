import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

type CardVariant = 'default' | 'accent' | 'subtle';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  blur?: boolean;
}

const baseByVariant: Record<CardVariant, string> = {
  default: 'rounded-2xl border border-slate-100/60 bg-white shadow-elegant backdrop-blur-sm',
  accent: 'rounded-2xl border border-transparent bg-gradient-to-br from-white via-white to-slate-50/80 shadow-elegant backdrop-blur-sm',
  subtle: 'rounded-2xl border border-slate-100/40 bg-white shadow-md shadow-slate-100/30 backdrop-blur-sm',
};

export function Card({ children, className, variant = 'default', blur = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-500 ease-out hover:shadow-elegant hover:shadow-slate-200/60 hover:-translate-y-1 hover:scale-[1.01] group',
        baseByVariant[variant],
        blur ? 'backdrop-blur-xl' : null,
        className
      )}
      {...props}
    >
      {/* Subtle inner glow for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/60 via-transparent to-white/20 group-hover:from-white/80 group-hover:to-white/30 transition-all duration-500" />

      {/* Elegant border highlight */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-white/40 ring-inset group-hover:ring-white/60 transition-all duration-500" />

      {/* Content container with proper spacing */}
      <div className="relative z-10 p-1">
        {children}
      </div>

      {/* Subtle bottom highlight for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-100/50 to-transparent" />
    </div>
  );
}
