import type { ProfileConfig } from '../index';
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
  profileImage: '',
  email: '',
  phone: '',
  services: [
    { id: 1, title: '1-on-1 Physiotherapy', description: 'Personalized sessions to address your specific needs and goals.' },
    { id: 2, title: 'Group Yoga Class', description: 'Join our community for a revitalizing group yoga experience.' },
    { id: 3, title: 'Nutrition Planning', description: 'Custom meal plans to complement your wellness journey.' },
  ],
  sections: ['about', 'services'],
  sectionVisibility: { about: true, services: true },
  landingPage: { slug: '', published: false, publishedAt: null, lastUpdatedAt: null },
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
  warm: { 
    templateId: 'warm', 
    name: 'Sarah Williams',
    title: 'Holistic Wellness Coach',
    bio: 'Creating warm, nurturing spaces for healing and personal growth. Specializing in mindfulness practices and gentle wellness approaches that honor your unique journey.',
    services: [
      { id: 1, title: 'Heart-Centered Coaching', description: 'Compassionate guidance to reconnect with your inner wisdom and authentic self.' },
      { id: 2, title: 'Mindful Living Sessions', description: 'Learn to embrace presence and find joy in everyday moments.' },
      { id: 3, title: 'Emotional Wellness Support', description: 'Safe space to process feelings and develop emotional resilience.' },
    ],
    styles: { 
      ...(getInitialConfig('en').styles), 
      fontPairing: 'serif', 
      fontHeading: FONT_THEMES.serif.heading, 
      fontBody: FONT_THEMES.serif.body, 
      colorPrimary: 'bg-gradient-to-br from-orange-500 to-amber-600', 
      colorSecondary: 'text-orange-600', 
      colorBackground: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
      backgroundOpacity: 'bg-opacity-90'
    }, 
    sections: ['about', 'services'] 
  },
  nature: { 
    templateId: 'nature',
    name: 'Marcus Green', 
    title: 'Nature-Based Therapist',
    bio: 'Connecting you with the healing power of nature through outdoor therapy, forest bathing, and earth-centered wellness practices that restore your natural balance.',
    services: [
      { id: 1, title: 'Forest Bathing Sessions', description: 'Immersive nature experiences to reduce stress and restore vitality.' },
      { id: 2, title: 'Outdoor Adventure Therapy', description: 'Healing through movement and connection with natural environments.' },
      { id: 3, title: 'Seasonal Wellness Rituals', description: 'Align your energy with nature\'s rhythms throughout the year.' },
    ],
    styles: { 
      ...(getInitialConfig('en').styles), 
      fontPairing: 'modern', 
      fontHeading: FONT_THEMES.modern.heading, 
      fontBody: FONT_THEMES.modern.body, 
      colorPrimary: 'bg-gradient-to-br from-emerald-600 to-green-700', 
      colorSecondary: 'text-emerald-700', 
      colorBackground: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50',
      backgroundOpacity: 'bg-opacity-95'
    }, 
    sections: ['about', 'services'] 
  },
  ambient: { 
    templateId: 'ambient',
    name: 'Alex Stone',
    title: 'Minimalist Life Designer', 
    bio: 'Embracing simplicity and intentional living. I help busy professionals find clarity, reduce overwhelm, and create space for what truly matters in their lives.',
    services: [
      { id: 1, title: 'Digital Minimalism Coaching', description: 'Streamline your digital life for focus and mental clarity.' },
      { id: 2, title: 'Intentional Space Design', description: 'Create environments that support your goals and well-being.' },
      { id: 3, title: 'Essential Priority Planning', description: 'Identify and focus on what truly moves the needle in your life.' },
    ],
    styles: { 
      ...(getInitialConfig('en').styles), 
      fontPairing: 'minimal', 
      fontHeading: FONT_THEMES.minimal.heading, 
      fontBody: FONT_THEMES.minimal.body, 
      colorPrimary: 'bg-gradient-to-br from-slate-700 to-gray-800', 
      colorSecondary: 'text-slate-600', 
      colorBackground: 'bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-50',
      backgroundOpacity: 'bg-opacity-100'
    }, 
    sections: ['about', 'services'] 
  },
  tranquil: { 
    templateId: 'tranquil',
    name: 'Luna Azure',
    title: 'Meditation & Flow Guide',
    bio: 'Guiding you into states of deep tranquility through breathwork, meditation, and movement practices that cultivate inner peace and emotional balance.',
    services: [
      { id: 1, title: 'Breathwork Journeys', description: 'Transformative breathing practices for deep healing and clarity.' },
      { id: 2, title: 'Flowing Meditation', description: 'Movement-based meditation to harmonize body, mind, and spirit.' },
      { id: 3, title: 'Inner Peace Retreats', description: 'Immersive experiences to deepen your practice and find stillness.' },
    ],
    styles: { 
      ...(getInitialConfig('en').styles), 
      fontPairing: 'default', 
      fontHeading: FONT_THEMES.default.heading, 
      fontBody: FONT_THEMES.default.body, 
      colorPrimary: 'bg-gradient-to-br from-sky-500 to-cyan-600', 
      colorSecondary: 'text-sky-600', 
      colorBackground: 'bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50',
      backgroundOpacity: 'bg-opacity-90'
    }, 
    sections: ['about', 'services'] 
  },
  serene: { 
    templateId: 'serene',
    name: 'Violet Sage',
    title: 'Spiritual Wellness Guide',
    bio: 'Creating sacred spaces for deep transformation through energy healing, crystal therapy, and intuitive guidance that honors your soul\'s wisdom and inner knowing.',
    services: [
      { id: 1, title: 'Energy Healing Sessions', description: 'Rebalance your chakras and release energetic blockages for renewal.' },
      { id: 2, title: 'Crystal Therapy Treatments', description: 'Harness the power of crystals for healing and manifestation.' },
      { id: 3, title: 'Intuitive Soul Readings', description: 'Connect with your higher self for guidance and spiritual clarity.' },
    ],
    styles: { 
      ...(getInitialConfig('en').styles), 
      fontPairing: 'serif', 
      fontHeading: FONT_THEMES.serif.heading, 
      fontBody: FONT_THEMES.serif.body, 
      colorPrimary: 'bg-gradient-to-br from-indigo-600 to-purple-700', 
      colorSecondary: 'text-indigo-600', 
      colorBackground: 'bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50',
      backgroundOpacity: 'bg-opacity-85'
    }, 
    sections: ['about', 'services'] 
  },
};


