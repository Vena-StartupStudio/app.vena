import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

type CardVariant = 'default' | 'accent' | 'subtle';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  blur?: boolean;
}

const baseByVariant: Record<CardVariant, string> = {
  default: 'rounded-3xl border border-slate-100 bg-white shadow-soft',
  accent: 'rounded-3xl border border-transparent bg-gradient-to-br from-brand-50 via-white to-accent-100 shadow-glow',
  subtle: 'rounded-3xl border border-slate-100 bg-white shadow-sm',
};

export function Card({ children, className, variant = 'default', blur = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden transition-transform duration-300 ease-soft hover:-translate-y-0.5',
        baseByVariant[variant],
        blur ? 'backdrop-blur-lg' : null,
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/0 via-white/40 to-white/0" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
