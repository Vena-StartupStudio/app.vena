export const FONT_THEMES = {
  default: { name: { en: 'Vena', he: 'וֶנָה' }, heading: "[font-family:'Poppins',Inter,system-ui,sans-serif]", body: "[font-family:Inter,system-ui,sans-serif]", lang: ['en'] as const },
  serif: { name: { en: 'Elegant Serif', he: 'סריף אלגנטי' }, heading: "[font-family:'Playfair Display',serif]", body: "[font-family:'Lora',serif]", lang: ['en'] as const },
  modern: { name: { en: 'Modern Sans', he: 'סאנס מודרני' }, heading: "[font-family:'Montserrat',sans-serif]", body: "[font-family:'Lato',sans-serif]", lang: ['en'] as const },
  minimal: { name: { en: 'Minimalist', he: 'מינימליסטי' }, heading: "[font-family:'Roboto',sans-serif]", body: "[font-family:'Roboto',sans-serif]", lang: ['en'] as const },
  hebrew_default: { name: { en: 'Hebrew (Default)', he: 'עברית (ברירת מחדל)' }, heading: "[font-family:'Heebo','Assistant',system-ui,sans-serif]", body: "[font-family:'Assistant','Heebo',system-ui,sans-serif]", lang: ['he'] as const },
  hebrew_serif: { name: { en: 'Hebrew (Serif)', he: 'עברית (סריף)' }, heading: "[font-family:'Frank Ruhl Libre','Heebo',serif]", body: "[font-family:'Assistant',system-ui,sans-serif]", lang: ['he'] as const },
  hebrew_rounded: { name: { en: 'Hebrew (Rounded)', he: 'עברית (מעוגל)' }, heading: "[font-family:'Varela Round','Rubik',sans-serif]", body: "[font-family:'Rubik','Assistant',sans-serif]", lang: ['he'] as const }
} as const;

export const COLOR_PALETTE = {
  primary: ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-rose-600', 'bg-slate-800', 'bg-amber-600', 'bg-sky-500', 'bg-indigo-500'],
  secondary: ['text-blue-600', 'text-emerald-600', 'text-purple-600', 'text-rose-600', 'text-slate-600', 'text-amber-600', 'text-sky-500', 'text-indigo-500'],
  background: ['bg-white', 'bg-slate-50', 'bg-gray-100', 'bg-zinc-100', 'bg-stone-50', 'bg-amber-50', 'bg-green-50', 'bg-sky-50', 'bg-indigo-50'],
};

export const OPACITY_OPTIONS = ['bg-opacity-100', 'bg-opacity-90', 'bg-opacity-80', 'bg-opacity-70'];
