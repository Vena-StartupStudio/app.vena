import type { Persona } from '../lib/theme';

export const loungePosts = [
  {
    id: 'lounge-1',
    author: 'Coach Avery',
    role: 'Head Coach',
    timestamp: 'Just now',
    title: 'Morning reset playlist',
    body: 'Five gentle tracks to ease into the day. Pair with three slow breaths.',
    tags: ['Playlist'],
  },
  {
    id: 'lounge-2',
    author: 'Coach Sam',
    role: 'Nutrition Coach',
    timestamp: 'Today',
    title: 'Travel-friendly fuel',
    body: 'Pack the chickpea wrap and a citrus water bottle. Simple and steady.',
    tags: ['Recipe'],
  },
];

export const weeklyPicks = {
  theme: 'Ease back in',
  dropsAt: 'Mondays 7:00 AM',
  entries: [
    { type: 'Move', title: 'Sunrise stretch', detail: '10 minutes, light pace.' },
    { type: 'Fuel', title: 'Blueberry oats', detail: 'Batch once, enjoy all week.' },
    { type: 'Mindset', title: 'One win note', detail: 'Jot a win before bed.' },
  ],
  voice: {
    duration: '02:16',
    transcriptPreview: "Coach shares the week's focus: light movement, easy meals, kind self-talk.",
    waveform: [5, 12, 7, 14, 9, 11, 6, 10, 15, 8, 12, 7],
  },
};

export const challenges = [
  {
    id: 'challenge-1',
    title: 'Walk and stretch',
    description: '15-minute walk plus a hip opener. Earn a calm badge after five days.',
    status: 'in-progress',
    completion: 64,
  },
  {
    id: 'challenge-2',
    title: 'Hydrate and pause',
    description: 'Drink 2L and log one mindful pause. Coach shout-outs midweek.',
    status: 'upcoming',
    kickoff: 'Starts Tuesday',
    completion: 0,
  },
];

export const milestones = [
  {
    id: 'milestone-1',
    member: 'Jamie L.',
    milestone: '6 months strong',
    scheduledFor: 'Friday 9:00 AM',
    channel: "Members' Lounge",
    optIn: true,
    note: 'Plan a quick cheer card and optional recovery perk.',
  },
  {
    id: 'milestone-2',
    member: 'Priya D.',
    milestone: '10th session',
    scheduledFor: 'Wednesday 5:30 PM',
    channel: 'Direct shout-out',
    optIn: true,
    note: 'Add the Consistency badge with a short thank-you.',
  },
];


export const coachTasks = [
  {
    id: 'task-1',
    label: 'Reply to new check-ins',
    effort: '12 min',
    priority: 'today',
    context: 'Clients shared weekend mobility wins.',
  },
  {
    id: 'task-2',
    label: 'Approve spotlight draft',
    effort: '5 min',
    priority: 'today',
    context: "Luis' walk story needs final sign-off.",
  },
];

export const personaHighlights: Record<Persona, Array<{ id: string; label: string; value: string; helper: string }>> = {
  coach: [
    { id: 'highlight-1', label: 'Check-ins', value: '3', helper: '' },
    { id: 'highlight-2', label: 'Challenges live', value: '2', helper: '' },
    { id: 'highlight-3', label: 'Milestones', value: '2', helper: '' },
  ],
  client: [
    { id: 'highlight-1', label: 'This week', value: 'Ease back in', helper: '' },
    { id: 'highlight-2', label: 'Badges', value: '2 tracking', helper: '' },
    { id: 'highlight-3', label: 'Shout-outs', value: '5 live', helper: '' },
  ],
};
