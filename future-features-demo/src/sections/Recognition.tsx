import { badgeRoster } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface RecognitionStudioProps {
  persona: Persona;
}

export function RecognitionStudio({ persona }: RecognitionStudioProps) {
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Recognition"
        persona={isCoach ? 'coach' : 'client'}
        title="Badges that feel human"
        description={
          isCoach
            ? 'Draft a quick badge message and let the system grant it when the habit sticks.'
            : 'See the badges you have earned and the ones quietly tracking.'
        }
      />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <Card variant="accent" className="p-6">
          <p className="text-sm text-slate-600">Current draft</p>
          <p className="mt-2 text-lg font-semibold text-ink">{badgeRoster.coachComposer.draftName}</p>
          <p className="mt-2 text-sm text-slate-600">{badgeRoster.coachComposer.draftMessage}</p>
          <div className="mt-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-300 px-4 py-3 text-sm text-white">
            {badgeRoster.coachComposer.autoRule}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-ink">Badge shelf</p>
          <div className="mt-3 space-y-3">
            {badgeRoster.clientBadges.map((badge) => (
              <div key={badge.id} className="rounded-2xl border border-slate-100 bg-white px-3 py-2">
                <p className="text-sm font-medium text-ink">{badge.name}</p>
                <p className="text-xs text-slate-500">{badge.status} · {badge.grantedBy}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
