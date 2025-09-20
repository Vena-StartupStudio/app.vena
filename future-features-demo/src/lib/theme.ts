export type Persona = 'coach' | 'client';

export const personaTokens: Record<Persona, {
  label: string;
  accent: string;
  gradient: string;
  blurb: string;
}> = {
  coach: {
    label: 'Coach workspace',
    accent: 'from-brand-500 via-brand-200 to-brand-600',
    gradient: 'bg-white border border-slate-100 shadow-soft',
    blurb: 'Queue highlights, celebrate milestones, and keep the rhythm with a calm coach cockpit.',
  },
  client: {
    label: 'Client experience',
    accent: 'from-brand-300 via-accent-200 to-brand-500',
    gradient: 'bg-white border border-slate-100 shadow-soft',
    blurb: 'Preview the community hub clients will browse—notes, challenges, badges, and cheers in one glance.',
  },
};

export const gradientTokens = {
  lounge: 'from-brand-100 via-white to-accent-100',
  picks: 'from-brand-50 via-white to-accent-100',
  challenges: 'from-white via-accent-100 to-brand-100',
  milestones: 'from-brand-50 via-white to-brand-100',
  spotlight: 'from-accent-100 via-white to-brand-100',
};

export const blurBackdrop = 'backdrop-blur-xl bg-white/80';
