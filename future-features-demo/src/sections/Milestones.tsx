import { milestones } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface MilestonesPlannerProps {
  persona: Persona;
}

export function MilestonesPlanner({ persona }: MilestonesPlannerProps) {
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Milestones"
        persona={isCoach ? 'coach' : 'client'}
        title="Celebrations on deck"
        description={
          isCoach
            ? 'Confirm consent, choose the shout-out style, and let the system post on time.'
            : 'A peek at moments soon to be celebrated across the community.'
        }
      />
      <Card className="p-6">
        <div className="space-y-5">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{milestone.member}</p>
                <Badge tone={milestone.optIn ? 'highlight' : 'soft'}>{milestone.milestone}</Badge>
              </div>
              <p className="text-xs text-slate-500">{milestone.scheduledFor} · {milestone.channel}</p>
              <p className="mt-2 text-sm text-slate-600">{milestone.note}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
