export type Persona = 'coach' | 'client';

export const personaTokens: Record<Persona, {
  label: string;
  accent: string;
  gradient: string;
  blurb: string;
}> = {
  coach: {
    label: 'Coach workspace',
    accent: 'from-lavender-500/70 via-aqua-500/40 to-aqua-700/70',
    gradient: 'bg-slate-900/70 backdrop-blur-xl border border-white/10',
    blurb: 'Plan, acknowledge, and orchestrate the community rhythm with gentle nudges and ready-made assets.',
  },
  client: {
    label: 'Client experience',
    accent: 'from-aqua-500/60 via-aqua-300/40 to-lavender-300/70',
    gradient: 'bg-slate-900/60 backdrop-blur-xl border border-white/5',
    blurb: 'Scroll an inviting hub showing notes from your coach, challenges, badges, and milestone spotlights.',
  },
};

export const gradientTokens = {
  lounge: 'from-lavender-500/25 via-aqua-500/10 to-aqua-300/20',
  picks: 'from-lavender-500/45 via-slate-800/40 to-aqua-500/45',
  challenges: 'from-aqua-500/15 via-slate-700/30 to-lavender-500/20',
  milestones: 'from-lavender-500/40 via-slate-900/35 to-aqua-500/30',
  spotlight: 'from-aqua-500/25 via-slate-800/35 to-lavender-500/35',
};

export const blurBackdrop = 'backdrop-blur-2xl bg-white/[0.02]';
