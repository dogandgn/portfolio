import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-void/95 backdrop-blur-md border-b border-gunmetal' : 'bg-transparent'}`}>
      <nav className="w-full px-6 h-[62px] flex justify-between items-center max-w-[1344px] mx-auto">
        <a href="#" className="text-xl font-bold text-ink tracking-tight">
          Doğan <span className="text-signal">Ariç</span>
        </a>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-fog hover:text-ink transition-colors text-[15px] font-medium">Hakkımda</a>
          <a href="#experience" className="text-fog hover:text-ink transition-colors text-[15px] font-medium">Kariyer</a>
          <a href="#projects" className="text-fog hover:text-ink transition-colors text-[15px] font-medium">Projeler</a>
          <a href="#contact" className="bg-ink text-deep px-5 py-2 rounded-full text-sm font-medium hover:bg-signal transition-all">İletişim</a>
        </div>
      </nav>
    </header>
  );
}