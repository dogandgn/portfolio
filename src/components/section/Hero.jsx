import React from 'react';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="px-6 pt-32 pb-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between min-h-[80vh]">
      <div className="max-w-3xl">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
          DOĞAN ARIÇ
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Şehir Plancısı <span className="text-sky-500/50 font-light">&</span> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            CBS Geliştiricisi
          </span>
        </h2>
        <h3 className="text-xl md:text-2xl text-slate-400 font-medium tracking-wide mb-10">
          (Urban Planner and GIS Developer)
        </h3>
        <div className="flex flex-wrap gap-3">
          <a href="mailto:doganaric@gmail.com" className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-sky-900/30">
            <i className="fa-solid fa-envelope"></i>
            E-Posta
          </a>
          <a href="tel:+905392032768" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-emerald-900/30">
            <i className="fa-solid fa-phone"></i>
            Telefon
          </a>
          <Button href="https://github.com/dogandgn" primary={false}>
            GitHub
          </Button>
          <Button href="https://www.linkedin.com/in/doganaric" primary={false}>
            LinkedIn
          </Button>
        </div>
      </div>
    </section>
  );
}