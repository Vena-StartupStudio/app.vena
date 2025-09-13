
export enum BusinessNiche {
  Physiotherapist = 'Physiotherapist',
  Chiropractor = 'Chiropractor',
  Nutritionist = 'Nutritionist',
  YogaInstructor = 'Yoga Instructor',
  PilatesInstructor = 'Pilates Instructor',
  MassageTherapist = 'Massage Therapist',
  PersonalTrainer = 'Personal Trainer',
  WellnessCoach = 'Wellness Coach',
  Acupuncturist = 'Acupuncturist',
  MeditationTeacher = 'Meditation Teacher',
}

export interface FormData {
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  socialMedia?: string;
  businessNiche: BusinessNiche;
  logo: File | null;
}

export type FormErrors = {
  [key in keyof FormData]?: string;
};
