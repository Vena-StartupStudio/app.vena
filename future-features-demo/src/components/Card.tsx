import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

type CardVariant = 'default' | 'accent' | 'subtle';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  blur?: boolean;
}

const baseByVariant: Record<CardVariant, string> = {
  default: 'glass-panel',
  accent: 'glass-panel bg-gradient-to-br from-white/10 via-white/5 to-white/0 shadow-glow',
  subtle: 'rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-soft',
};

export function Card({ children, className, variant = 'default', blur = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden transition-transform duration-300 ease-soft hover:-translate-y-0.5',
        baseByVariant[variant],
        blur ? 'backdrop-blur-xl' : null,
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-40" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
