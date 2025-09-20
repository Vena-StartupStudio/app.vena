import type { Persona } from '../lib/theme';

export const loungePosts = [
  {
    id: 'lounge-1',
    author: 'Coach Avery',
    role: 'Head Coach',
    timestamp: '2m ago',
    title: 'Morning reset playlist is live',
    body: 'Try the five-track breathing ladder with gentle ankle rolls. Pair it with a tall glass of water and a two-minute gratitude jot.',
    tags: ['Playlist', 'Reset'],
    attachments: [{ type: 'audio', label: '12 tracks' }],
    reactions: { celebrate: 18, comments: 6 },
    seenBy: 42,
  },
  {
    id: 'lounge-2',
    author: 'Coach Sam',
    role: 'Nutrition Specialist',
    timestamp: '38m ago',
    title: 'Gentle fuel for travel days',
    body: 'Simple wrap: chickpeas, spinach, citrus tahini. Prep two in advance and thank yourself on the road.',
    tags: ['Recipe'],
    attachments: [{ type: 'checklist', label: 'Prep steps' }],
    reactions: { celebrate: 9, comments: 2 },
    seenBy: 31,
  },
  {
    id: 'lounge-3',
    author: 'Coach Mika',
    role: 'Movement Coach',
    timestamp: '1h ago',
    title: 'Recovery corner reminder',
    body: 'Your calves called—they love that 5-minute fascia roll. Tag us in the lounge once you’re done for a gentle high-five.',
    tags: ['Recovery'],
    attachments: [],
    reactions: { celebrate: 27, comments: 4 },
    seenBy: 54,
  },
];

export const weeklyPicks = {
  theme: 'Ease back in week',
  dropsAt: 'Mondays • 7:00 AM',
  entries: [
    {
      type: 'Exercise',
      title: 'Sunrise Mobility Ladder',
      detail: '12 minutes • low impact',
    },
    {
      type: 'Recipe',
      title: 'Blueberry Glow Overnight Oats',
      detail: 'Prep Sunday • Grab-and-go breakfast',
    },
    {
      type: 'Mindset',
      title: 'Micro-wins keep you moving',
      detail: 'Take sixty seconds to note where you showed up today.',
    },
  ],
  voice: {
    duration: '02:16',
    transcriptPreview: 'Three anchors for the week: lighter loads, longer exhale, and gratitude on Fridays.',
    waveform: [5, 12, 7, 14, 9, 11, 6, 10, 15, 8, 12, 7],
  },
};

export const challenges = [
  {
    id: 'challenge-1',
    title: '7-day walk + stretch blend',
    description: '15-minute walk plus gentle hip opener. Badge lands when you log 5 of 7 days—no leaderboard, only cheers.',
    status: 'in-progress',
    completion: 64,
    coachNote: 'Send a Monday nudge to the new cohort.',
  },
  {
    id: 'challenge-2',
    title: 'Hydrate & pause challenge',
    description: 'Sip 2L daily and take one mindful pause. Coach shout-outs spark midweek momentum.',
    status: 'upcoming',
    kickoff: 'Starts next Tuesday',
    completion: 0,
  },
  {
    id: 'challenge-3',
    title: 'Recovery lounge wind-down',
    description: 'Light yin stretch before bed, optional foam roll. Badge auto-grants after 3 check-ins.',
    status: 'completed',
    completion: 100,
    coachNote: 'Send the recap postcard on Friday.',
  },
];

export const milestones = [
  {
    id: 'milestone-1',
    member: 'Jamie L.',
    milestone: '6 months with the club',
    scheduledFor: 'Friday • 9:00 AM',
    channel: 'Members’ Lounge',
    optIn: true,
    note: 'Plan a group cheer + offer a recovery badge upgrade.',
  },
  {
    id: 'milestone-2',
    member: 'Priya D.',
    milestone: '10th session',
    scheduledFor: 'Wednesday • 5:30 PM',
    channel: 'Direct shout-out',
    optIn: true,
    note: 'Add the “Consistency 4 weeks” badge with a handwritten message.',
  },
  {
    id: 'milestone-3',
    member: 'Jordan P.',
    milestone: 'First session anniversary',
    scheduledFor: 'Next Monday',
    channel: 'Spotlight story',
    optIn: false,
    note: 'Awaiting consent toggle—remind them in tomorrow’s check-in.',
  },
];

export const amaQueue = [
  {
    id: 'ama-1',
    question: 'How do I stay consistent when I travel every other week?',
    from: 'Taylor',
    status: 'Answered',
    answerSummary: 'Pack two staple moves and a five-minute reflection. Travelling is success when you keep it small.',
    audioLength: '05:02',
  },
  {
    id: 'ama-2',
    question: 'What are your go-to recovery cues after leg day?',
    from: 'Riley',
    status: 'Queued',
    answerSummary: 'Prep foam roll, hydration bump, optional magnesium.',
  },
];

export const spotlightStories = [
  {
    id: 'story-1',
    member: 'Priya',
    focus: 'Mindful mornings',
    quote: 'Three months of gentle wake-ups with the lounge playlist means I start my workday unhurried.',
    coachNote: 'Consent on file • Reviewed 2 days ago',
    tone: 'warm',
  },
  {
    id: 'story-2',
    member: 'Luis',
    focus: 'Walk + stretch streak',
    quote: 'My joints stopped complaining once I treated the stretch videos like meetings with myself.',
    coachNote: 'Coach Avery scheduled post-run shout-out',
    tone: 'bright',
  },
];

export const badgeRoster = {
  coachComposer: {
    draftName: 'Recovery Champ',
    draftMessage: 'You kept showing up for the roll + rest flow every single week. Body thanks you, team thanks you.',
    autoRule: 'After 4 logged recoveries',
    palette: 'from-lavender-500 to-aqua-400',
  },
  clientBadges: [
    { id: 'badge-1', name: 'Consistency • 4 weeks', status: 'earned', grantedBy: 'Coach Avery' },
    { id: 'badge-2', name: 'Early-bird', status: 'tracking', grantedBy: 'Auto rule' },
    { id: 'badge-3', name: 'Recovery Champ', status: 'queued', grantedBy: 'Coach review' },
  ],
};

export const coachTasks = [
  {
    id: 'task-1',
    label: 'Reply to 3 new check-ins',
    effort: '12 min',
    priority: 'today',
    context: 'Members shared weekend mobility wins.',
  },
  {
    id: 'task-2',
    label: 'Approve spotlight story draft',
    effort: '5 min',
    priority: 'today',
    context: 'Luis’ walk + stretch spotlight needs final polish.',
  },
  {
    id: 'task-3',
    label: 'Record challenge kickoff voice note',
    effort: '8 min',
    priority: 'suggested',
    context: 'Hydrate & pause challenge launches next Tuesday.',
  },
];

export const templateKits = [
  {
    id: 'kit-1',
    name: 'Challenge kickoff set',
    summary: 'Announcement post, daily nudge templates, recap storyboard.',
    tags: ['Featured'],
  },
  {
    id: 'kit-2',
    name: 'Monthly AMA kit',
    summary: 'Submission form, teaser tile, audio outline, follow-up message.',
    tags: ['Updated'],
  },
  {
    id: 'kit-3',
    name: 'Welcome bundle',
    summary: 'First-week roadmap, printable postcard, lounge introduction script.',
    tags: [],
  },
  {
    id: 'kit-4',
    name: 'Partner postcard set',
    summary: 'Co-branded note + story spotlight prompts for collaborators.',
    tags: [],
  },
];

export const personaHighlights: Record<Persona, Array<{ id: string; label: string; value: string; helper: string }>> = {
  coach: [
    { id: 'highlight-1', label: 'Check-ins waiting', value: '3', helper: 'All flagged for a warm reply.' },
    { id: 'highlight-2', label: 'Challenges in motion', value: '2', helper: 'Next kickoff voice note recommended.' },
    { id: 'highlight-3', label: 'Milestones queued', value: '4', helper: 'Two need consent confirmations.' },
  ],
  client: [
    { id: 'highlight-1', label: 'This week’s focus', value: 'Ease back in', helper: 'Coach notes: soften your pace, extend your exhale.' },
    { id: 'highlight-2', label: 'Badges tracking', value: '3', helper: 'Consistency, Early-bird, Recovery Champ.' },
    { id: 'highlight-3', label: 'Community shout-outs', value: '5', helper: 'Catch the latest wins in the lounge feed.' },
  ],
};
