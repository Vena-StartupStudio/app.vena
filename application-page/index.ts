import { FONT_THEMES } from '../constants/themes';

export type SectionId = 'about' | 'services';
export type FontThemeKey = keyof typeof FONT_THEMES;

export interface Service {
  id: number;
  title: string;
  description: string;
}

export interface LandingPageMeta {
  slug: string;
  published: boolean;
  publishedAt?: string | null;
  lastUpdatedAt?: string | null;
}

export interface ProfileConfig {
  templateId: string;
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  email: string;
  phone: string;
  services: Service[];
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
  landingPage?: LandingPageMeta;
}

