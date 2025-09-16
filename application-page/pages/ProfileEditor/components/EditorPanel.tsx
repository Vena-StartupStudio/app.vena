import React, { useState } from 'react';
import type { ProfileConfig, FontThemeKey, SectionId } from '../types';
import { TEMPLATES } from '../constants/config';
import { FONT_THEMES, COLOR_PALETTE, OPACITY_OPTIONS } from '../constants/themes';

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-slate-200 dark:border-slate-700">
    <button onClick={onToggle} className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-800 dark:text-slate-200">
      {title}
      <ChevronDownIcon className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && <div className="p-4">{children}</div>}
  </div>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>);

interface EditorPanelProps {
  isPreviewMode: boolean;
  config: ProfileConfig;
  language: 'en' | 'he';
  onTemplateChange: (templateKey: string) => void;
  onStyleChange: <K extends keyof ProfileConfig['styles']>(key: K, value: ProfileConfig['styles'][K]) => void;
  onFontThemeChange: (themeKey: FontThemeKey) => void;
  onSectionVisibilityChange: (sectionId: SectionId, isVisible: boolean) => void;
  onSectionsOrderChange: (sections: SectionId[]) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  isPreviewMode,
  config,
  language,
  onTemplateChange,
  onStyleChange,
  onFontThemeChange,
  onSectionVisibilityChange,
  onSectionsOrderChange,
}) => {
  const [activeAccordion, setActiveAccordion] = useState('Templates');
  const handleAccordionToggle = (title: string) => { setActiveAccordion(prev => (prev === title ? '' : title)); };
  const languageFilteredFontThemes = Object.entries(FONT_THEMES).filter(([, theme]) => (theme.lang as readonly string[]).includes(language));

  return (
    <aside className={`w-96 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 transition-all duration-500 ease-in-out ${isPreviewMode ? 'ml-[-24rem]' : 'ml-0'}`}>
      <div className="p-4 h-full overflow-y-auto">
        <div className="space-y-2">
          <AccordionItem title="Templates" isOpen={activeAccordion === 'Templates'} onToggle={() => handleAccordionToggle('Templates')}>
            <div className="flex gap-2 flex-wrap">{['scratch', ...Object.keys(TEMPLATES)].map(t => (<button key={t} onClick={() => onTemplateChange(t)} className={`px-3 py-1 text-sm rounded-full border-2 capitalize transition-colors ${config.templateId === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-500'}`}>{t}</button>))}</div>
          </AccordionItem>
          <AccordionItem title="Appearance" isOpen={activeAccordion === 'Appearance'} onToggle={() => handleAccordionToggle('Appearance')}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Font Pairing</label>
                <select value={config.styles.fontPairing} onChange={(e) => onFontThemeChange(e.target.value as FontThemeKey)} className="w-full p-2 border rounded-md bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200">
                  {languageFilteredFontThemes.map(([key, theme]) => <option key={key} value={key}>{theme.name[language]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Color</label>
                <div className="flex gap-2">{COLOR_PALETTE.primary.map(c => <button key={c} onClick={() => onStyleChange('colorPrimary', c)} className={`w-8 h-8 rounded-full ${c} border-2 ${config.styles.colorPrimary === c ? 'border-blue-500' : 'border-transparent'}`}></button>)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Secondary Color</label>
                <div className="flex gap-2">{COLOR_PALETTE.secondary.map(c => <div key={c} onClick={() => onStyleChange('colorSecondary', c)} className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-2 ${config.styles.colorSecondary === c ? 'border-blue-500' : 'border-transparent'}`}><span className={`${c} text-lg`}>Aa</span></div>)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Background Color</label>
                <div className="flex gap-2">{COLOR_PALETTE.background.map(c => <button key={c} onClick={() => onStyleChange('colorBackground', c)} className={`w-8 h-8 rounded-full ${c} border-2 ${config.styles.colorBackground === c ? 'border-blue-500' : 'border-slate-300'}`}></button>)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Background Opacity</label>
                <div className="flex gap-2">{OPACITY_OPTIONS.map(o => <button key={o} onClick={() => onStyleChange('backgroundOpacity', o)} className={`w-8 h-8 rounded-full bg-slate-400 border-2 ${o} ${config.styles.backgroundOpacity === o ? 'border-blue-500' : 'border-transparent'}`}></button>)}</div>
              </div>
            </div>
          </AccordionItem>
        </div>
      </div>
    </aside>
  );
};

export default EditorPanel;
