import React from 'react';
import BaseCard from './BaseCard';
import type { ProfileConfig } from '../../types';

interface ContactCardProps {
  config: ProfileConfig;
  cta: { label: string };
  onCtaChange: (cta: { label: string }) => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  config,
  cta,
  onCtaChange,
  isRtl,
  t
}) => {
  const inlineInputStyles = "bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-md px-2 py-1 w-full";

  return (
    <BaseCard variant="elevated" className="text-center overflow-hidden">
      <div className="space-y-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${config.styles.colorPrimary.replace('bg-', '#')} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${config.styles.colorSecondary.replace('text-', '#')} 0%, transparent 50%)`
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`w-20 h-20 rounded-full ${config.styles.colorPrimary} flex items-center justify-center shadow-xl`}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Section Title */}
          <h2 className={`text-4xl font-bold ${config.styles.fontHeading} ${config.styles.colorSecondary} relative`}>
            {t('getInTouch')}
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 ${config.styles.colorPrimary} rounded-full`}></div>
          </h2>

          {/* Subtitle */}
          <p className={`text-lg ${config.styles.fontBody} text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed`}>
            Ready to start your next project? Let's work together to create something amazing.
          </p>

          {/* CTA Button */}
          <div className="space-y-4">
            <div className="inline-block">
              <button className={`
                group relative px-12 py-4 rounded-full text-lg font-semibold text-white 
                ${config.styles.colorPrimary} 
                transition-all duration-300 ease-out 
                hover:shadow-2xl hover:-translate-y-2 hover:scale-105
                focus:outline-none focus:ring-4 focus:ring-blue-500/30
                ${config.styles.fontBody}
              `}>
                <input
                  type="text"
                  value={cta.label}
                  onChange={(e) => onCtaChange({ label: e.target.value })}
                  className="bg-transparent text-center w-full focus:outline-none text-white placeholder-white/80"
                  placeholder="Contact Me"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Contact Methods */}
            <div className="flex justify-center space-x-8 pt-6">
              <div className="flex flex-col items-center space-y-2 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <svg className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Call</span>
              </div>

              <div className="flex flex-col items-center space-y-2 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <svg className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Email</span>
              </div>

              <div className="flex flex-col items-center space-y-2 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <svg className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Chat</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center space-x-4 pt-4">
            <div className={`w-2 h-2 rounded-full ${config.styles.colorPrimary} opacity-60 animate-pulse`}></div>
            <div className={`w-2 h-2 rounded-full ${config.styles.colorPrimary} opacity-40 animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
            <div className={`w-2 h-2 rounded-full ${config.styles.colorPrimary} opacity-20 animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default ContactCard;