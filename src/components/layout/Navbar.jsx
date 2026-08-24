import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or system preference on initial load
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle theme toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen ? 'bg-void/95 backdrop-blur-md border-b border-gunmetal' : 'bg-transparent'}`}>
      <nav className="w-full px-6 h-[62px] flex justify-between items-center max-w-[1344px] mx-auto">
        <a href="#" className="text-xl font-bold text-ink tracking-tight">
          Doğan <span className="text-signal">Ariç</span>
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-fog hover:text-ink transition-colors text-[15px] font-medium">Hakkımda</a>
          <a href="#experience" className="text-fog hover:text-ink transition-colors text-[15px] font-medium">Kariyer</a>
          <a href="#projects" className="text-fog hover:text-ink transition-colors text-[15px] font-medium">Projeler</a>
          <a href="#contact" className="bg-ink text-deep px-5 py-2 rounded-full text-sm font-medium hover:bg-signal transition-all">İletişim</a>
          
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gunmetal text-ink hover:text-signal transition-colors ml-2"
            title={isDarkMode ? "Açık Tema" : "Koyu Tema"}
          >
            <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gunmetal text-ink hover:text-signal transition-colors"
          >
            <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-ink hover:text-signal transition-colors p-1"
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-[62px] left-0 w-full bg-void border-b border-gunmetal transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col px-6 py-4 gap-4">
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-fog hover:text-ink transition-colors font-medium">Hakkımda</a>
          <a href="#experience" onClick={() => setIsMobileMenuOpen(false)} className="text-fog hover:text-ink transition-colors font-medium">Kariyer</a>
          <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="text-fog hover:text-ink transition-colors font-medium">Projeler</a>
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-fog hover:text-ink transition-colors font-medium">İletişim</a>
        </div>
      </div>
    </header>
  );
}