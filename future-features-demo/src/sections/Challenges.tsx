import { challenges } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
import { Badge } from '../components/Badge';

interface ChallengesBoardProps {
  persona: Persona;
}

const statusCopy = {
  'in-progress': { label: 'In progress', tone: 'highlight' as const },
  upcoming: { label: 'Upcoming', tone: 'soft' as const },
  completed: { label: 'Wrapped', tone: 'default' as const },
};

export function ChallengesBoard({ persona }: ChallengesBoardProps) {
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Challenges"
        persona="all"
        title="Inclusive challenges with gentle accountability"
        description="Preview lightweight challenge cards that trade leaderboards for encouragement and badges."
        actions={
          isCoach ? (
            <button className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/20">
              Compose new challenge ↗
            </button>
          ) : null
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {challenges.map((challenge, index) => (
          <Reveal key={challenge.id} delay={index * 0.1}>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <Badge tone={statusCopy[challenge.status].tone}>{statusCopy[challenge.status].label}</Badge>
                <span className="text-[11px] uppercase tracking-[0.22em] text-white/40">Completion</span>
              </div>
              <p className="mt-4 text-lg font-semibold text-white">{challenge.title}</p>
              <p className="mt-2 text-sm text-white/65">{challenge.description}</p>
              <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-lavender-500/70 to-aqua-500/70"
                  style={{ width: `${challenge.completion}%` }}
                />
              </div>
              {challenge.status === 'upcoming' && challenge.kickoff ? (
                <p className="mt-3 text-xs text-white/55">{challenge.kickoff}</p>
              ) : null}
              {challenge.coachNote ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
                  <p className="font-semibold text-white">Coach note</p>
                  <p className="mt-1">{challenge.coachNote}</p>
                </div>
              ) : null}
            </Card>
          </Reveal>
        ))}
      </div>
      {isCoach ? (
        <Reveal delay={0.2}>
          <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Auto-grant badges</p>
              <p className="text-xs text-white/60">Select a completion badge and set the shout-out cadence.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {['Completion badge', 'Coach shout-out', 'Recap postcard'].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold text-white/70">
                  {item}
                </span>
              ))}
            </div>
          </Card>
        </Reveal>
      ) : null}
    </div>
  );
}
