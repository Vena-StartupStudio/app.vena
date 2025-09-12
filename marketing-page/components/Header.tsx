import React, { useState } from 'react';

const VenaLogo: React.FC = () => (
  <div className="flex items-center space-x-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-600">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
      <path d="M12.5 7H11v6l5.25 3.15L17 14.92l-4.5-2.67V7Z" fill="currentColor"/>
    </svg>
    <span className="text-2xl font-bold text-slate-900">Vena</span>
  </div>
);


const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#value', label: 'Why Vena?' },
    { href: '#cta', label: 'Contact' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <VenaLogo />
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-slate-600 hover:text-emerald-700 transition-colors duration-300 font-medium">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
            <a href="#cta" className="bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md">
                Join Waitlist
            </a>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-200">
          <nav className="flex flex-col items-center space-y-4 px-6 py-4">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-slate-600 hover:text-emerald-700 transition-colors duration-300 font-medium py-2">
                {link.label}
              </a>
            ))}
            <a href="#cta" className="w-full text-center bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md">
                Join Waitlist
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;