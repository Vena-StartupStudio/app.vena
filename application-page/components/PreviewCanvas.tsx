import React, { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ProfileConfig } from '../index';
import { HEBREW_TRANSLATIONS, INITIAL_PLACEHOLDER_IMAGE } from '../constants/config';
import AboutCard from './cards/AboutCard';
import ServicesCard from './cards/ServicesCard';
import ProfileHeader from './cards/ProfileHeader';
import { DataStatus } from '../hooks/useProfileConfig';

interface PreviewCanvasProps {
  isPreviewMode: boolean;
  setIsPreviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  config: ProfileConfig;
  isRtl: boolean;
  onValueChange: <K extends keyof ProfileConfig>(key: K, value: ProfileConfig[K]) => void;
  status: DataStatus;
  setStatus: React.Dispatch<React.SetStateAction<DataStatus>>;
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  isPreviewMode,
  setIsPreviewMode,
  config,
  isRtl,
  onValueChange,
  status,
  setStatus,
}) => {
  const handleSave = async () => {
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
    } catch (error) {
      console.error('Error saving profile:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => setStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [status, setStatus]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('logos')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('logos')
      .getPublicUrl(data.path);

    if (publicUrlData) {
      onValueChange('profileImage', publicUrlData.publicUrl);
    }
  };

  const t = (key: string) => {
    if (isRtl && key in HEBREW_TRANSLATIONS) {
      return HEBREW_TRANSLATIONS[key as keyof typeof HEBREW_TRANSLATIONS];
    }
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const renderSection = (sectionId: string) => {
    if (!config.sectionVisibility[sectionId as keyof typeof config.sectionVisibility]) return null;
    
    switch (sectionId) {
      case 'about':
        return (
          <AboutCard
            key="about"
            config={config}
            bio={config.bio}
            onBioChange={(value) => onValueChange('bio', value)}
            isRtl={isRtl}
            t={t}
          />
        );
      case 'services':
        return (
          <ServicesCard
            key="services"
            config={config}
            services={config.services}
            onServiceChange={(services) => onValueChange('services', services)}
            isRtl={isRtl}
            t={t}
          />
        );

      default: 
        return null;
    }
  };


  const getSaveButtonText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'success':
        return 'Saved!';
      case 'error':
        return 'Retry Save';
      default:
        return 'Save';
    }
  };

  return (
    <main className="flex-1 h-full overflow-y-auto relative">
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button 
          onClick={handleSave} 
          className={`px-4 py-2 text-white rounded-md shadow-lg transition-colors ${
            status === 'saving' ? 'bg-yellow-500 cursor-not-allowed' :
            status === 'success' ? 'bg-green-500' :
            status === 'error' ? 'bg-red-500 hover:bg-red-400' :
            'bg-green-600 hover:bg-green-500'
          }`}
          disabled={status === 'saving'}
        >
          {getSaveButtonText()}
        </button>
        <button onClick={() => setIsPreviewMode(!isPreviewMode)} className="px-4 py-2 bg-slate-800 text-white rounded-md shadow-lg hover:bg-slate-700 transition-colors">
          {isPreviewMode ? 'Editor' : 'Preview'}
        </button>
      </div>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-900/50 flex items-center justify-center z-30">
          <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">Loading Profile...</div>
        </div>
      )}
      <div dir={isRtl ? 'rtl' : 'ltr'} className={`max-w-7xl mx-auto p-6 md:p-8 lg:p-12 transition-all duration-300 ${config.styles.colorBackground} ${config.styles.backgroundOpacity} min-h-screen`}>
        {/* Professional Header */}
        <header className="mb-12">
          <ProfileHeader
            config={config}
            onValueChange={onValueChange}
            onImageUpload={handleImageUpload}
            isRtl={isRtl}
            initialPlaceholderImage={INITIAL_PLACEHOLDER_IMAGE}
          />
        </header>

        {/* Main Content Grid */}
        <div className="grid gap-8 md:gap-12 auto-rows-max">
          {config.sections.map(renderSection)}
        </div>

        {/* Modern Footer */}
        <footer className="text-center mt-16 pt-12">
          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/30 transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-lg hover:-translate-y-1 transform-gpu">
            <div className="flex justify-center mb-4">
              <img src="/favicon.png" alt="Vena Logo" className="w-10 h-10" />
            </div>
            <p className={`text-slate-500 dark:text-slate-400 ${config.styles.fontBody}`}>
              {t('poweredBy')} <span className="font-semibold text-slate-700 dark:text-slate-300">Vena</span>
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default PreviewCanvas;
