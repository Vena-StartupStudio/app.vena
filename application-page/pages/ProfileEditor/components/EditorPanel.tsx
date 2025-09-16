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
  const [showCustomPrimary, setShowCustomPrimary] = useState(false);
  const [showCustomSecondary, setShowCustomSecondary] = useState(false);
  const [showCustomBackground, setShowCustomBackground] = useState(false);
  
  const handleAccordionToggle = (title: string) => { setActiveAccordion(prev => (prev === title ? '' : title)); };
  const languageFilteredFontThemes = Object.entries(FONT_THEMES).filter(([, theme]) => (theme.lang as readonly string[]).includes(language));

  // Enhanced Color Picker Component
  const ColorPicker: React.FC<{
    colors: Array<{ class: string; name: string; hex: string }>;
    selectedColor: string;
    onColorChange: (color: string) => void;
    showCustom: boolean;
    onToggleCustom: (show: boolean) => void;
    type: 'primary' | 'secondary' | 'background';
  }> = ({ colors, selectedColor, onColorChange, showCustom, onToggleCustom, type }) => (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {colors.map(({ class: colorClass, name, hex }) => (
          <div key={colorClass} className="relative group">
            <button
              onClick={() => onColorChange(colorClass)}
              className={`w-8 h-8 rounded-full ${colorClass} border-2 ${
                selectedColor === colorClass ? 'border-blue-500' : 
                type === 'background' ? 'border-slate-300' : 'border-transparent'
              } hover:scale-110 transition-transform`}
              title={`${name} (${hex})`}
            >
              {type === 'secondary' && (
                <span className={`${colorClass} text-xs font-bold flex items-center justify-center h-full`}>
                  Aa
                </span>
              )}
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {name}
              <br />
              <span className="font-mono">{hex}</span>
            </div>
          </div>
        ))}
        {/* Custom Color Button */}
        <button
          onClick={() => onToggleCustom(!showCustom)}
          className="w-8 h-8 rounded-full border-2 border-dashed border-slate-400 hover:border-slate-600 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          title="Custom Color"
        >
          +
        </button>
      </div>
      {/* Custom Color Input */}
      {showCustom && (
        <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-md">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Custom {type} color (CSS class or hex)
          </label>
          <input
            type="text"
            placeholder={type === 'primary' ? 'bg-red-500 or #FF0000' : type === 'secondary' ? 'text-red-500 or #FF0000' : 'bg-red-50 or #FFF0F0'}
            className="w-full px-2 py-1 text-sm border rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  onColorChange(value);
                  onToggleCustom(false);
                }
              }
            }}
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value) {
                onColorChange(value);
                onToggleCustom(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );

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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Color</label>
                <ColorPicker
                  colors={COLOR_PALETTE.primary}
                  selectedColor={config.styles.colorPrimary}
                  onColorChange={(color) => onStyleChange('colorPrimary', color)}
                  showCustom={showCustomPrimary}
                  onToggleCustom={setShowCustomPrimary}
                  type="primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Secondary Color</label>
                <ColorPicker
                  colors={COLOR_PALETTE.secondary}
                  selectedColor={config.styles.colorSecondary}
                  onColorChange={(color) => onStyleChange('colorSecondary', color)}
                  showCustom={showCustomSecondary}
                  onToggleCustom={setShowCustomSecondary}
                  type="secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Background Color</label>
                <ColorPicker
                  colors={COLOR_PALETTE.background}
                  selectedColor={config.styles.colorBackground}
                  onColorChange={(color) => onStyleChange('colorBackground', color)}
                  showCustom={showCustomBackground}
                  onToggleCustom={setShowCustomBackground}
                  type="background"
                />
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
