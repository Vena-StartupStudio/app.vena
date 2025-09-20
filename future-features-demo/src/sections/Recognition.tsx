import { badgeRoster } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
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
        title="Badges that feel thoughtful"
        description={
          isCoach
            ? 'Draft, preview, and grant badges with warmth. Automations stay subtle so it never feels gameified.'
            : 'Your badge shelf celebrates steady habits. Nothing loud—just gentle reminders you are showing up.'
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Reveal>
          <Card variant="accent" className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge tone="highlight">Badge composer</Badge>
              <span className="text-xs text-white/60">Live preview updates instantly</span>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Badge name</label>
                <div className="mt-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/80">
                  {badgeRoster.coachComposer.draftName}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Message</label>
                <div className="mt-2 rounded-3xl border border-white/15 bg-white/10 p-4 text-sm text-white/70">
                  {badgeRoster.coachComposer.draftMessage}
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
                  <p className="font-semibold text-white">Auto rule</p>
                  <p className="mt-1">{badgeRoster.coachComposer.autoRule}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
                  <p className="font-semibold text-white">Palette</p>
                  <div className="mt-3 h-10 w-full rounded-full bg-gradient-to-r from-lavender-500/70 to-aqua-400/70 shadow-glow" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/60">
              {['Preview badge card', 'Send manual shout-out', 'Schedule auto grant'].map((action) => (
                <span key={action} className="rounded-full border border-white/10 bg-white/10 px-4 py-1 font-semibold">
                  {action}
                </span>
              ))}
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.12}>
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Badge shelf</p>
            <div className="mt-4 space-y-3">
              {badgeRoster.clientBadges.map((badge) => (
                <div key={badge.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{badge.name}</p>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">{badge.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/60">Granted by {badge.grantedBy}</p>
                </div>
              ))}
            </div>
            <button className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15">
              View badge history ↗
            </button>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
