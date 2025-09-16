import React, { useState } from 'react';
import VenaProfileEditor from './components/VenaProfileEditor';

const App: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'he'>('en');

  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'en' ? 'he' : 'en'));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col">
      <header className="relative flex h-16 items-center justify-center border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800 flex-shrink-0">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Vena – The Personal Wellness Hub
        </h1>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button
            onClick={toggleLanguage}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-800"
            style={language === 'en' ? { fontFamily: "'Heebo', sans-serif" } : {}}
            aria-label="Toggle language"
          >
            {language === 'en' ? 'עברית' : 'English'}
          </button>
        </div>
      </header>
      <main className="flex-grow">
          <div className="p-4 h-full">
            <VenaProfileEditor key={language} language={language} />
          </div>
      </main>
    </div>
  );
};

export default App;
