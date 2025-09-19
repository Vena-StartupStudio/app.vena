import React from 'react';
import type { ProfileConfig, SectionId } from '../index';
import { INITIAL_PLACEHOLDER_IMAGE } from '../constants/config';

interface PublishedLandingPageProps {
  config: ProfileConfig;
}

const fallbackSections: SectionId[] = ['about', 'services'];

const PublishedLandingPage: React.FC<PublishedLandingPageProps> = ({ config }) => {
  const styles = config.styles ?? {
    fontHeading: '',
    fontBody: '',
    colorPrimary: 'bg-blue-600',
    colorSecondary: 'text-blue-600',
    colorBackground: 'bg-white',
    backgroundOpacity: 'bg-opacity-100',
  };

  const backgroundClass = `${styles.colorBackground ?? 'bg-white'} ${styles.backgroundOpacity ?? ''}`.trim();
  const headingFont = styles.fontHeading ?? '';
  const bodyFont = styles.fontBody ?? '';
  const accentText = styles.colorSecondary ?? 'text-blue-600';
  const rawSections = config.sections && config.sections.length > 0 ? config.sections : fallbackSections;
  const visibleSections = rawSections
    .filter((section) => config.sectionVisibility?.[section] !== false)
    .filter((section) => {
      if (section === 'services') {
        return (config.services?.length ?? 0) > 0;
      }
      if (section === 'about') {
        return Boolean(config.bio && config.bio.trim().length > 0);
      }
      return true;
    });
  const showAbout = visibleSections.includes('about');
  const isRtl = (styles.fontPairing ?? '').toLowerCase().includes('hebrew');

  const contactItems = [
    config.email && {
      label: 'Email',
      value: config.email,
      href: `mailto:${config.email}`,
    },
    config.phone && {
      label: 'Phone',
      value: config.phone,
      href: `tel:${config.phone}`,
    },
  ].filter(Boolean) as Array<{ label: string; value: string; href: string }>;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`${backgroundClass} min-h-screen`}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 py-12 md:py-16 space-y-14">
        <header className="flex flex-col items-center text-center space-y-6">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <img
              src={config.profileImage || INITIAL_PLACEHOLDER_IMAGE}
              alt={config.name || 'Profile'}
              className="w-full h-full rounded-full object-cover shadow-xl shadow-slate-200"
            />
          </div>
          <div className="space-y-3">
            {config.title && (
              <span className={`inline-flex items-center justify-center px-4 py-1 text-sm font-semibold uppercase tracking-wider rounded-full border border-slate-200/70 text-slate-600 bg-white/70 ${bodyFont}`}>
                {config.title}
              </span>
            )}
            {config.name && (
              <h1 className={`text-4xl sm:text-5xl font-bold text-slate-900 ${headingFont}`}>
                {config.name}
              </h1>
            )}
            {config.bio && !showAbout && (
              <p className={`max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed ${bodyFont}`}>
                {config.bio}
              </p>
            )}
          </div>
          {contactItems.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/80 hover:bg-white transition-colors ${bodyFont}`}
                >
                  <span className="font-semibold text-slate-700">{item.label}:</span>
                  <span>{item.value}</span>
                </a>
              ))}
            </div>
          )}
        </header>

        <main className="space-y-10">
          {visibleSections.map((sectionId) => {
            if (sectionId === 'about') {
              return (
                <section
                  key="about"
                  className="bg-white/80 backdrop-blur rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 px-8 py-10"
                >
                  <h2 className={`text-2xl font-semibold text-slate-900 ${headingFont}`}>About</h2>
                  <p className={`mt-4 text-base sm:text-lg text-slate-600 leading-relaxed ${bodyFont}`}>
                    {config.bio}
                  </p>
                </section>
              );
            }

            if (sectionId === 'services') {
              return (
                <section key="services" className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.colorPrimary ?? 'bg-blue-600'} text-white`}
                    >
                      <span className="text-lg font-semibold">{config.services?.length ?? 0}</span>
                    </div>
                    <h2 className={`text-2xl font-semibold text-slate-900 ${headingFont}`}>Services</h2>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {config.services?.map((service) => (
                      <article
                        key={service.id}
                        className="h-full p-6 rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm shadow-slate-200/40"
                      >
                        <h3 className={`text-xl font-semibold text-slate-900 ${headingFont}`}>{service.title}</h3>
                        <p className={`mt-3 text-slate-600 leading-relaxed ${bodyFont}`}>
                          {service.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              );
            }

            return null;
          })}
        </main>

        <footer className="pt-10 border-t border-slate-200/70 text-center">
          <p className={`text-sm text-slate-500 ${bodyFont}`}>
            Powered by <span className={`font-semibold ${accentText}`}>Vena</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PublishedLandingPage;
