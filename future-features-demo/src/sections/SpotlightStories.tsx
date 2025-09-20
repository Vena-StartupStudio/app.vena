import { spotlightStories } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface SpotlightStoriesProps {
  persona: Persona;
}

export function SpotlightStories({ persona }: SpotlightStoriesProps) {
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Spotlight"
        persona="all"
        title="Stories with heart"
        description="Quick lifestyle snapshots that celebrate consistency and keep the community inspired."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {spotlightStories.map((story) => (
          <Card key={story.id} className="space-y-3 p-5">
            <Badge tone="highlight">{story.focus}</Badge>
            <p className="text-sm font-semibold text-ink">{story.member}</p>
            <p className="text-sm text-slate-600">“{story.quote}”</p>
            <p className="text-xs text-slate-500">{story.coachNote}</p>
          </Card>
        ))}
      </div>
      <Card variant="subtle" className="p-5">
        <p className="text-sm font-semibold text-ink">{isCoach ? 'Coach reminder' : 'Community tip'}</p>
        <p className="text-sm text-slate-600">
          {isCoach
            ? 'Keep stories focused on everyday wins. Toggle consent right from this view.'
            : 'Tap “Send cheer” to leave a quick encouragement without writing a long post.'}
        </p>
      </Card>
    </div>
  );
}
