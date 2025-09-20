import { loungePosts } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Badge } from '../components/Badge';
import { useMemo } from 'react';

interface MembersLoungeProps {
  persona: Persona;
}

function IconHeart({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} aria-hidden>
      <path d="M20.8 4.6a5 5 0 00-7.1 0L12 6.3l-1.7-1.7a5 5 0 00-7.1 7.1L12 21.9l8.8-10.2a5 5 0 000-7.1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MembersLounge({ persona }: MembersLoungeProps) {
  const isCoach = persona === 'coach';

  // colorful stats derived from posts
  const stats = useMemo(() => {
    const total = loungePosts.length;
    const topics = new Set<string>();
    loungePosts.forEach((p) => p.tags.forEach((t: string) => topics.add(t)));
    return { total, topics: topics.size };
  }, []);

  return (
    <section aria-labelledby="members-lounge" className="space-y-6">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-rose-50 via-indigo-50 to-amber-50 p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="members-lounge" className="text-2xl font-extrabold tracking-tight text-ink">Members' Lounge</h2>
            <p className="mt-1 text-sm text-slate-600 max-w-xl">
              {isCoach
                ? 'Create an upbeat space for unique content, playlists, and updates your members will love.'
                : "A friendly feed curated for you — highlights, nudges, and saved moments from your coach and peers."}
            </p>

            <div className="mt-4 flex gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-ink shadow-sm">
                <strong className="text-brand-600">{stats.total}</strong>
                posts
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-ink shadow-sm">
                <strong className="text-brand-600">{stats.topics}</strong>
                topics
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="lounge-search" className="sr-only">Search lounge</label>
            <input
              id="lounge-search"
              type="search"
              placeholder="Search posts, topics..."
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              aria-label="Search lounge posts"
            />

            <button className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-300" aria-label="Create post">
              Create
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loungePosts.map((post) => (
          <article
            key={post.id}
            aria-labelledby={`post-${post.id}-title`}
            className="group rounded-2xl overflow-hidden bg-white shadow-lg transition-transform hover:-translate-y-1"
          >
            <div className="relative h-40 w-full overflow-hidden bg-slate-100">
              <img
                src={`https://picsum.photos/seed/${encodeURIComponent(String(post.id))}/800/600`}
                alt={post.title}
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute left-4 top-4 flex items-center gap-3 rounded-full bg-white/70 px-2 py-1 backdrop-blur">
                <img
                  src={`https://i.pravatar.cc/40?u=${encodeURIComponent(post.author)}`}
                  alt={`${post.author} avatar`}
                  className="h-8 w-8 rounded-full border border-white"
                />
                <div className="text-xs">
                  <p className="font-semibold text-ink">{post.author}</p>
                  <p className="text-[11px] text-slate-600">{post.role} · <span className="font-mono">{post.timestamp}</span></p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 id={`post-${post.id}-title`} className="text-sm font-bold text-ink line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">{post.body}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="rounded-full bg-gradient-to-r from-indigo-50 to-rose-50 px-2 py-1 text-[12px] font-semibold text-brand-600">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button aria-label={`Like ${post.title}`} className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-300">
                    <IconHeart />
                    <span className="text-xs">{(post as any).likes ?? 0}</span>
                  </button>
                  <button aria-label={`Save ${post.title}`} className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M6 2h12v20l-6-4-6 4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs">Save</span>
                  </button>
                </div>

                <a href="#" className="text-xs font-semibold text-brand-600 hover:underline" aria-label={`Read more about ${post.title}`}>
                  Read more →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center">
        <button className="rounded-full bg-gradient-to-r from-brand-500 to-brand-400 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-300">
          View all posts
        </button>
      </div>
    </section>
  );
}
