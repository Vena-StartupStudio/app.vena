import { useState, useEffect, useCallback } from 'react';
import { getInitialConfig, TEMPLATES } from '../constants/config';
import { FONT_THEMES } from '../constants/themes';
import { supabase } from '../lib/supabaseClient'; 
import { ProfileConfig } from '../types';

export type DataStatus = 'idle' | 'loading' | 'saving' | 'success' | 'error';

export const useProfileConfig = (language: 'en' | 'he') => {
  const [config, setConfig] = useState<ProfileConfig>(() => getInitialConfig(language));
  const [status, setStatus] = useState<DataStatus>('loading');

  useEffect(() => {
    const fetchProfile = async () => {
      setStatus('loading');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No user logged in, using initial config.");
          setConfig(getInitialConfig(language));
          setStatus('idle');
          return;
        }

        const { data, error } = await supabase
          .from('registrations')
          .select('profile_config')
          .eq('id', user.id)
          .single();

        // Ignore error if no row is found, that's expected for new users
        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data && data.profile_config) {
          const dbConfig = data.profile_config as Partial<ProfileConfig>;
          
          // Deep merge fetched config with the initial config to ensure new properties are not missing
          setConfig(prevConfig => {
            const newConfig = {
              ...prevConfig,
              ...dbConfig,
              styles: {
                ...prevConfig.styles,
                ...(dbConfig.styles || {}),
              },
              sectionVisibility: {
                ...prevConfig.sectionVisibility,
                ...(dbConfig.sectionVisibility || {}),
              },
              sections: dbConfig.sections && dbConfig.sections.length > 0 ? dbConfig.sections : prevConfig.sections,
              services: dbConfig.services && dbConfig.services.length > 0 ? dbConfig.services : prevConfig.services,
            };
            return newConfig;
          });
        } else {
          // If no config is found in DB, ensure we're using the correct initial config
          setConfig(getInitialConfig(language));
        }
        setStatus('idle');
      } catch (error) {
        console.error('Error fetching profile:', error);
        setStatus('error');
        // Fallback to initial config on error
        setConfig(getInitialConfig(language));
      }
    };

    fetchProfile();
  }, [language]); // Rerun if language changes

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
    status,
    setStatus,
    handleTemplateChange,
    handleStyleChange,
    handleFontThemeChange,
    handleValueChange,
    handleSectionVisibilityChange,
    handleSectionsOrderChange,
  };
};
