import React, { useState, useCallback, useRef } from 'react';

// --- TYPES & CONSTANTS ---

const FONT_THEMES = {
  default: {
    name: { en: 'Vena', he: 'וֶנָה' },
    heading: "[font-family:'Poppins',Inter,system-ui,sans-serif]",
    body: "[font-family:Inter,system-ui,sans-serif]",
    lang: ['en'] as const,
  },
  serif: {
    name: { en: 'Elegant Serif', he: 'סריף אלגנטי' },
    heading: "[font-family:'Playfair Display',serif]",
    body: "[font-family:'Lora',serif]",
    lang: ['en'] as const,
  },
  modern: {
    name: { en: 'Modern Sans', he: 'סאנס מודרני' },
    heading: "[font-family:'Montserrat',sans-serif]",
    body: "[font-family:'Lato',sans-serif]",
    lang: ['en'] as const,
  },
  minimal: {
    name: { en: 'Minimalist', he: 'מינימליסטי' },
    heading: "[font-family:'Roboto',sans-serif]",
    body: "[font-family:'Roboto',sans-serif]",
    lang: ['en'] as const,
  },
  hebrew_default: {
    name: { en: 'Hebrew (Default)', he: 'עברית (ברירת מחדל)' },
    heading: "[font-family:'Heebo','Assistant',system-ui,sans-serif]",
    body: "[font-family:'Assistant','Heebo',system-ui,sans-serif]",
    lang: ['he'] as const,
  },
  hebrew_serif: {
    name: { en: 'Hebrew (Serif)', he: 'עברית (סריף)' },
    heading: "[font-family:'Frank Ruhl Libre','Heebo',serif]",
    body: "[font-family:'Assistant',system-ui,sans-serif]",
    lang: ['he'] as const,
  },
  hebrew_rounded: {
    name: { en: 'Hebrew (Rounded)', he: 'עברית (מעוגל)' },
    heading: "[font-family:'Varela Round','Rubik',sans-serif]",
    body: "[font-family:'Rubik','Assistant',sans-serif]",
    lang: ['he'] as const,
  }
} as const;


type FontThemeKey = keyof typeof FONT_THEMES;

const COLOR_PALETTE = {
  primary: ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-rose-600', 'bg-slate-800'],
  secondary: ['text-blue-600', 'text-emerald-600', 'text-purple-600', 'text-rose-600', 'text-slate-600'],
  background: ['bg-white', 'bg-slate-50', 'bg-gray-100', 'bg-zinc-100', 'bg-stone-50'],
};

const OPACITY_OPTIONS = ['bg-opacity-100', 'bg-opacity-90', 'bg-opacity-80', 'bg-opacity-70'];

// Default placeholder for first load
const INITIAL_PLACEHOLDER_IMAGE = 'https://i.imgur.com/rS42r8s.png';

const HEBREW_TRANSLATIONS = {
  aboutMe: 'עליי',
  myServices: 'השירותים שלי',
  whatPeopleAreSaying: 'מה אומרים עלי',
  getInTouch: 'צרו קשר',
  poweredBy: 'נוצר באמצעות Vena'
};

type SectionId = 'about' | 'services' | 'testimonials' | 'contact';

interface Service {
  id: number;
  title: string;
  description: string;
}

interface Testimonial {
  id: number;
  quote: string;
  author: string;
}

interface ProfileConfig {
  templateId: string;
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  cta: {
    label: string;
  };
  services: Service[];
  testimonials: Testimonial[];
  sections: SectionId[];
  sectionVisibility: Record<SectionId, boolean>;
  styles: {
    fontPairing: FontThemeKey;
    fontHeading: string;
    fontBody: string;
    colorPrimary: string;
    colorSecondary: string;
    colorBackground: string;
    backgroundOpacity: string;
  };
}

const BASE_DEFAULT_CONFIG: Omit<ProfileConfig, 'styles'> = {
  templateId: 'scratch',
  name: 'Your Name',
  title: 'Wellness Professional',
  bio: 'Welcome to my wellness space. Here, I share my passion for helping others achieve balance and health through personalized programs and guidance.',
  profileImage: INITIAL_PLACEHOLDER_IMAGE,
  cta: { label: 'Book a Session' },
  services: [
    { id: 1, title: '1-on-1 Physiotherapy', description: 'Personalized sessions to address your specific needs and goals.' },
    { id: 2, title: 'Group Yoga Class', description: 'Join our community for a revitalizing group yoga experience.' },
    { id: 3, title: 'Nutrition Planning', description: 'Custom meal plans to complement your wellness journey.' },
  ],
  testimonials: [
    { id: 1, quote: 'An amazing experience! I feel more connected to my body than ever before.', author: 'Alex Johnson' },
    { id: 2, quote: 'The guidance was professional, insightful, and truly transformative.', author: 'Samantha Bee' },
  ],
  sections: ['about', 'services', 'testimonials', 'contact'],
  sectionVisibility: { about: true, services: true, testimonials: true, contact: true },
};

const getInitialConfig = (language: 'en' | 'he'): ProfileConfig => {
  if (language === 'he') {
    return {
      ...BASE_DEFAULT_CONFIG,
      name: 'שמך המלא',
      title: 'מקצוען בתחום הבריאות',
      bio: 'ברוכים הבאים למרחב הבריאות שלי. כאן, אני חולק/ת את התשוקה שלי לעזור לאחרים להשיג איזון ובריאות באמצעות תוכניות והכוונה אישית.',
      cta: { label: 'קבע פגישה' },
      styles: {
        fontPairing: 'hebrew_default',
        fontHeading: FONT_THEMES.hebrew_default.heading,
        fontBody: FONT_THEMES.hebrew_default.body,
        colorPrimary: COLOR_PALETTE.primary[0],
        colorSecondary: COLOR_PALETTE.secondary[0],
        colorBackground: COLOR_PALETTE.background[0],
        backgroundOpacity: OPACITY_OPTIONS[0],
      },
    };
  }
  return {
    ...BASE_DEFAULT_CONFIG,
    styles: {
      fontPairing: 'default',
      fontHeading: FONT_THEMES.default.heading,
      fontBody: FONT_THEMES.default.body,
      colorPrimary: COLOR_PALETTE.primary[0],
      colorSecondary: COLOR_PALETTE.secondary[0],
      colorBackground: COLOR_PALETTE.background[0],
      backgroundOpacity: OPACITY_OPTIONS[0],
    },
  };
};

const TEMPLATES: Record<string, Partial<ProfileConfig>> = {
  minimalist: { templateId: 'minimalist', styles: { ...(getInitialConfig('en').styles), fontPairing: 'minimal', fontHeading: FONT_THEMES.minimal.heading, fontBody: FONT_THEMES.minimal.body, colorPrimary: 'bg-slate-800', colorSecondary: 'text-slate-600', colorBackground: 'bg-white' }, sections: ['about', 'services', 'contact'] },
  vibrant: { templateId: 'vibrant', styles: { ...(getInitialConfig('en').styles), fontPairing: 'modern', fontHeading: FONT_THEMES.modern.heading, fontBody: FONT_THEMES.modern.body, colorPrimary: 'bg-emerald-600', colorSecondary: 'text-emerald-600', colorBackground: 'bg-slate-50' }, sections: ['about', 'testimonials', 'services', 'contact'] },
  professional: { templateId: 'professional', styles: { ...(getInitialConfig('en').styles), fontPairing: 'serif', fontHeading: FONT_THEMES.serif.heading, fontBody: FONT_THEMES.serif.body, colorPrimary: 'bg-blue-600', colorSecondary: 'text-blue-600', colorBackground: 'bg-gray-100' }, sections: ['services', 'about', 'testimonials', 'contact'] },
};

// --- ICONS ---
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>);
const DesktopIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const TabletIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
const MobileIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
const DragHandleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>);
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);

// --- HELPER COMPONENTS ---

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }> = ({ title, children, isOpen, onToggle }) => (
    <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg transition-all duration-300">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            <button type="button" onClick={onToggle} className="flex items-center justify-between w-full p-4 text-left font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors rounded-lg" aria-expanded={isOpen}>
                <span>{title}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 text-slate-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </h3>
        <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
                <div className="p-4 pt-0 space-y-6">{children}</div>
            </div>
        </div>
    </div>
);

const FormLabel: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className = ''}) => (
    <label className={`block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 ${className}`}>{children}</label>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700/50 border-transparent focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none" />
);

const ColorSwatch: React.FC<{ color: string; isSelected: boolean; onClick: () => void }> = ({ color, isSelected, onClick }) => (
    <button type="button" onClick={onClick} className={`w-8 h-8 rounded-full transition-transform transform focus:outline-none ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-800' : 'hover:scale-110'} ${color.startsWith('text-') ? `border-2 ${color}` : color}`} aria-label={`Select color ${color}`}>
        {isSelected && color.startsWith('text-') && <span className="flex items-center justify-center w-full h-full rounded-full text-white text-xs">{color.replace('text-','').charAt(0).toUpperCase()}</span>}
    </button>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div className={`block w-12 h-7 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
        </div>
    </label>
);

// --- MAIN EDITOR COMPONENT ---

const VenaProfileEditor: React.FC<{ language: 'en' | 'he' }> = ({ language }) => {
  const [config, setConfig] = useState<ProfileConfig>(() => getInitialConfig(language));
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string>('Templates');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const draggedItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FIX: Replaced the one-line implementation with a more type-safe version that explicitly merges styles.
  // This resolves a subtle TypeScript error where spreading a partial template could lead to an invalid state type.
  const handleTemplateChange = (templateKey: string) => {
    if (templateKey === 'scratch') {
      setConfig(getInitialConfig(language));
    } else {
      const template = TEMPLATES[templateKey];
      if (template) {
        setConfig(prev => ({
          ...prev,
          ...template,
          styles: {
            ...prev.styles,
            ...(template.styles || {}),
          },
          templateId: templateKey,
        }));
      }
    }
  };
  const handleAccordionToggle = (title: string) => { setActiveAccordion(prev => (prev === title ? '' : title)); };
  const handleStyleChange = <K extends keyof ProfileConfig['styles'], >(key: K, value: ProfileConfig['styles'][K]) => setConfig(prev => ({ ...prev, styles: { ...prev.styles, [key]: value }}));
  const handleFontThemeChange = (themeKey: FontThemeKey) => {
    const theme = FONT_THEMES[themeKey];
    setConfig(prev => ({ ...prev, styles: { ...prev.styles, fontPairing: themeKey, fontHeading: theme.heading, fontBody: theme.body } }));
  };
  const handleValueChange = <K extends keyof ProfileConfig, >(key: K, value: ProfileConfig[K]) => setConfig(prev => ({ ...prev, [key]: value }));
  const handleSectionVisibilityChange = (sectionId: SectionId, isVisible: boolean) => setConfig(prev => ({ ...prev, sectionVisibility: { ...prev.sectionVisibility, [sectionId]: isVisible }}));

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setConfig(prev => ({...prev, profileImage: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragSort = () => {
    if (draggedItem.current === null || dragOverItem.current === null) return;
    const newSections = [...config.sections];
    const [reorderedItem] = newSections.splice(draggedItem.current, 1);
    newSections.splice(dragOverItem.current, 0, reorderedItem);
    draggedItem.current = null;
    dragOverItem.current = null;
    setConfig(prev => ({ ...prev, sections: newSections }));
  };
  
  const isRtl = language === 'he';

  const ProfileImage = useCallback(() => {
    return (
      <div className="relative w-32 h-32 mx-auto group">
        <img src={config.profileImage} alt={config.name} className="w-32 h-32 rounded-full object-cover shadow-lg mx-auto" />
        {!isPreviewMode && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Upload new profile image"
          >
            <UploadIcon className="w-8 h-8" />
          </button>
        )}
      </div>
    );
  }, [config.profileImage, config.name, isPreviewMode]);
  
  const deviceWidths: Record<typeof previewDevice, string> = { desktop: '100%', tablet: '768px', mobile: '375px' };

  const renderSection = (sectionId: SectionId) => {
    if (!config.sectionVisibility[sectionId]) return null;
    const SectionWrapper: React.FC<{ children: React.ReactNode, id: string }> = ({ children, id }) => (<section id={id} className="py-12 px-4 sm:px-6 lg:px-8">{children}</section>);
    switch (sectionId) {
      case 'about': return <SectionWrapper key="about" id="about"><h2 className={`${config.styles.fontHeading} text-3xl font-bold text-center mb-4 text-slate-900`}>{isRtl ? HEBREW_TRANSLATIONS.aboutMe : 'About Me'}</h2>
        {isPreviewMode ? (
            <p className={`${config.styles.fontBody} text-lg text-slate-600 max-w-3xl mx-auto text-center leading-relaxed`}>{config.bio}</p>
        ) : (
            <textarea
                value={config.bio}
                onChange={e => handleValueChange('bio', e.target.value)}
                className={`${config.styles.fontBody} text-lg text-slate-600 max-w-3xl mx-auto text-center leading-relaxed bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md w-full resize-none p-2`}
                rows={4}
            />
        )}
      </SectionWrapper>;
      case 'services': return <SectionWrapper key="services" id="services"><h2 className={`${config.styles.fontHeading} text-3xl font-bold text-center mb-8 text-slate-900`}>{isRtl ? HEBREW_TRANSLATIONS.myServices : 'My Services'}</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">{config.services.map(service => (<div key={service.id} className="bg-white/50 p-6 rounded-lg shadow-md"><h3 className={`${config.styles.fontHeading} text-xl font-semibold mb-2 text-slate-800`}>{service.title}</h3><p className={`${config.styles.fontBody} text-slate-600`}>{service.description}</p></div>))}</div></SectionWrapper>;
      case 'testimonials': return <SectionWrapper key="testimonials" id="testimonials"><h2 className={`${config.styles.fontHeading} text-3xl font-bold text-center mb-8 text-slate-900`}>{isRtl ? HEBREW_TRANSLATIONS.whatPeopleAreSaying : 'What People Are Saying'}</h2><div className="space-y-8 max-w-3xl mx-auto">{config.testimonials.map(t => (<blockquote key={t.id} className="text-center"><p className={`${config.styles.fontBody} text-xl italic text-slate-700`}>"{t.quote}"</p><footer className={`${config.styles.fontBody} mt-4 font-semibold ${config.styles.colorSecondary}`}>{t.author}</footer></blockquote>))}</div></SectionWrapper>;
      case 'contact': return <SectionWrapper key="contact" id="contact"><div className="text-center"><h2 className={`${config.styles.fontHeading} text-3xl font-bold text-slate-900 mb-4`}>{isRtl ? HEBREW_TRANSLATIONS.getInTouch : 'Get In Touch'}</h2>
      {isPreviewMode ? (
        <a href="#" className={`${config.styles.colorPrimary} ${config.styles.fontBody} text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 inline-block shadow-lg`}>{config.cta.label}</a>
      ) : (
        <input 
            type="text"
            value={config.cta.label}
            onChange={e => handleValueChange('cta', { label: e.target.value })}
            className={`${config.styles.colorPrimary} ${config.styles.fontBody} text-white font-bold py-3 px-8 rounded-full text-lg inline-block shadow-lg text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-white`}
        />
      )}
      </div></SectionWrapper>;
      default: return null;
    }
  };
  
  const inlineInputStyles = "bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md text-center w-full block";
  
  const languageFilteredFontThemes = Object.entries(FONT_THEMES).filter(([, theme]) => (theme.lang as readonly string[]).includes(language));

  return (
    <div className="bg-slate-200 dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden h-full flex">
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        {/* --- DOCKED EDITOR PANEL --- */}
        <aside className={`w-96 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 transition-all duration-500 ease-in-out ${isPreviewMode ? 'ml-[-24rem]' : 'ml-0'}`}>
            <div className="p-4 h-full overflow-y-auto">
                <div className="space-y-2">
                    <AccordionItem title="Templates" isOpen={activeAccordion === 'Templates'} onToggle={() => handleAccordionToggle('Templates')}>
                        <div className="flex gap-2 flex-wrap">{['scratch', ...Object.keys(TEMPLATES)].map(t => (<button key={t} onClick={() => handleTemplateChange(t)} className={`px-3 py-1 text-sm rounded-full border-2 capitalize transition-colors ${config.templateId === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-500'}`}>{t}</button>))}</div>
                    </AccordionItem>
                    <AccordionItem title="Appearance" isOpen={activeAccordion === 'Appearance'} onToggle={() => handleAccordionToggle('Appearance')}>
                        <div><FormLabel>Font Pairing</FormLabel><div className="space-y-2">{languageFilteredFontThemes.map(([themeKey, theme]) => (<button key={themeKey} onClick={() => handleFontThemeChange(themeKey as FontThemeKey)} className={`w-full p-3 text-center rounded-lg border-2 transition-colors ${config.styles.fontPairing === themeKey ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/50 dark:border-blue-500' : 'bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-blue-400'}`}><div className={`text-lg font-bold ${theme.heading}`}>{theme.name[language]}</div></button>))}</div></div>
                        <div><FormLabel>Primary Color</FormLabel><div className="flex gap-2 flex-wrap">{COLOR_PALETTE.primary.map(c => <ColorSwatch key={c} color={c} isSelected={c === config.styles.colorPrimary} onClick={() => handleStyleChange('colorPrimary', c)} />)}</div></div>
                        <div><FormLabel>Secondary Color (Text)</FormLabel><div className="flex gap-2 flex-wrap">{COLOR_PALETTE.secondary.map(c => <ColorSwatch key={c} color={c} isSelected={c === config.styles.colorSecondary} onClick={() => handleStyleChange('colorSecondary', c)} />)}</div></div>
                        <div><FormLabel>Background Color</FormLabel><div className="flex gap-2 flex-wrap">{COLOR_PALETTE.background.map(c => <ColorSwatch key={c} color={c} isSelected={c === config.styles.colorBackground} onClick={() => handleStyleChange('colorBackground', c)} />)}</div></div>
                        <div><FormLabel>Background Opacity</FormLabel><FormSelect value={config.styles.backgroundOpacity} onChange={e => handleStyleChange('backgroundOpacity', e.target.value)}>{OPACITY_OPTIONS.map(o => <option key={o} value={o}>{o.replace('bg-opacity-','')}%</option>)}</FormSelect></div>
                    </AccordionItem>
                    <AccordionItem title="Page Sections" isOpen={activeAccordion === 'Page Sections'} onToggle={() => handleAccordionToggle('Page Sections')}>
                        <div className="space-y-2">
                          {config.sections.map((sectionId, index) => (<div key={sectionId} className={`flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 group transition-shadow ${draggedItem.current === index ? 'shadow-lg scale-105' : ''}`} draggable onDragStart={() => (draggedItem.current = index)} onDragEnter={() => (dragOverItem.current = index)} onDragEnd={handleDragSort} onDragOver={(e) => e.preventDefault()}><div className="flex items-center gap-3"><DragHandleIcon className="h-5 w-5 text-slate-400 cursor-grab group-active:cursor-grabbing" /><span className="text-sm capitalize font-medium text-slate-700 dark:text-slate-300">{sectionId}</span></div><ToggleSwitch checked={config.sectionVisibility[sectionId]} onChange={(val) => handleSectionVisibilityChange(sectionId, val)} label="" /></div>))}
                        </div>
                    </AccordionItem>
                </div>
            </div>
        </aside>

        {/* --- PREVIEW AREA --- */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
             {/* --- FLOATING TOOLBAR --- */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-2">
                <div className="flex items-center bg-slate-200/50 dark:bg-slate-900/50 p-1 rounded-lg">
                    <button onClick={() => setIsPreviewMode(false)} className={`px-3 py-1 text-sm rounded-md transition-all ${!isPreviewMode ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>Edit</button>
                    <button onClick={() => setIsPreviewMode(true)} className={`px-3 py-1 text-sm rounded-md transition-all ${isPreviewMode ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>Preview</button>
                </div>
                <div className="hidden md:flex items-center gap-1 bg-slate-200/50 dark:bg-slate-900/50 p-1 rounded-lg">
                    {(['desktop', 'tablet', 'mobile'] as const).map(device => {
                        const DeviceIcon = { desktop: DesktopIcon, tablet: TabletIcon, mobile: MobileIcon }[device];
                        return (
                            <button key={device} onClick={() => setPreviewDevice(device)} aria-pressed={previewDevice === device} className={`p-2 rounded-md transition-colors ${previewDevice === device ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'}`} title={`Preview on ${device}`}>
                                <DeviceIcon className="w-5 h-5" />
                            </button>
                        )
                    })}
                </div>
            </div>
            
            {/* --- PREVIEW CANVAS --- */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-8 h-full">
                <div style={{ maxWidth: deviceWidths[previewDevice] }} className="mx-auto h-full transition-all duration-500 ease-in-out">
                  <div className="shadow-lg rounded-md border border-slate-300 dark:border-slate-700 overflow-y-auto h-full">
                    <div dir={isRtl ? 'rtl' : 'ltr'} className={`${config.styles.colorBackground} ${config.styles.backgroundOpacity} min-h-full`}>
                      <header className="py-16 text-center px-4">
                        <ProfileImage />
                        {isPreviewMode ? (
                            <h1 className={`${config.styles.fontHeading} text-4xl lg:text-5xl font-extrabold text-slate-900 mt-6`}>{config.name}</h1>
                        ) : (
                            <input
                                type="text"
                                value={config.name}
                                onChange={e => handleValueChange('name', e.target.value)}
                                className={`${config.styles.fontHeading} text-4xl lg:text-5xl font-extrabold text-slate-900 mt-6 ${inlineInputStyles}`}
                            />
                        )}
                        {isPreviewMode ? (
                           <p className={`${config.styles.fontBody} ${config.styles.colorSecondary} text-xl mt-2`}>{config.title}</p>
                        ) : (
                           <input
                                type="text"
                                value={config.title}
                                onChange={e => handleValueChange('title', e.target.value)}
                                className={`${config.styles.fontBody} ${config.styles.colorSecondary} text-xl mt-2 ${inlineInputStyles}`}
                           />
                        )}
                      </header>
                      {config.sections.map(sectionId => renderSection(sectionId))}
                      <footer className="py-8 text-center text-sm text-slate-500">{isRtl ? HEBREW_TRANSLATIONS.poweredBy : 'Powered by Vena'}</footer>
                    </div>
                  </div>
                </div>
              </div>
            </main>
        </div>
    </div>
  );
};

export default VenaProfileEditor;