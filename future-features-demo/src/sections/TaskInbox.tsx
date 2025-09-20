import { coachTasks } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface TaskInboxProps {
  persona: Persona;
}

export function TaskInbox({ persona }: TaskInboxProps) {
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Coach tools"
        persona="coach"
        title="Task inbox"
        description="A short list of nudges so the coach can stay responsive without juggling tabs."
      />
      <Card className="p-6">
        {isCoach ? (
          <div className="space-y-3">
            {coachTasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">{task.label}</p>
                  <Badge tone={task.priority === 'today' ? 'highlight' : 'default'}>{task.priority}</Badge>
                </div>
                <p className="text-xs text-slate-500">{task.context}</p>
                <p className="mt-1 text-xs text-slate-500">Estimated {task.effort}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Coaches see a focused task list here. Clients simply enjoy the shout-outs it powers.
          </p>
        )}
      </Card>
    </div>
  );
}
