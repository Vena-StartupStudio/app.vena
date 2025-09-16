import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ProfileConfig, FontThemeKey, SectionId } from '../types';
import { TEMPLATES } from '../constants/config';
import { FONT_THEMES, COLOR_PALETTE, OPACITY_OPTIONS } from '../constants/themes';

// --- ICONS ---
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>);
const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>);
const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>);
const DragHandleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16"><path d="M.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13A.5.5 0 0 1 .5 1zm15 0a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/></svg>);
const LayoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
  
  const PaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, isOpen, onToggle, children, icon }) => (
    <div className={`border-b border-slate-200 dark:border-slate-700 ${isOpen ? 'bg-slate-50 dark:bg-slate-900/50' : ''}`}>
      <button onClick={onToggle} className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-3">
          {icon}
          {title}
        </div>
        <ChevronDownIcon className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );

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
  const [openAccordions, setOpenAccordions] = useState(['Templates']);
  const [showCustomPrimary, setShowCustomPrimary] = useState(false);
  const [showCustomSecondary, setShowCustomSecondary] = useState(false);
  const [showCustomBackground, setShowCustomBackground] = useState(false);
  
  const [panelWidth, setPanelWidth] = useState(384); // Default width w-96
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && panelRef.current) {
      const newWidth = e.clientX;
      if (newWidth > 250 && newWidth < 800) { // Min/max width constraints
        setPanelWidth(newWidth);
      }
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setPanelWidth(isCollapsed ? 384 : 0);
  };
  
  const handleAccordionToggle = (title: string) => {
    setOpenAccordions(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title) 
        : [...prev, title]
    );
  };
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
    <aside 
      ref={panelRef}
      className={`relative flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 transition-all duration-300 ease-in-out ${isPreviewMode ? 'ml-[-' + panelWidth + 'px]' : 'ml-0'}`}
      style={{ width: isCollapsed ? 0 : panelWidth }}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={toggleCollapse}
        className="absolute top-1/2 -right-3 z-20 w-6 h-10 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-r-md flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        )}
      </button>

      {/* Panel Content */}
      <div className={`h-full ${isCollapsed ? 'hidden' : 'block'}`}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="space-y-2">
            <AccordionItem 
              title="Templates" 
              isOpen={openAccordions.includes('Templates')} 
              onToggle={() => handleAccordionToggle('Templates')}
              icon={<LayoutIcon className="w-5 h-5 text-slate-500" />}
            >
              <div className="flex gap-2 flex-wrap">{['scratch', ...Object.keys(TEMPLATES)].map(t => (<button key={t} onClick={() => onTemplateChange(t)} className={`px-3 py-1 text-sm rounded-full border-2 capitalize transition-colors ${config.templateId === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-500'}`}>{t}</button>))}</div>
            </AccordionItem>
            <AccordionItem 
              title="Appearance" 
              isOpen={openAccordions.includes('Appearance')} 
              onToggle={() => handleAccordionToggle('Appearance')}
              icon={<PaletteIcon className="w-5 h-5 text-slate-500" />}
            >
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
      </div>
      
      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          className={`absolute top-0 right-0 w-2 h-full cursor-col-resize bg-transparent hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors group ${
            isDragging ? 'bg-blue-300 dark:bg-blue-800' : ''
          }`}
          onMouseDown={handleMouseDown}
          title="Drag to resize panel"
        >
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-8 bg-slate-400 dark:bg-slate-500 group-hover:bg-blue-500 dark:group-hover:bg-blue-400 rounded-l-sm transition-colors">
            <DragHandleIcon className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      )}
    </aside>
  );
};

export default EditorPanel;
