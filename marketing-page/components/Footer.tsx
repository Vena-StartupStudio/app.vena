import React from 'react';

const VenaLogo: React.FC = () => (
    <div className="flex items-center space-x-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-600">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
        <path d="M12.5 7H11v6l5.25 3.15L17 14.92l-4.5-2.67V7Z" fill="currentColor"/>
      </svg>
      <span className="text-2xl font-bold text-slate-900">Vena</span>
    </div>
  );

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-200">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <VenaLogo />
          </div>
          <div className="text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Vena. All rights reserved.</p>
            <p className="font-semibold text-slate-600">vena.software</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;