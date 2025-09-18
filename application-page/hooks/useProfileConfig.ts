import { useState, useEffect } from 'react';
import { getInitialConfig, TEMPLATES } from '../constants/config';
import { FONT_THEMES } from '../constants/themes';
import { supabase } from '../lib/supabaseClient';
import { ProfileConfig, SectionId, FontThemeKey } from '../index';

export type DataStatus = 'idle' | 'loading' | 'saving' | 'success' | 'error';

export const useProfileConfig = (language: 'en' | 'he') => {
  const [config, setConfig] = useState<ProfileConfig>(() => getInitialConfig(language));
  const [status, setStatus] = useState<DataStatus>('loading');

  useEffect(() => {
    const fetchProfile = async () => {
      setStatus('loading');
      console.log('DIAGNOSTIC: Attempting to fetch profile...');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error("DIAGNOSTIC: No user is logged in. Cannot fetch profile. Using initial config.");
          setConfig(getInitialConfig(language));
          setStatus('idle');
          return;
        }

        console.log('DIAGNOSTIC: Logged in user ID:', user.id);
        console.log('DIAGNOSTIC: Querying "registrations" table for user profile...');

        const { data, error } = await supabase
          .from('registrations')
          .select('profile_config')
          .eq('id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
            console.warn('DIAGNOSTIC: Supabase query returned no rows (PGRST116). This is normal for a new user.');
        } else if (error) {
          console.error('DIAGNOSTIC: Supabase fetch error:', error);
          throw error;
        }

        if (data && data.profile_config) {
          console.log('DIAGNOSTIC: Profile data found and received from Supabase:', data.profile_config);
          const dbConfig = data.profile_config as Partial<ProfileConfig>;
          
          setConfig((prevConfig: ProfileConfig) => {
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
          console.log('DIAGNOSTIC: No profile_config found in DB for this user. Using initial config.');
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
    setConfig((prev: ProfileConfig) => ({ ...prev, styles: { ...prev.styles, [key]: value } }));
  };

  const handleFontThemeChange = (themeKey: FontThemeKey) => {
    const theme = FONT_THEMES[themeKey as keyof typeof FONT_THEMES];
    setConfig((prev: ProfileConfig) => ({
      ...prev,
      styles: { ...prev.styles, fontPairing: themeKey, fontHeading: theme.heading, fontBody: theme.body },
    }));
  };

  const handleValueChange = <K extends keyof ProfileConfig>(key: K, value: ProfileConfig[K]) => {
    setConfig((prev: ProfileConfig) => ({ ...prev, [key]: value }));
  };

  const handleSectionVisibilityChange = (sectionId: SectionId, isVisible: boolean) => {
    setConfig((prev: ProfileConfig) => ({
      ...prev,
      sectionVisibility: { ...prev.sectionVisibility, [sectionId]: isVisible },
    }));
  };

  const handleSectionsOrderChange = (sections: SectionId[]) => {
    setConfig((prev: ProfileConfig) => ({ ...prev, sections }));
  };

  const saveProfile = async () => {
    setStatus('saving');
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('You must be logged in to save your profile.');
        setStatus('error');
        return;
      }

      const { error } = await supabase
        .from('registrations')
        .update({ profile_config: config })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setStatus('error');
    }
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
