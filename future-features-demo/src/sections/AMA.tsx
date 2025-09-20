import { amaQueue } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
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
        title="Ask and answer"
        description={
          isCoach
            ? 'Queue questions, drop a single audio note, and publish to the lounge.'
            : 'Submit your curiosity and catch the coach’s reply in one spot.'
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {amaQueue.map((item) => (
          <Card key={item.id} className="p-5">
            <Badge tone={item.status === 'Answered' ? 'highlight' : 'default'}>{item.status}</Badge>
            <p className="mt-3 text-sm font-semibold text-ink">{item.question}</p>
            <p className="mt-2 text-sm text-slate-600">{item.answerSummary}</p>
            {item.audioLength ? (
              <p className="mt-2 text-xs text-slate-500">Audio reply · {item.audioLength}</p>
            ) : null}
          </Card>
        ))}
      </div>
      {isCoach ? (
        <Card variant="subtle" className="p-5">
          <p className="text-sm font-semibold text-ink">Coach tip</p>
          <p className="text-sm text-slate-600">Batch answers on Thursday afternoon, then schedule the post for the evening.</p>
        </Card>
      ) : (
        <Card variant="subtle" className="p-5">
          <p className="text-sm font-semibold text-ink">Share a question</p>
          <p className="text-sm text-slate-600">Keep it simple—movement, meals, mindset. Coach will reply during the AMA drop.</p>
        </Card>
      )}
    </div>
  );
}
