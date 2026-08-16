import React from 'react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#070a13]/70 backdrop-blur-md border-b border-white/5 shadow-sm">
      <nav className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-white tracking-wide cursor-pointer">
          Doğan <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Ariç</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-slate-300 font-medium">
          <a href="#about" className="hover:text-sky-400 transition">Hakkımda</a>
          <a href="#experience" className="hover:text-sky-400 transition">Kariyer</a>
          <a href="#projects" className="hover:text-sky-400 transition">Projeler</a>
        </div>
      </nav>
    </header>
  );
}