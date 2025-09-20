import { milestones } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
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
        title={isCoach ? 'Milestone planner' : 'Upcoming celebrations'}
        description={
          isCoach
            ? 'See who is approaching a big moment, confirm consent, and prep the accolades before they go live.'
            : 'Keep an eye on coach celebrations that are about to feature you or your peers.'
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Reveal>
          <Card className="p-6">
            <ol className="relative space-y-6 border-l border-dashed border-white/10 pl-6">
              {milestones.map((milestone, index) => (
                <li key={milestone.id} className="relative">
                  <span className="absolute -left-3.5 mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-lavender-500 to-aqua-500 shadow-glow" />
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-semibold text-white">{milestone.member}</p>
                      <Badge tone={milestone.optIn ? 'highlight' : 'soft'}>
                        {milestone.milestone}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70">{milestone.channel}</p>
                    <p className="text-xs text-white/50">{milestone.scheduledFor}</p>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/65">
                      <p className="font-semibold text-white">Prep note</p>
                      <p className="mt-1">{milestone.note}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </Reveal>
        <Reveal delay={0.12}>
          <Card className="flex h-full flex-col justify-between gap-6 p-6">
            {isCoach ? <CoachSummary /> : <ClientSummary />}
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

function CoachSummary() {
  return (
    <div className="space-y-4 text-sm text-white/70">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Consent status</p>
        <div className="mt-3 space-y-2">
          <StatusRow label="Opted-in" value="2" />
          <StatusRow label="Awaiting toggle" value="1" />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Automation</p>
        <p className="mt-2">Milestone cards auto-publish with a coach review step 6 hours before go-live.</p>
      </div>
      <button className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15">
        Queue celebration assets ↗
      </button>
    </div>
  );
}

function ClientSummary() {
  return (
    <div className="space-y-4 text-sm text-white/70">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Heads up</p>
        <p className="mt-2">You are featured next Wednesday in a spotlight story. Toggle consent anytime from your profile.</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <p className="font-semibold text-white">Opt-in controls</p>
        <p className="mt-1">A quick toggle keeps you in the loop. We only showcase stories when you say yes.</p>
      </div>
      <button className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15">
        Review my spotlight settings ↗
      </button>
    </div>
  );
}

interface StatusRowProps {
  label: string;
  value: string;
}

function StatusRow({ label, value }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
      <span>{label}</span>
      <span className="text-white/40">{value}</span>
    </div>
  );
}
