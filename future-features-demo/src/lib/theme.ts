export type Persona = 'coach' | 'client';

export const personaTokens: Record<Persona, {
  label: string;
  accent: string;
  gradient: string;
  blurb: string;
}> = {
  coach: {
    label: 'Coach workspace',
    accent: 'from-lavender-500/70 via-slate-400/50 to-aqua-500/70',
    gradient: 'bg-slate-900/70 backdrop-blur-xl border border-white/10',
    blurb: 'Plan, acknowledge, and orchestrate the community rhythm with gentle nudges and ready-made assets.',
  },
  client: {
    label: 'Client experience',
    accent: 'from-aqua-500/60 via-slate-300/40 to-lavender-400/70',
    gradient: 'bg-slate-900/60 backdrop-blur-xl border border-white/5',
    blurb: 'Scroll an inviting hub showing notes from your coach, challenges, badges, and milestone spotlights.',
  },
};

export const gradientTokens = {
  lounge: 'from-slate-400/30 via-white/5 to-indigo-400/20',
  picks: 'from-lavender-500/50 via-slate-800/40 to-aqua-400/50',
  challenges: 'from-slate-400/10 via-white/5 to-aqua-500/20',
  milestones: 'from-lavender-400/45 via-slate-900/40 to-slate-500/40',
  spotlight: 'from-aqua-400/25 via-slate-800/40 to-lavender-400/40',
};

export const blurBackdrop = 'backdrop-blur-2xl bg-white/[0.02]';
