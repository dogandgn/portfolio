import React from 'react';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="px-6 pt-36 pb-24 max-w-[1344px] mx-auto flex flex-col items-start justify-center min-h-[85vh]">
      <div className="max-w-3xl">
        <h1 className="text-6xl md:text-[68px] font-bold text-white mb-4 tracking-[-0.02em] leading-none">
          DOĞAN ARİÇ
        </h1>
        <h2 className="text-3xl md:text-[44px] font-bold text-white mb-4 leading-tight tracking-[-0.02em]">
          Şehir Plancısı <span className="text-muted font-normal">&</span> <br />
          <span className="text-signal">
            CBS Geliştiricisi
          </span>
        </h2>
        <h3 className="text-lg md:text-xl text-ash font-normal tracking-wide mb-12">
          (Urban Planner and GIS Developer)
        </h3>
        <div className="flex flex-wrap gap-3">
          <a href="mailto:doganaric@gmail.com" className="inline-flex items-center gap-2 bg-signal text-white px-6 py-3 rounded-full text-sm font-medium hover:brightness-110 transition-all">
            <i className="fa-solid fa-envelope"></i>
            E-Posta
          </a>
          <a href="tel:+905392032768" className="inline-flex items-center gap-2 bg-transparent text-white border border-silver px-6 py-3 rounded-full text-sm font-medium hover:border-white transition-all">
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