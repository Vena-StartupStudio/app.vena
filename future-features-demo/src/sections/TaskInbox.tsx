import { coachTasks } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Badge } from '../components/Badge';

interface TaskInboxProps {
  persona: Persona;
}

function IconCheck({ done = false }: { done?: boolean }) {
  return done ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#4ade80" />
      <path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#fbbf24" />
      <path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TaskInbox({ persona }: TaskInboxProps) {
  const isCoach = persona === 'coach';

  return (
    <section aria-labelledby="task-inbox" className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50 via-rose-50 to-amber-50 p-6 shadow-lg">
        <SectionHeader
          eyebrow="Coach tools"
          persona="coach"
          title="Task Inbox"
          description="Stay responsive with a focused, actionable list. Mark tasks done, filter by priority, and keep your coaching on track."
        />
      </div>
      <div className="rounded-2xl bg-white/90 shadow-lg p-6">
        {isCoach ? (
          <div className="space-y-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-brand-600">Today's tasks</span>
              <button className="rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-brand-300">Add task</button>
            </div>
            <ul className="space-y-3" aria-label="Coach tasks">
              {coachTasks.map((task) => (
                <li key={task.id} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-gradient-to-r from-white via-slate-50 to-brand-50 px-4 py-3 shadow-sm transition-transform hover:-translate-y-0.5">
                  <span className="flex-shrink-0">
                    <IconCheck done={(task as any).status === 'done'} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink line-clamp-2">{task.label}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{task.context}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge tone={task.priority === 'today' ? 'highlight' : 'default'}>{task.priority}</Badge>
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-600">{task.effort}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-brand-300"
                      aria-label={`Mark ${task.label} as done`}
                      disabled={(task as any).status === 'done'}
                    >
                      {(task as any).status === 'done' ? 'Done' : 'Mark done'}
                    </button>
                    <button
                      className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 shadow focus:outline-none focus:ring-2 focus:ring-brand-300"
                      aria-label={`Edit ${task.label}`}
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <span className="text-4xl">🎉</span>
            <p className="text-sm text-slate-600 text-center max-w-xs">
              Coaches see a focused task list here. Clients simply enjoy the shout-outs it powers.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
