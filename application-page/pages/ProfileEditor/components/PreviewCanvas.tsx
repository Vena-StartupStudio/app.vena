import React from 'react';
import type { ProfileConfig, Service, Testimonial } from '../types';
import { HEBREW_TRANSLATIONS, INITIAL_PLACEHOLDER_IMAGE } from '../constants/config';
import AboutCard from './cards/AboutCard';
import ServicesCard from './cards/ServicesCard';
import TestimonialsCard from './cards/TestimonialsCard';
import ContactCard from './cards/ContactCard';
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
      case 'testimonials':
        return (
          <TestimonialsCard
            key="testimonials"
            config={config}
            testimonials={config.testimonials}
            onTestimonialChange={(testimonials) => onValueChange('testimonials', testimonials)}
            isRtl={isRtl}
            t={t}
          />
        );
      case 'contact':
        return (
          <ContactCard
            key="contact"
            config={config}
            cta={config.cta}
            onCtaChange={(cta) => onValueChange('cta', cta)}
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
              <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
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
