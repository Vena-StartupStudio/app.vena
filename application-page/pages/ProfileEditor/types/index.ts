import { FONT_THEMES } from '../constants/themes';

export type SectionId = 'about' | 'services' | 'testimonials' | 'contact';
export type FontThemeKey = keyof typeof FONT_THEMES;

export interface Service {
  id: number;
  title: string;
  description: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
}

export interface ProfileConfig {
  templateId: string;
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  email: string;
  phone: string;
  cta: {
    label: string;
  };
  services: Service[];
  testimonials: Testimonial[];
  sections: SectionId[];
  sectionVisibility: Record<SectionId, boolean>;
  styles: {
    fontPairing: FontThemeKey;
    fontHeading: string;
    fontBody: string;
    colorPrimary: string;
    colorSecondary: string;
    colorBackground: string;
    backgroundOpacity: string;
  };
}
