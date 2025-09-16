import type { ProfileConfig } from '../types';
import { FONT_THEMES } from './themes';

export const INITIAL_PLACEHOLDER_IMAGE = 'https://i.imgur.com/rS42r8s.png';

export const HEBREW_TRANSLATIONS = {
  aboutMe: 'עליי',
  myServices: 'השירותים שלי',
  poweredBy: 'נוצר באמצעות'
};

const BASE_DEFAULT_CONFIG: Omit<ProfileConfig, 'styles'> = {
  templateId: 'scratch',
  name: 'Your Name',
  title: 'Wellness Professional',
  bio: 'Welcome to my wellness space. Here, I share my passion for helping others achieve balance and health through personalized programs and guidance.',
  profileImage: INITIAL_PLACEHOLDER_IMAGE,
  email: '',
  phone: '',
  services: [
    { id: 1, title: '1-on-1 Physiotherapy', description: 'Personalized sessions to address your specific needs and goals.' },
    { id: 2, title: 'Group Yoga Class', description: 'Join our community for a revitalizing group yoga experience.' },
    { id: 3, title: 'Nutrition Planning', description: 'Custom meal plans to complement your wellness journey.' },
  ],
  sections: ['about', 'services'],
  sectionVisibility: { about: true, services: true },
};

export const getInitialConfig = (language: 'en' | 'he'): ProfileConfig => {
    const isHebrew = language === 'he';
    const defaultConfig = {
        ...BASE_DEFAULT_CONFIG,
        name: isHebrew ? 'שמך המלא' : BASE_DEFAULT_CONFIG.name,
        title: isHebrew ? 'מקצוען בתחום הבריאות' : BASE_DEFAULT_CONFIG.title,
        bio: isHebrew ? 'ברוכים הבאים למרחב הבריאות שלי. כאן אני חולק/ת את התשוקה שלי לעזור לאחרים להשיג איזון ובריאות באמצעות תכניות והדרכה מותאמות אישית.' : BASE_DEFAULT_CONFIG.bio,
    };

    return {
        ...defaultConfig,
        styles: {
            fontPairing: isHebrew ? 'hebrew_default' : 'default',
            fontHeading: isHebrew ? FONT_THEMES.hebrew_default.heading : FONT_THEMES.default.heading,
            fontBody: isHebrew ? FONT_THEMES.hebrew_default.body : FONT_THEMES.default.body,
            colorPrimary: 'bg-blue-600',
            colorSecondary: 'text-blue-600',
            colorBackground: 'bg-white',
            backgroundOpacity: 'bg-opacity-100',
        },
    };
};

export const TEMPLATES: Record<string, Partial<ProfileConfig>> = {
  warm: { templateId: 'warm', styles: { ...(getInitialConfig('en').styles), fontPairing: 'serif', fontHeading: FONT_THEMES.serif.heading, fontBody: FONT_THEMES.serif.body, colorPrimary: 'bg-amber-600', colorSecondary: 'text-amber-600', colorBackground: 'bg-amber-50' }, sections: ['about', 'services'] },
  nature: { templateId: 'nature', styles: { ...(getInitialConfig('en').styles), fontPairing: 'modern', fontHeading: FONT_THEMES.modern.heading, fontBody: FONT_THEMES.modern.body, colorPrimary: 'bg-emerald-600', colorSecondary: 'text-emerald-600', colorBackground: 'bg-green-50' }, sections: ['about', 'services'] },
  ambient: { templateId: 'ambient', styles: { ...(getInitialConfig('en').styles), fontPairing: 'minimal', fontHeading: FONT_THEMES.minimal.heading, fontBody: FONT_THEMES.minimal.body, colorPrimary: 'bg-slate-600', colorSecondary: 'text-slate-500', colorBackground: 'bg-slate-50' }, sections: ['about', 'services'] },
  tranquil: { templateId: 'tranquil', styles: { ...(getInitialConfig('en').styles), fontPairing: 'default', fontHeading: FONT_THEMES.default.heading, fontBody: FONT_THEMES.default.body, colorPrimary: 'bg-sky-500', colorSecondary: 'text-sky-500', colorBackground: 'bg-sky-50' }, sections: ['about', 'services'] },
  serene: { templateId: 'serene', styles: { ...(getInitialConfig('en').styles), fontPairing: 'minimal', fontHeading: FONT_THEMES.minimal.heading, fontBody: FONT_THEMES.minimal.body, colorPrimary: 'bg-indigo-500', colorSecondary: 'text-indigo-500', colorBackground: 'bg-indigo-50' }, sections: ['about', 'services'] },
};
