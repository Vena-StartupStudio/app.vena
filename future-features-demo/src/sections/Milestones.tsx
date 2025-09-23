import { milestones } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Badge } from '../components/Badge';

interface MilestonesPlannerProps {
  persona: Persona;
}

function IconTrophy() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 4V2h10v2" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 4h10v4a5 5 0 01-10 0V4z" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 6v2a5 5 0 005 5h6a5 5 0 005-5V6" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 19h6" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 22h4" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MilestonesPlanner({ persona }: MilestonesPlannerProps) {
  const isCoach = persona === 'coach';

  return (
    <section aria-labelledby="milestones-title" className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-indigo-50 p-6 shadow-lg flex items-center gap-4">
        <IconTrophy />
        <SectionHeader
          eyebrow="Milestones"
          persona={isCoach ? 'coach' : 'client'}
          title="Milestone Celebrations"
          description={
            isCoach
              ? 'Save and celebrate member milestones: "6 months at our studio", "2 months without skipping a session", and more. Choose a style and let the system post on time.'
              : 'See your progress and celebrate moments with the community. Save milestones and share your journey!'
          }
        />
      </div>
      <div className="rounded-2xl bg-white/90 shadow-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-600">Saved Milestones</span>
          <button className="rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-brand-300">Add milestone</button>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Milestones list">
          {milestones.map((milestone) => (
            <li key={milestone.id} className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-amber-50 px-5 py-4 shadow-sm transition-transform hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex-shrink-0">
                  <IconTrophy />
                </span>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-600">{milestone.milestone}</span>
              </div>
              <p className="text-sm font-semibold text-ink">{milestone.member}</p>
              <p className="text-xs text-slate-500 mt-1">{milestone.scheduledFor} · {milestone.channel}</p>
              <p className="mt-2 text-sm text-slate-600">{milestone.note}</p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-brand-300" aria-label={`Celebrate ${milestone.milestone}`}>Celebrate</button>
                <button className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 shadow focus:outline-none focus:ring-2 focus:ring-brand-300" aria-label={`Edit ${milestone.milestone}`}>Edit</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
