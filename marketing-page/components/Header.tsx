import React, { useState } from 'react';
// TODO: Replace with proper import once build configuration is fixed
const venaLogoSrc = '/assets/venalogo.png'; // Update this with your actual logo URL

const VenaLogo: React.FC = () => (
  <img 
    src={venaLogoSrc} 
    alt="Vena Logo" 
    className="h-12 w-auto md:w-48 lg:w-56" // Header sizing
    onError={(e) => {
      console.error('Failed to load Vena logo');
      e.currentTarget.style.display = 'none';
    }}
  />
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#value', label: 'Why Vena?' },
    { href: '#cta', label: 'Contact' },
  ];

  return (
    <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-purple-100/30 shadow-sm">
      {/* Subtle gradient line at top */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 py-5">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <VenaLogo />
            {/* Subtle separator */}
            <div className="hidden lg:block ml-8 w-px h-6 bg-gradient-to-b from-transparent via-slate-300/50 to-transparent"></div>
          </div>

          {/* Navigation - Ultra Clean Design */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center space-x-1 bg-slate-50/50 rounded-full p-1.5 border border-slate-100/80">
              {navLinks.map((link, index) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="relative px-4 py-2 text-slate-600 hover:text-slate-800 transition-all duration-300 font-light text-sm rounded-full hover:bg-white/80 hover:shadow-sm group"
                >
                  {link.label}
                  {/* Subtle indicator dot */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>
          </nav>

          {/* CTA Button - Refined Design */}
          <div className="hidden md:block">
            <a 
              href="#cta" 
              className="relative inline-flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-light px-6 py-2.5 rounded-full hover:from-purple-500 hover:to-indigo-500 transition-all duration-400 shadow-sm hover:shadow-lg border border-white/20 text-sm group overflow-hidden"
            >
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative">Join Waitlist</span>
              {/* Minimalist arrow */}
              <div className="relative ml-2 w-4 h-4 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300"></div>
                <div className="absolute w-2 h-px bg-white rounded-full opacity-60"></div>
              </div>
            </a>
          </div>

          {/* Mobile Menu Button - Minimalist */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-slate-50/80 border border-slate-200/60 focus:outline-none transition-all duration-300 hover:bg-slate-100/80"
            >
              <div className="relative w-5 h-5 flex flex-col justify-center space-y-1">
                <div className={`h-px bg-slate-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0.5' : 'w-5'}`}></div>
                <div className={`h-px bg-slate-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-4'}`}></div>
                <div className={`h-px bg-slate-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-0.5' : 'w-5'}`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Enhanced */}
      {isMenuOpen && (
        <div className="md:hidden">
          {/* Subtle separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent"></div>
          
          <div className="bg-white/95 backdrop-blur-xl">
            <nav className="flex flex-col items-center space-y-1 px-6 py-6">
              {navLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="w-full text-center py-3 text-slate-600 hover:text-slate-800 transition-colors duration-300 font-light rounded-lg hover:bg-slate-50/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              
              {/* Mobile CTA */}
              <div className="w-full pt-4">
                <a 
                  href="#cta" 
                  className="block w-full text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-light px-6 py-3 rounded-2xl hover:from-purple-500 hover:to-indigo-500 transition-all duration-400 shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Waitlist
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;