import { useState } from 'react';
import { getInitialConfig, TEMPLATES } from '../constants/config';
import { FONT_THEMES } from '../constants/themes';
import type { ProfileConfig, SectionId, FontThemeKey } from '../types';

export const useProfileConfig = (language: 'en' | 'he') => {
  const [config, setConfig] = useState<ProfileConfig>(() => getInitialConfig(language));

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

  const handleStyleChange = <K extends keyof ProfileConfig['styles']>(
    key: K,
    value: ProfileConfig['styles'][K]
  ) => {
    setConfig(prev => ({ ...prev, styles: { ...prev.styles, [key]: value } }));
  };

  const handleFontThemeChange = (themeKey: FontThemeKey) => {
    const theme = FONT_THEMES[themeKey];
    setConfig(prev => ({
      ...prev,
      styles: { ...prev.styles, fontPairing: themeKey, fontHeading: theme.heading, fontBody: theme.body },
    }));
  };

  const handleValueChange = <K extends keyof ProfileConfig>(key: K, value: ProfileConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSectionVisibilityChange = (sectionId: SectionId, isVisible: boolean) => {
    setConfig(prev => ({
      ...prev,
      sectionVisibility: { ...prev.sectionVisibility, [sectionId]: isVisible },
    }));
  };
  
  const handleSectionsOrderChange = (sections: SectionId[]) => {
    setConfig(prev => ({ ...prev, sections }));
  };

  return {
    config,
    setConfig,
    handleTemplateChange,
    handleStyleChange,
    handleFontThemeChange,
    handleValueChange,
    handleSectionVisibilityChange,
    handleSectionsOrderChange,
  };
};
