import { weeklyPicks } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
import { Badge } from '../components/Badge';
import { Waveform } from '../components/Waveform';

interface WeeklyPicksProps {
  persona: Persona;
}

export function WeeklyPicks({ persona }: WeeklyPicksProps) {
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        persona={isCoach ? 'coach' : 'client'}
        eyebrow="Weekly picks"
        title="Coach’s trio for the week"
        description={
          isCoach
            ? 'Edit the exercise, recipe, and mindset prompt before it drops. Voice note preview and scheduling live here.'
            : 'Every Monday the coach curates a movement focus, a gentle nutrition nudge, and a mindset anchor.'
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Reveal>
          <Card variant="accent" className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge tone="highlight">{weeklyPicks.theme}</Badge>
              <span className="text-xs text-white/60">{weeklyPicks.dropsAt}</span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {weeklyPicks.entries.map((entry) => (
                <div key={entry.type} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">{entry.type}</p>
                  <p className="mt-3 text-base font-semibold text-white">{entry.title}</p>
                  <p className="mt-2 text-xs text-white/60">{entry.detail}</p>
                  {isCoach ? (
                    <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/15">
                      Adjust copy ↺
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_200px] md:items-center">
              <div>
                <p className="text-sm text-white/70">{weeklyPicks.voice.transcriptPreview}</p>
                <p className="mt-2 text-xs text-white/50">Audio length • {weeklyPicks.voice.duration}</p>
              </div>
              <Card variant="subtle" className="flex items-center justify-center bg-white/10 p-4">
                <Waveform points={weeklyPicks.voice.waveform} />
              </Card>
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.12}>
          <Card className="p-6">
            {isCoach ? (
              <CoachPanel />
            ) : (
              <ClientPanel />
            )}
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

function CoachPanel() {
  return (
    <div className="space-y-4 text-sm text-white/70">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Release schedule</p>
        <p className="mt-2">Drop Mondays at 7:00 AM with automatic reminder 3 hours later.</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <p className="font-semibold text-white">Pre-drop checklist</p>
        <ul className="mt-2 space-y-1">
          <li>• Confirm mobility video link</li>
          <li>• Attach recipe nutrition PDF</li>
          <li>• Record 5-sec teaser for the lounge</li>
        </ul>
      </div>
      <button className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15">
        Generate teaser card ↗
      </button>
    </div>
  );
}

function ClientPanel() {
  return (
    <div className="space-y-4 text-sm text-white/70">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">This week’s note</p>
        <p className="mt-2">“Focus on exhale length and keep the walk playful. Tag your win in the lounge when you hit day four.”</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <p className="font-semibold text-white">Save for later</p>
        <p className="mt-2">Add all three picks to your checklist so they pop into the daily inbox.</p>
      </div>
      <button className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15">
        Mark trio as planned ✓
      </button>
    </div>
  );
}
