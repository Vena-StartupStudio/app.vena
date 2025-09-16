import React from 'react';
import type { ProfileConfig } from '../types';
import { HEBREW_TRANSLATIONS, INITIAL_PLACEHOLDER_IMAGE } from '../constants/config';
import AboutCard from './cards/AboutCard';
import ServicesCard from './cards/ServicesCard';
import ProfileHeader from './cards/ProfileHeader';

interface PreviewCanvasProps {
  isPreviewMode: boolean;
  setIsPreviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  config: ProfileConfig;
  setConfig: React.Dispatch<React.SetStateAction<ProfileConfig>>;
  isRtl: boolean;
  onValueChange: <K extends keyof ProfileConfig>(key: K, value: ProfileConfig[K]) => void;
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  isPreviewMode,
  setIsPreviewMode,
  config,
  setConfig,
  isRtl,
  onValueChange,
}) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onValueChange('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const t = (key: keyof typeof HEBREW_TRANSLATIONS) => isRtl ? HEBREW_TRANSLATIONS[key] : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

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

  const inlineInputStyles = "bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md text-center w-full block";

  return (
    <main className="flex-1 h-full overflow-y-auto relative">
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button onClick={() => setIsPreviewMode(!isPreviewMode)} className="px-4 py-2 bg-slate-800 text-white rounded-md shadow-lg hover:bg-slate-700 transition-colors">
          {isPreviewMode ? 'Editor' : 'Preview'}
        </button>
      </div>
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
