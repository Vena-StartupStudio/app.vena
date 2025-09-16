import React, { useRef } from 'react';
import type { ProfileConfig, Service, Testimonial } from '../types';
import { HEBREW_TRANSLATIONS, INITIAL_PLACEHOLDER_IMAGE } from '../constants/config';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          <section className="text-center">
            <h2 className={`text-3xl font-bold mb-4 ${config.styles.fontHeading} ${config.styles.colorSecondary}`}>{t('aboutMe')}</h2>
            <p className={`text-lg ${config.styles.fontBody} text-slate-700 dark:text-slate-300`}>{config.bio}</p>
          </section>
        );
      case 'services':
        return (
          <section>
            <h2 className={`text-3xl font-bold text-center mb-8 ${config.styles.fontHeading} ${config.styles.colorSecondary}`}>{t('myServices')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {config.services.map((service: Service) => (
                <div key={service.id} className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md">
                  <h3 className={`text-xl font-semibold mb-2 ${config.styles.fontHeading}`}>{service.title}</h3>
                  <p className={`${config.styles.fontBody} text-slate-600 dark:text-slate-400`}>{service.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'testimonials':
        return (
          <section className="text-center">
            <h2 className={`text-3xl font-bold mb-8 ${config.styles.fontHeading} ${config.styles.colorSecondary}`}>{t('whatPeopleAreSaying')}</h2>
            <div className="space-y-8">
              {config.testimonials.map((testimonial: Testimonial) => (
                <blockquote key={testimonial.id} className="max-w-2xl mx-auto">
                  <p className={`text-xl italic ${config.styles.fontBody}`}>"{testimonial.quote}"</p>
                  <cite className={`block text-right mt-4 not-italic ${config.styles.fontBody} font-semibold`}>- {testimonial.author}</cite>
                </blockquote>
              ))}
            </div>
          </section>
        );
      case 'contact':
        return (
          <section className="text-center">
            <h2 className={`text-3xl font-bold mb-4 ${config.styles.fontHeading} ${config.styles.colorSecondary}`}>{t('getInTouch')}</h2>
            <a href="#" className={`inline-block px-8 py-3 rounded-full text-lg font-semibold text-white ${config.styles.colorPrimary} transition-transform hover:scale-105`}>{config.cta.label}</a>
          </section>
        );
      default: return null;
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
      <div dir={isRtl ? 'rtl' : 'ltr'} className={`max-w-4xl mx-auto p-8 md:p-12 transition-all duration-300 ${config.styles.colorBackground} ${config.styles.backgroundOpacity}`}>
        <header className="text-center mb-12">
          <div className="relative inline-block group">
            <img
              src={config.profileImage || INITIAL_PLACEHOLDER_IMAGE}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
            />
            <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              Change
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <h1 className={`text-5xl font-extrabold ${config.styles.fontHeading} ${config.styles.colorPrimary}`}>
            <input type="text" value={config.name} onChange={e => onValueChange('name', e.target.value)} className={inlineInputStyles} />
          </h1>
          <p className={`text-2xl mt-2 ${config.styles.fontBody} ${config.styles.colorSecondary}`}>
            <input type="text" value={config.title} onChange={e => onValueChange('title', e.target.value)} className={inlineInputStyles} />
          </p>
        </header>
        <div className="space-y-16">
          {config.sections.map(renderSection)}
        </div>
        <footer className="text-center mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">{t('poweredBy')}</p>
        </footer>
      </div>
    </main>
  );
};

export default PreviewCanvas;
