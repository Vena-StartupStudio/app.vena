import { coachTasks } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
import { Badge } from '../components/Badge';

interface TaskInboxProps {
  persona: Persona;
}

export function TaskInbox({ persona }: TaskInboxProps) {
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Pro tools"
        persona="coach"
        title="Task inbox"
        description="Morning brief automatically compiles the handful of actions that keep the community humming."
      />
      <Reveal>
        <Card className="p-6">
          {isCoach ? <CoachTaskList /> : <ClientPlaceholder />}
        </Card>
      </Reveal>
    </div>
  );
}

function CoachTaskList() {
  return (
    <div className="space-y-4">
      {coachTasks.map((task) => (
        <div key={task.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{task.label}</p>
              <p className="text-xs text-white/50">{task.context}</p>
            </div>
            <Badge tone={task.priority === 'today' ? 'highlight' : 'soft'}>
              {task.priority}
            </Badge>
          </div>
          <p className="mt-3 text-xs text-white/60">Estimated effort • {task.effort}</p>
        </div>
      ))}
      <button className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15">
        Sync to calendar ↗
      </button>
    </div>
  );
}

function ClientPlaceholder() {
  return (
    <div className="space-y-4 text-sm text-white/70">
      <p>This space is part of the coach workspace. Clients only see gentle nudges and badges—not the task queue.</p>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <p className="font-semibold text-white">Why it matters</p>
        <p className="mt-1">Smart suggestions keep your coach responsive without needing extra tools.</p>
      </div>
    </div>
  );
}
