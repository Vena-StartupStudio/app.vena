import { useCallback, useEffect, useState } from 'react';
import { Shell } from './components/Shell';
import type { Persona } from './lib/theme';
import { personaHighlights } from './data/content';
import { MembersLounge } from './sections/MembersLounge';
import { WeeklyPicks } from './sections/WeeklyPicks';
import { ChallengesBoard } from './sections/Challenges';
import { MilestonesPlanner } from './sections/Milestones';
import { AMACorner } from './sections/AMA';
import { SpotlightStories } from './sections/SpotlightStories';
import { RecognitionStudio } from './sections/Recognition';
import { TaskInbox } from './sections/TaskInbox';
import { TemplateGallery } from './sections/TemplateGallery';

const NAV_SECTIONS = [
  {
    id: 'lounge',
    label: "Members' Lounge",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 8h10M7 12h6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 4h14a2 2 0 0 1 2 2v12l-4-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'weekly',
    label: 'Weekly Picks',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 5h14v14H5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 9h6M9 12h3M9 15h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'challenges',
    label: 'Challenges',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 12l9 4.5 9-4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 16.5 12 21l9-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'milestones',
    label: 'Milestone Moments',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 12 12 6l6 6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 18h12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'ama',
    label: 'Monthly AMA',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m7 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 13v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'spotlight',
    label: 'Spotlight Stories',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 5.5v13" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 16.5v2M15 16.5v2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 7.5 12 5l5 2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'badges',
    label: 'Recognition',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3 7 5v6a5 5 0 0 0 10 0V5l-5-2Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m8 16-1 5 5-2 5 2-1-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'tasks',
    label: 'Task Inbox',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 3h12a2 2 0 0 1 2 2v14l-4-3H8l-4 3V5a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'templates',
    label: 'Template Gallery',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16v16H4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 9h16" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 20V9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const;

const SECTION_IDS = NAV_SECTIONS.map((section) => section.id);

export default function App() {
  const [persona, setPersona] = useState<Persona>('coach');
  const [activeSection, setActiveSection] = useState<string>(NAV_SECTIONS[0].id);

  const handleScrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const first = visibleSections[0];
        if (first) {
          const id = first.target.getAttribute('data-shell-section');
          if (id && SECTION_IDS.includes(id) && id !== activeSection) {
            setActiveSection(id);
          }
        }
      },
      { threshold: [0.4, 0.6, 0.75], rootMargin: '-10% 0px -20% 0px' }
    );

    const sections = document.querySelectorAll('[data-shell-section]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [activeSection]);

  return (
    <Shell
      persona={persona}
      onPersonaChange={setPersona}
      sections={NAV_SECTIONS}
      activeSection={activeSection}
      onScrollToSection={handleScrollToSection}
      highlights={personaHighlights[persona]}
    >
      <section id="lounge" data-shell-section="lounge">
        <MembersLounge persona={persona} />
      </section>
      <section id="weekly" data-shell-section="weekly">
        <WeeklyPicks persona={persona} />
      </section>
      <section id="challenges" data-shell-section="challenges">
        <ChallengesBoard persona={persona} />
      </section>
      <section id="milestones" data-shell-section="milestones">
        <MilestonesPlanner persona={persona} />
      </section>
      <section id="ama" data-shell-section="ama">
        <AMACorner persona={persona} />
      </section>
      <section id="spotlight" data-shell-section="spotlight">
        <SpotlightStories persona={persona} />
      </section>
      <section id="badges" data-shell-section="badges">
        <RecognitionStudio persona={persona} />
      </section>
      <section id="tasks" data-shell-section="tasks">
        <TaskInbox persona={persona} />
      </section>
      <section id="templates" data-shell-section="templates">
        <TemplateGallery persona={persona} />
      </section>
    </Shell>
  );
}
