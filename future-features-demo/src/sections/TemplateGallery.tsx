import { useState } from 'react';
import { templateKits } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
import { Badge } from '../components/Badge';

interface TemplateGalleryProps {
  persona: Persona;
}

export function TemplateGallery({ persona }: TemplateGalleryProps) {
  const [activeId, setActiveId] = useState(templateKits[0]?.id ?? '');
  const isCoach = persona === 'coach';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Template gallery"
        persona="coach"
        title="Launch-ready kits"
        description="Grab a starter pack, adjust the tone, and push it live without leaving the workspace."
      />
      {!isCoach ? (
        <Reveal>
          <Card className="p-6 text-sm text-white/70">
            This area lives in the coach workspace. Clients only see the finished challenges, AMAs, and postcards once they publish.
          </Card>
        </Reveal>
      ) : null}
      <div className={`grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] ${isCoach ? '' : 'pointer-events-none opacity-60'}`}>
        <Reveal>
          <Card className="p-6">
            <div className="grid gap-3 md:grid-cols-2">
              {templateKits.map((kit) => {
                const active = kit.id === activeId;
                return (
                  <button
                    key={kit.id}
                    type="button"
                    onClick={() => setActiveId(kit.id)}
                    className={`rounded-3xl border px-5 py-4 text-left transition duration-300 ease-soft ${
                      active
                        ? 'border-white/20 bg-gradient-to-br from-lavender-500/35 to-aqua-500/35 text-white shadow-soft'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{kit.name}</p>
                      {kit.tags.length > 0 ? <Badge tone="soft">{kit.tags[0]}</Badge> : null}
                    </div>
                    <p className="mt-2 text-xs text-white/60">{kit.summary}</p>
                  </button>
                );
              })}
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.12}>
          <Card className="flex h-full flex-col justify-between p-6">
            <SelectedKitDetails kitId={activeId} />
            <button className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15">
              Duplicate into workspace ↗
            </button>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

interface SelectedKitDetailsProps {
  kitId: string;
}

function SelectedKitDetails({ kitId }: SelectedKitDetailsProps) {
  const kit = templateKits.find((item) => item.id === kitId);
  if (!kit) return <p className="text-sm text-white/60">Select a kit to preview the contents.</p>;

  return (
    <div className="space-y-4 text-sm text-white/70">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Kit contents</p>
        <p className="mt-2 text-white">{kit.name}</p>
        <p className="mt-1 text-xs text-white/55">{kit.summary}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <p className="font-semibold text-white">Included blocks</p>
        <ul className="mt-2 space-y-1">
          <li>• Launch announcement</li>
          <li>• Follow-up nudges</li>
          <li>• Wrap recap</li>
          <li>• Optional postcard</li>
        </ul>
      </div>
    </div>
  );
}
