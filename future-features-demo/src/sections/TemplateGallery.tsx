import { useState } from 'react';
import { templateKits } from '../data/content';
import type { Persona } from '../lib/theme';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface TemplateGalleryProps {
  persona: Persona;
}

export function TemplateGallery({ persona }: TemplateGalleryProps) {
  const [activeId, setActiveId] = useState(templateKits[0]?.id ?? '');
  const isCoach = persona === 'coach';

  if (!isCoach) {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Templates"
          persona="coach"
          title="Template gallery"
          description="This view is coach-only. Clients will see the polished posts once published."
        />
        <Card className="p-6">
          <p className="text-sm text-slate-600">Ask your coach to show you how launch kits work behind the scenes.</p>
        </Card>
      </div>
    );
  }

  const activeKit = templateKits.find((kit) => kit.id === activeId) ?? templateKits[0];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Templates"
        persona="coach"
        title="Ready-made kits"
        description="Duplicate a kit, tweak a line or two, and ship a polished experience in minutes."
      />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <Card className="p-6">
          <div className="grid gap-3 md:grid-cols-2">
            {templateKits.map((kit) => {
              const active = kit.id === activeId;
              return (
                <button
                  key={kit.id}
                  type="button"
                  onClick={() => setActiveId(kit.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? 'border-transparent bg-gradient-to-r from-brand-100 to-accent-100 shadow-soft'
                      : 'border-slate-100 bg-white hover:border-brand-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">{kit.name}</p>
                    {kit.tags[0] ? <Badge tone="soft">{kit.tags[0]}</Badge> : null}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{kit.summary}</p>
                </button>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-ink">{activeKit.name}</p>
          <p className="mt-2 text-sm text-slate-600">{activeKit.summary}</p>
          <div className="mt-4 space-y-1 text-xs text-slate-500">
            <p>- Launch announcement</p>
            <p>- Follow-up nudges</p>
            <p>- Wrap recap</p>
            <p>- Optional postcard</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
