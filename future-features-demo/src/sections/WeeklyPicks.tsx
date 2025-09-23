import { weeklyPicks } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
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
        eyebrow="Weekly picks"
        persona={isCoach ? 'coach' : 'client'}
        title="Coach's trio"
        description={
          isCoach
            ? 'Adjust the movement, meal, and mindset focus before it drops on Monday.'
            : 'Preview what your coach has planned for the week ahead.'
        }
      />
      <Card variant="accent" className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge tone="highlight">{weeklyPicks.theme}</Badge>
          <span className="text-xs text-slate-500">{weeklyPicks.dropsAt}</span>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {weeklyPicks.entries.map((entry) => (
            <div key={entry.type} className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">{entry.type}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{entry.title}</p>
              <p className="text-xs text-slate-500">{entry.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_160px] md:items-center">
          <p className="text-sm text-slate-600">{weeklyPicks.voice.transcriptPreview}</p>
          <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
            <Waveform points={weeklyPicks.voice.waveform} />
            <p className="mt-2 text-xs text-slate-500">Voice note · {weeklyPicks.voice.duration}</p>
          </div>
        </div>
      </Card>
      {isCoach ? (
        <Card className="p-5">
          <p className="text-sm font-semibold text-ink">Reminder</p>
          <p className="text-sm text-slate-600">Drop a teaser tile in the lounge on Sunday evening.</p>
        </Card>
      ) : null}
    </div>
  );
}
