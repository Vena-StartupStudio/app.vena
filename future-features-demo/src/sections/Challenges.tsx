import { challenges } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface ChallengesBoardProps {
  persona: Persona;
}

const statusCopy = {
  'in-progress': { label: 'Live now', tone: 'highlight' as const },
  upcoming: { label: 'Next up', tone: 'default' as const },
};

export function ChallengesBoard({ persona }: ChallengesBoardProps) {
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Challenges"
        persona="all"
        title="Gentle group prompts"
        description="Keep everyone moving together with light-touch goals and badges—no leaderboard pressure."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{challenge.title}</p>
              <Badge tone={statusCopy[challenge.status as keyof typeof statusCopy]?.tone ?? 'default'}>
                {statusCopy[challenge.status as keyof typeof statusCopy]?.label ?? 'Complete'}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-slate-600">{challenge.description}</p>
            <div className="mt-4 h-1.5 w-full rounded-full bg-accent-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                style={{ width: `${challenge.completion}%` }}
              />
            </div>
            {challenge.kickoff ? (
              <p className="mt-2 text-xs text-slate-500">{challenge.kickoff}</p>
            ) : null}
          </Card>
        ))}
      </div>
      {isCoach ? (
        <Card variant="subtle" className="p-5">
          <p className="text-sm font-semibold text-ink">Coach tip</p>
          <p className="text-sm text-slate-600">Record a 20-second kickoff video when the next challenge flips to live.</p>
        </Card>
      ) : null}
    </div>
  );
}
