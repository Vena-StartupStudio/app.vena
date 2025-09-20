import { useState, useEffect } from 'react';
import { Shell } from './components/Shell';
import type { Persona } from './lib/theme';
import { personaHighlights } from './data/content';
import { MembersLounge } from './sections/MembersLounge';
import { WeeklyPicks } from './sections/WeeklyPicks';
import { ChallengesBoard } from './sections/Challenges';
import { MilestonesPlanner } from './sections/Milestones';
import { AMACorner } from './sections/AMA';
import { TaskInbox } from './sections/TaskInbox';

const TABS = [
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
    label: 'Milestones',
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
    id: 'tasks',
    label: 'Task Inbox',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 3h12a2 2 0 0 1 2 2v14l-4-3H8l-4 3V5a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const;

const TAB_COMPONENTS = {
  lounge: MembersLounge,
  weekly: WeeklyPicks,
  challenges: ChallengesBoard,
  milestones: MilestonesPlanner,
  ama: AMACorner,
  tasks: TaskInbox,
} as const;

export default function App() {
  const [persona, setPersona] = useState<Persona>('coach');
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousTab, setPreviousTab] = useState<string>(TABS[0].id);

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;

    setPreviousTab(activeTab);
    setIsTransitioning(true);

    // Add a small delay for smooth transition
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTransitioning(false);
    }, 200);
  };

  const ActiveView = TAB_COMPONENTS[activeTab as keyof typeof TAB_COMPONENTS] ?? MembersLounge;
  const PreviousView = TAB_COMPONENTS[previousTab as keyof typeof TAB_COMPONENTS] ?? MembersLounge;

  return (
    <Shell
      persona={persona}
      onPersonaChange={setPersona}
      tabs={[...TABS]}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      highlights={personaHighlights[persona]}
    >
      <div className="relative min-h-[400px]">
        {/* Previous tab content (fading out) */}
        {isTransitioning && (
          <div
            key={`prev-${previousTab}`}
            className="absolute inset-0 animate-fade-out opacity-0"
            style={{ animationFillMode: 'forwards' }}
          >
            <PreviousView persona={persona} />
          </div>
        )}

        {/* Active tab content (fading in) */}
        <div
          key={`active-${activeTab}`}
          className={`transition-all duration-500 ease-out ${
            isTransitioning ? 'opacity-0 translate-y-4 scale-98' : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <ActiveView persona={persona} />
        </div>

        {/* Subtle shimmer effect during transition */}
        {isTransitioning && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        )}
      </div>
    </Shell>
  );
}
