import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ProfileConfig, FontThemeKey, SectionId } from '../types';
import { TEMPLATES } from '../constants/config';
import { FONT_THEMES, COLOR_PALETTE, OPACITY_OPTIONS } from '../constants/themes';

// --- ICONS ---
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>);
const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>);
const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>);
const DragHandleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16"><path d="M.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13A.5.5 0 0 1 .5 1zm15 0a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/></svg>);
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
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
    <div>
      <button 
        onClick={onToggle} 
        className={`w-full flex justify-between items-center p-6 text-left transition-all duration-300 ease-out group
          ${isOpen 
            ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30' 
            : 'hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-gray-50/50 dark:hover:from-slate-800/30 dark:hover:to-gray-800/30'
          }
          border-b border-slate-100/60 dark:border-slate-700/60 backdrop-blur-sm`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg transition-all duration-300 ${
            isOpen 
              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
              : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600/50'
          }`}>
            {icon}
          </div>
          <span className={`font-medium text-lg tracking-tight transition-colors duration-200 ${
            isOpen 
              ? 'text-slate-900 dark:text-slate-100' 
              : 'text-slate-700 dark:text-slate-300'
          }`}>
            {title}
          </span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 transform transition-all duration-300 ease-out ${
          isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
        }`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 bg-gradient-to-b from-white/50 to-slate-50/30 dark:from-slate-800/20 dark:to-slate-900/10 backdrop-blur-sm">
          <div className="animate-fadeIn">
            {children}
          </div>
        </div>
      )}
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
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-3">
        {colors.map(({ class: colorClass, name, hex }) => (
          <div key={colorClass} className="relative group">
            <button
              onClick={() => onColorChange(colorClass)}
              className={`w-10 h-10 rounded-xl ${colorClass} border-2 transition-all duration-300 ease-out
                ${selectedColor === colorClass 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/30 scale-110 ring-2 ring-blue-200/50 dark:ring-blue-500/30' 
                  : type === 'background' 
                    ? 'border-slate-200/60 dark:border-slate-600/50 hover:border-slate-300/80 dark:hover:border-slate-500/70' 
                    : 'border-transparent hover:border-slate-200/60 dark:hover:border-slate-600/50'
                } hover:scale-105 hover:shadow-md`}
              title={`${name} (${hex})`}
            >
              {type === 'secondary' && (
                <span className={`${colorClass} text-xs font-bold flex items-center justify-center h-full rounded-xl`}>
                  Aa
                </span>
              )}
            </button>
            {/* Enhanced Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 backdrop-blur-sm shadow-xl">
              <div className="font-medium">{name}</div>
              <div className="font-mono text-slate-300 dark:text-slate-400">{hex}</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900/95 dark:bg-slate-800/95 rotate-45"></div>
            </div>
          </div>
        ))}
        {/* Enhanced Custom Color Button */}
        <button
          onClick={() => onToggleCustom(!showCustom)}
          className={`w-10 h-10 rounded-xl border-2 border-dashed transition-all duration-300 ease-out flex items-center justify-center text-lg font-light
            ${showCustom 
              ? 'border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
              : 'border-slate-300/60 dark:border-slate-600/50 text-slate-400 dark:text-slate-500 hover:border-slate-400/80 dark:hover:border-slate-500/70 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-700/30'
            }`}
          title="Custom Color"
        >
          +
        </button>
      </div>
      {/* Enhanced Custom Color Input */}
      {showCustom && (
        <div className="mt-4 p-4 bg-gradient-to-r from-slate-50/80 to-white/60 dark:from-slate-700/60 dark:to-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-600/40 backdrop-blur-sm">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Custom {type} color
          </label>
          <input
            type="text"
            placeholder={type === 'primary' ? 'bg-red-500 or #FF0000' : type === 'secondary' ? 'text-red-500 or #FF0000' : 'bg-red-50 or #FFF0F0'}
            className="w-full px-4 py-3 text-sm border border-slate-200/60 dark:border-slate-600/50 rounded-lg bg-white/80 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300/60 dark:focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
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

  // Word-Style Font Picker Component
  const FontPicker: React.FC<{
    fontThemes: Array<[string, any]>;
    selectedFont: string;
    onFontChange: (fontKey: FontThemeKey) => void;
    language: 'en' | 'he';
  }> = ({ fontThemes, selectedFont, onFontChange, language }) => {
    
    // Extract main font family from the theme strings
    const getFontFamily = (fontString: string) => {
      const match = fontString.match(/font-family:([^;,]+)/);
      return match ? match[1].replace(/['"]/g, '').trim() : 'inherit';
    };

    return (
      <div className="border border-slate-200/60 dark:border-slate-600/50 rounded-lg bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm">
        {fontThemes.map(([key, theme], index) => (
          <button
            key={key}
            onClick={() => onFontChange(key as FontThemeKey)}
            className={`w-full px-4 py-3 text-left transition-all duration-200 ease-out flex items-center justify-between group
              ${selectedFont === key 
                ? 'bg-blue-500 dark:bg-blue-600 text-white' 
                : 'hover:bg-slate-50/80 dark:hover:bg-slate-700/60 text-slate-900 dark:text-slate-100'
              }
              ${index === 0 ? 'rounded-t-lg' : ''}
              ${index === fontThemes.length - 1 ? 'rounded-b-lg' : 'border-b border-slate-200/40 dark:border-slate-600/40'}
            `}
          >
            <span 
              className="text-base font-normal tracking-normal"
              style={{ 
                fontFamily: getFontFamily(theme.heading),
                fontSize: '16px'
              }}
            >
              {theme.name[language]}
            </span>
            {selectedFont === key && (
              <CheckIcon className="w-4 h-4 text-white flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <aside 
      ref={panelRef}
      className={`relative flex-shrink-0 transition-all duration-500 ease-out ${isPreviewMode ? 'ml-[-' + panelWidth + 'px]' : 'ml-0'}
        bg-gradient-to-br from-white via-slate-50/80 to-gray-50/60
        dark:from-slate-900 dark:via-slate-800/90 dark:to-gray-900/80
        backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/50
        shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30`}
      style={{ width: isCollapsed ? 0 : panelWidth }}
    >
      {/* Collapse/Expand Button - Top positioned and larger */}
      <button
        onClick={toggleCollapse}
        className="absolute top-4 -right-5 z-30 w-10 h-10 
          bg-gradient-to-r from-white/95 to-slate-50/90
          dark:from-slate-800/95 dark:to-slate-700/90
          border-2 border-slate-200/70 dark:border-slate-600/60
          rounded-full shadow-xl shadow-slate-200/40 dark:shadow-slate-900/50
          flex items-center justify-center 
          hover:from-blue-50/95 hover:to-indigo-50/90
          dark:hover:from-blue-900/50 dark:hover:to-indigo-900/40
          hover:border-blue-300/70 dark:hover:border-blue-500/60
          hover:shadow-blue-200/40 dark:hover:shadow-blue-900/50
          hover:scale-110 active:scale-95
          transition-all duration-200 ease-out group backdrop-blur-sm"
        title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
        ) : (
          <ChevronLeftIcon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
        )}
      </button>

      {/* Panel Content */}
      <div className={`h-full ${isCollapsed ? 'hidden' : 'block'}`}>
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100/60 dark:border-slate-700/50 bg-gradient-to-r from-white/60 to-slate-50/40 dark:from-slate-800/60 dark:to-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Editor</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Customize your profile</p>
            </div>
          </div>
        </div>

        <div className="p-6 h-full overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <AccordionItem 
              title="Templates" 
              isOpen={openAccordions.includes('Templates')} 
              onToggle={() => handleAccordionToggle('Templates')}
              icon={<LayoutIcon className="w-5 h-5" />}
            >
              <div className="grid grid-cols-2 gap-3 mt-4">
                {['scratch', ...Object.keys(TEMPLATES)].map(t => (
                  <button 
                    key={t} 
                    onClick={() => onTemplateChange(t)} 
                    className={`px-4 py-3 text-sm font-medium capitalize rounded-xl border transition-all duration-300 ease-out
                      ${config.templateId === t 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/30 transform scale-105' 
                        : 'bg-white/80 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/50 hover:border-blue-300/60 dark:hover:border-blue-500/50 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/60 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:shadow-md hover:shadow-blue-200/20 dark:hover:shadow-blue-900/20 backdrop-blur-sm'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </AccordionItem>
            <AccordionItem 
              title="Appearance" 
              isOpen={openAccordions.includes('Appearance')} 
              onToggle={() => handleAccordionToggle('Appearance')}
              icon={<PaletteIcon className="w-5 h-5" />}
            >
              <div className="space-y-8 mt-6">
                <div className="bg-white/60 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100/60 dark:border-slate-700/40 backdrop-blur-sm shadow-sm">
                  <label className="flex items-center gap-3 text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    Font Selection
                  </label>
                  <FontPicker
                    fontThemes={languageFilteredFontThemes}
                    selectedFont={config.styles.fontPairing}
                    onFontChange={onFontThemeChange}
                    language={language}
                  />
                </div>
                
                <div className="bg-white/60 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100/60 dark:border-slate-700/40 backdrop-blur-sm shadow-sm">
                  <label className="flex items-center gap-3 text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    Primary Color
                  </label>
                  <ColorPicker
                    colors={COLOR_PALETTE.primary}
                    selectedColor={config.styles.colorPrimary}
                    onColorChange={(color) => onStyleChange('colorPrimary', color)}
                    showCustom={showCustomPrimary}
                    onToggleCustom={setShowCustomPrimary}
                    type="primary"
                  />
                </div>
                
                <div className="bg-white/60 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100/60 dark:border-slate-700/40 backdrop-blur-sm shadow-sm">
                  <label className="flex items-center gap-3 text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    Secondary Color
                  </label>
                  <ColorPicker
                    colors={COLOR_PALETTE.secondary}
                    selectedColor={config.styles.colorSecondary}
                    onColorChange={(color) => onStyleChange('colorSecondary', color)}
                    showCustom={showCustomSecondary}
                    onToggleCustom={setShowCustomSecondary}
                    type="secondary"
                  />
                </div>
                
                <div className="bg-white/60 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100/60 dark:border-slate-700/40 backdrop-blur-sm shadow-sm">
                  <label className="flex items-center gap-3 text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
                    Background Color
                  </label>
                  <ColorPicker
                    colors={COLOR_PALETTE.background}
                    selectedColor={config.styles.colorBackground}
                    onColorChange={(color) => onStyleChange('colorBackground', color)}
                    showCustom={showCustomBackground}
                    onToggleCustom={setShowCustomBackground}
                    type="background"
                  />
                </div>
              </div>
            </AccordionItem>
          </div>
        </div>
      </div>
      
      {/* Enhanced Resize Handle - More visible and accessible */}
      {!isCollapsed && (
        <div
          className={`absolute top-0 right-0 w-4 h-full cursor-col-resize transition-all duration-300 group ${
            isDragging 
              ? 'bg-gradient-to-r from-blue-200/80 to-indigo-200/60 dark:from-blue-800/60 dark:to-indigo-800/50' 
              : 'bg-slate-100/30 dark:bg-slate-700/30 hover:bg-gradient-to-r hover:from-blue-100/60 hover:to-indigo-100/40 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/30'
          }`}
          onMouseDown={handleMouseDown}
          title="Drag to resize panel"
        >
          {/* Multiple grip indicators for better visibility */}
          <div className="absolute top-1/2 right-1 transform -translate-y-1/2 flex flex-col gap-1">
            <div className={`w-0.5 h-4 rounded-full transition-all duration-300 ${
              isDragging 
                ? 'bg-blue-500 dark:bg-blue-400 shadow-md shadow-blue-500/40' 
                : 'bg-slate-400/60 dark:bg-slate-500/60 group-hover:bg-blue-400 dark:group-hover:bg-blue-400'
            }`} />
            <div className={`w-0.5 h-4 rounded-full transition-all duration-300 ${
              isDragging 
                ? 'bg-blue-500 dark:bg-blue-400 shadow-md shadow-blue-500/40' 
                : 'bg-slate-400/60 dark:bg-slate-500/60 group-hover:bg-blue-400 dark:group-hover:bg-blue-400'
            }`} />
          </div>
          
          {/* Larger invisible hit area */}
          <div className="absolute inset-0 w-6 right-0" />
        </div>
      )}
      
      {/* Custom Styles */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgb(148 163 184 / 0.5) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(148 163 184 / 0.3), rgb(100 116 139 / 0.5));
          border-radius: 9999px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgb(59 130 246 / 0.5), rgb(99 102 241 / 0.7));
        }
      `}</style>
    </aside>
  );
};

export default EditorPanel;
