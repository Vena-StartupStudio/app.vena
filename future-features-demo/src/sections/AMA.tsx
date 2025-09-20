import { amaQueue } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
import { Badge } from '../components/Badge';

interface AMACornerProps {
  persona: Persona;
}

export function AMACorner({ persona }: AMACornerProps) {
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Monthly AMA"
        persona={isCoach ? 'coach' : 'client'}
        title="Ask-me-anything corner"
        description={
          isCoach
            ? 'Roll questions into a single post or a five-minute audio. Queue answers and drop them all at once.'
            : 'Submit your questions and catch the latest responses without digging through DMs.'
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Reveal>
          <div className="grid gap-4">
            {amaQueue.map((item, index) => (
              <Card key={item.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.question}</p>
                    <p className="text-xs text-white/60">Submitted by {item.from}</p>
                  </div>
                  <Badge tone={item.status === 'Answered' ? 'highlight' : 'soft'}>{item.status}</Badge>
                </div>
                {item.answerSummary ? (
                  <p className="mt-3 text-sm text-white/70">{item.answerSummary}</p>
                ) : null}
                {item.audioLength ? (
                  <p className="mt-3 text-xs text-white/50">Audio answer • {item.audioLength}</p>
                ) : null}
                {isCoach ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/60">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Tag for Friday drop</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Add transcript</span>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <Card className="p-6">
            {isCoach ? <CoachAmaPanel /> : <ClientAmaPanel />}
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

function CoachAmaPanel() {
  return (
    <div className="space-y-4 text-sm text-white/70">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Reply cadence</p>
        <p className="mt-2">Batch answers on Thursdays at 4:00 PM with auto publish to the lounge.</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <p className="font-semibold text-white">Prep checklist</p>
        <ul className="mt-1 space-y-1">
          <li>• Record main audio reply</li>
          <li>• Add bullet summary</li>
          <li>• Attach resources link</li>
        </ul>
      </div>
      <button className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-lavender-500/40 to-aqua-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:from-lavender-500/50 hover:to-aqua-500/50">
        Record 5 min audio ↗
      </button>
    </div>
  );
}

function ClientAmaPanel() {
  return (
    <div className="space-y-4 text-sm text-white/70">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Submit a question</p>
        <textarea
          className="min-h-[120px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
          placeholder="Ask the coach anything about recovery, mindset, or routines."
        />
      </div>
      <button className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15">
        Submit to AMA queue ↗
      </button>
      <p className="text-xs text-white/50">Coach drops replies Thursday evenings. Audio and transcript arrive together.</p>
    </div>
  );
}
