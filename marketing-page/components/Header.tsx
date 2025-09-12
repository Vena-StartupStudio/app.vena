import React, { useState } from 'react';

const VenaLogo: React.FC = () => (
  <img src="/vena_logo.png" alt="Vena Logo" className="h-30 w-24" />
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
            <a key={link.label} href={link.href} className="text-slate-600 hover:text-indigo-700 transition-colors duration-300 font-medium">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
            <a href="#cta" className="bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md">
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
              <a key={link.label} href={link.href} className="text-slate-600 hover:text-indigo-700 transition-colors duration-300 font-medium py-2">
                {link.label}
              </a>
            ))}
            <a href="#cta" className="w-full text-center bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md">
                Join Waitlist
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;