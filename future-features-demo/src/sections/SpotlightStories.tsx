import { spotlightStories } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
import { Badge } from '../components/Badge';

interface SpotlightStoriesProps {
  persona: Persona;
}

export function SpotlightStories({ persona }: SpotlightStoriesProps) {
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Spotlight"
        persona="all"
        title="Stories that celebrate consistency"
        description="Lightweight lifestyle snapshots, shared only with consent. Coach polish on the right, community view on the left."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {spotlightStories.map((story, index) => (
              <Card key={story.id} className="p-6">
                <Badge tone="highlight">{story.focus}</Badge>
                <p className="mt-4 text-lg font-semibold text-white">{story.member}</p>
                <p className="mt-3 text-sm text-white/70">“{story.quote}”</p>
                <p className="mt-4 text-xs text-white/50">{story.coachNote}</p>
              </Card>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <Card className="h-full p-6">
            {isCoach ? <CoachStoryPanel /> : <ClientStoryPanel />}
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

function CoachStoryPanel() {
  return (
    <div className="flex h-full flex-col justify-between gap-6 text-sm text-white/70">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Asset prep</p>
        <div className="mt-3 space-y-2">
          <ToggleRow label="Public lounge post" active />
          <ToggleRow label="Client profile highlight" active />
          <ToggleRow label="Shareable postcard" />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Tone check</p>
        <p className="mt-2">Keep the spotlight on habits, not measurements. Stories auto-expire after thirty days.</p>
      </div>
      <button className="mt-auto inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15">
        Export story pack ↗
      </button>
    </div>
  );
}

function ClientStoryPanel() {
  return (
    <div className="flex h-full flex-col justify-between gap-6 text-sm text-white/70">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Community vibe</p>
        <p className="mt-2">Celebrate peers leaning into lifestyle shifts. Tap “Send cheer” to add a gentle high-five.</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <p className="font-semibold text-white">Quick reactions</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {['Send cheer', 'Save inspiration', 'Ask how'].map((action) => (
            <span key={action} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
              {action}
            </span>
          ))}
        </div>
      </div>
      <button className="mt-auto inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15">
        Send a cheer message ↗
      </button>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  active?: boolean;
}

function ToggleRow({ label, active = false }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
      <span>{label}</span>
      <span className={`inline-flex h-5 w-9 items-center rounded-full border border-white/10 ${active ? 'bg-gradient-to-r from-lavender-500/60 to-aqua-500/60' : 'bg-white/10'}`}>
        <span className={`ml-1 inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-300 ease-soft transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
      </span>
    </div>
  );
}
