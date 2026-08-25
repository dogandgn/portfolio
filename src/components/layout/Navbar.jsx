import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
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
  
  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('tr') ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language.startsWith('tr') ? 'TR' : 'EN';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen ? 'bg-void/95 backdrop-blur-md border-b border-gunmetal' : 'bg-transparent'}`}>
      <nav className="w-full px-6 h-[62px] flex justify-between items-center max-w-[1344px] mx-auto">
        <a href="#" className="text-xl font-bold text-ink tracking-tight">
          Doğan <span className="text-signal">Ariç</span>
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-fog hover:text-ink transition-colors text-[15px] font-medium">{t('nav.about')}</a>
          <a href="#experience" className="text-fog hover:text-ink transition-colors text-[15px] font-medium">{t('nav.experience')}</a>
          <a href="#projects" className="text-fog hover:text-ink transition-colors text-[15px] font-medium">{t('nav.projects')}</a>
          <a href="#contact" className="bg-ink text-deep px-5 py-2 rounded-full text-sm font-medium hover:bg-signal transition-all">{t('nav.contact')}</a>
          
          <div className="flex items-center gap-2 ml-2">
            <button 
              onClick={toggleLanguage}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gunmetal text-ink font-medium text-sm hover:text-signal transition-colors"
              title="Change Language"
            >
              {currentLang}
            </button>
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gunmetal text-ink hover:text-signal transition-colors"
              title={isDarkMode ? t('nav.lightMode') : t('nav.darkMode')}
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu Button & Toggles */}
        <div className="md:hidden flex items-center gap-3">
          <button 
            onClick={toggleLanguage}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gunmetal text-ink font-medium text-xs hover:text-signal transition-colors"
          >
            {currentLang}
          </button>
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
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-fog hover:text-ink transition-colors font-medium">{t('nav.about')}</a>
          <a href="#experience" onClick={() => setIsMobileMenuOpen(false)} className="text-fog hover:text-ink transition-colors font-medium">{t('nav.experience')}</a>
          <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="text-fog hover:text-ink transition-colors font-medium">{t('nav.projects')}</a>
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-fog hover:text-ink transition-colors font-medium">{t('nav.contact')}</a>
        </div>
      </div>
    </header>
  );
}