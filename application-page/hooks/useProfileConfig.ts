import { useState, useEffect, useCallback } from 'react';
import { getInitialConfig, TEMPLATES } from '../constants/config';
import { FONT_THEMES, FontThemeKey } from '../constants/themes';
import { supabase } from '../lib/supabaseClient';
import { ProfileConfig, SectionId } from '../types';

export type DataStatus = 'idle' | 'loading' | 'saving' | 'success' | 'error';

export const useProfileConfig = (language: 'en' | 'he') => {
  const [config, setConfig] = useState<ProfileConfig>(() => getInitialConfig(language));
  const [status, setStatus] = useState<DataStatus>('loading');

  // Fetching logic
  useEffect(() => {
    const fetchProfile = async () => {
      setStatus('loading');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setConfig(getInitialConfig(language));
          setStatus('idle');
          return;
        }

        const { data, error } = await supabase
          .from('registrations')
          .select('profile_config')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data && data.profile_config) {
          const dbConfig = data.profile_config as Partial<ProfileConfig>;
          setConfig(prevConfig => ({
            ...prevConfig,
            ...dbConfig,
            styles: { ...prevConfig.styles, ...(dbConfig.styles || {}) },
            sectionVisibility: { ...prevConfig.sectionVisibility, ...(dbConfig.sectionVisibility || {}) },
            sections: dbConfig.sections && dbConfig.sections.length > 0 ? dbConfig.sections : prevConfig.sections,
            services: dbConfig.services && dbConfig.services.length > 0 ? dbConfig.services : prevConfig.services,
          }));
        } else {
          setConfig(getInitialConfig(language));
        }
        setStatus('idle');
      } catch (error) {
        console.error('DIAGNOSTIC: An unexpected error occurred in fetchProfile:', error);
        setStatus('error');
        setConfig(getInitialConfig(language));
      }
    };

    fetchProfile();
  }, [language]);

  // Corrected save function
  const saveProfile = useCallback(async (currentConfig: ProfileConfig) => {
    setStatus('saving');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('registrations')
        .update({ profile_config: currentConfig })
        .eq('id', user.id);

      if (error) throw error;

      setStatus('success');
    } catch (error) {
      console.error('DIAGNOSTIC: An unexpected error occurred in saveProfile:', error);
      setStatus('error');
    }
  }, []); // Dependency array is empty because setStatus is stable

  // New effect to handle resetting the status after save
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // --- All other handler functions remain the same ---
  const handleTemplateChange = (templateKey: string) => {
    if (templateKey === 'scratch') {
      setConfig(getInitialConfig(language));
    } else {
      const template = TEMPLATES[templateKey];
      if (template) {
        setConfig(prev => ({
          ...prev,
          ...template,
          styles: { ...prev.styles, ...(template.styles || {}) },
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
    status,
    saveProfile,
    handleTemplateChange,
    handleStyleChange,
    handleFontThemeChange,
    handleValueChange,
    handleSectionVisibilityChange,
    handleSectionsOrderChange,
  };
};
