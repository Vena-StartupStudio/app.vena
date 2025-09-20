import { Fragment } from 'react';
import { loungePosts } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Reveal } from '../components/Reveal';
import { cn } from '../lib/utils';

interface MembersLoungeProps {
  persona: Persona;
}

export function MembersLounge({ persona }: MembersLoungeProps) {
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Community vibe"
        persona={isCoach ? 'coach' : 'client'}
        title="Members’ Lounge feed"
        description={
          isCoach
            ? 'Skim the broadcast hub, queue the next voice note, and keep an eye on who is celebrating wins.'
            : 'Fresh coach notes, tips, and playlists land here. React, leave a comment, or simply take it in.'
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {loungePosts.map((post, index) => (
            <Reveal key={post.id} delay={index * 0.1}>
              <Card className="bg-gradient-to-br from-slate-900/70 via-slate-900/30 to-slate-900/70">
                <div className="flex flex-col gap-4 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{post.title}</p>
                      <p className="text-xs text-white/60">
                        {post.author} • {post.role}
                      </p>
                    </div>
                    <Badge tone="soft">{post.timestamp}</Badge>
                  </div>
                  <p className="text-sm text-white/70">{post.body}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white/10 px-3 py-1">
                        #{tag}
                      </span>
                    ))}
                    {post.attachments.map((attachment, idx) => (
                      <span key={`${post.id}-attachment-${idx}`} className="rounded-full border border-white/10 px-3 py-1">
                        {attachment.label}
                      </span>
                    ))}
                    <span className="ml-auto inline-flex items-center gap-3">
                      <span>🎉 {post.reactions.celebrate}</span>
                      <span>💬 {post.reactions.comments}</span>
                      <span>👀 {post.seenBy}</span>
                    </span>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="space-y-4">
          {isCoach ? <CoachInsights /> : <ClientFilters />}
        </div>
      </div>
    </div>
  );
}

function CoachInsights() {
  return (
    <Fragment>
      <Reveal>
        <Card variant="accent" className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Broadcast controls</p>
          <div className="mt-4 space-y-4 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span>Auto-nudge new joiners</span>
              <Toggle ariaLabel="Toggle auto nudge" active />
            </div>
            <div className="flex items-center justify-between">
              <span>Pin hydration reminder</span>
              <Toggle ariaLabel="Pin hydration reminder" />
            </div>
          </div>
        </Card>
      </Reveal>
      <Reveal delay={0.1}>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Next in queue</p>
          <div className="mt-4 space-y-4 text-sm text-white/80">
            <div>
              <p className="font-medium text-white">Friday reset voice note</p>
              <p className="text-xs text-white/55">Draft saved • drops in 2 days</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/65">
              <p>Outline</p>
              <ul className="mt-2 space-y-1">
                <li>• Gratitude micro-journal</li>
                <li>• Hydration stretch combo</li>
                <li>• Weekend reset reflection</li>
              </ul>
            </div>
            <button className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10">
              Export preview card <span aria-hidden="true">↗</span>
            </button>
          </div>
        </Card>
      </Reveal>
    </Fragment>
  );
}

function ClientFilters() {
  return (
    <Fragment>
      <Reveal>
        <Card variant="accent" className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Quick filters</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['All posts', 'Movement', 'Recipes', 'Recovery', 'Playlists'].map((filter) => (
              <button
                key={filter}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/20"
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </Card>
      </Reveal>
      <Reveal delay={0.1}>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Coach spotlight</p>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>“Tag me when you wrap today’s walk + stretch. I’m handing out Recovery Champ badges all week.”</p>
            <p className="text-xs text-white/50">Coach Avery • Broadcasted to all clients</p>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/65">
            <p className="font-semibold text-white">Completion badges on deck</p>
            <ul className="mt-2 space-y-1">
              <li>• 7-day walk + stretch</li>
              <li>• Hydrate & pause</li>
              <li>• Recovery lounge wind-down</li>
            </ul>
          </div>
        </Card>
      </Reveal>
    </Fragment>
  );
}

interface ToggleProps {
  active?: boolean;
  ariaLabel: string;
}

function Toggle({ active = false, ariaLabel }: ToggleProps) {
  return (
    <span
      role="switch"
      aria-label={ariaLabel}
      aria-checked={active}
      className={cn(
        'inline-flex h-6 w-11 items-center rounded-full border border-white/10 transition-colors duration-300 ease-soft',
        active ? 'bg-gradient-to-r from-lavender-500/60 to-aqua-500/60' : 'bg-white/10'
      )}
    >
      <span
        className={cn(
          'ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-night transition-transform duration-300 ease-soft transform',
          active ? 'translate-x-5' : 'translate-x-0'
        )}
      >
        {active ? 'On' : ''}
      </span>
    </span>
  );
}
