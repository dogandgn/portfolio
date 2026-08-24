import React from 'react';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="px-6 pt-36 pb-24 max-w-[1344px] mx-auto flex flex-col items-start justify-center min-h-[85vh]">
      <div className="max-w-3xl">
        <h1 className="text-6xl md:text-[68px] font-bold text-ink mb-4 tracking-[-0.02em] leading-none">
          DOĞAN ARİÇ
        </h1>
        <h2 className="text-3xl md:text-[44px] font-bold text-ink mb-4 leading-tight tracking-[-0.02em]">
          Şehir Plancısı <span className="text-steel font-normal">&</span> <br />
          <span className="text-signal">
            CBS Geliştiricisi
          </span>
        </h2>
        <h3 className="text-lg md:text-xl text-muted font-normal tracking-wide mb-12">
          (Urban Planner and GIS Developer)
        </h3>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <a href="mailto:doganaric@gmail.com" className="inline-flex items-center justify-center gap-2 bg-ink text-deep px-6 py-3 rounded-full text-sm font-medium hover:bg-signal transition-all">
            <i className="fa-solid fa-envelope"></i>
            E-Posta
          </a>
          <a href="tel:+905392032768" className="inline-flex items-center justify-center gap-2 bg-transparent text-ink border border-graphite px-6 py-3 rounded-full text-sm font-medium hover:border-ink transition-all">
            <i className="fa-solid fa-phone"></i>
            Telefon
          </a>
          <a href="/cv.jpg" download className="inline-flex items-center justify-center gap-2 bg-signal text-ink px-6 py-3 rounded-full text-sm font-medium hover:bg-deep-signal transition-all">
            <i className="fa-solid fa-download"></i>
            CV İndir
          </a>
          <Button href="https://github.com/dogandgn" primary={false}>
            <i className="fa-brands fa-github mr-2"></i>GitHub
          </Button>
          <Button href="https://www.linkedin.com/in/doganaric" primary={false}>
            <i className="fa-brands fa-linkedin-in mr-2"></i>LinkedIn
          </Button>
        </div>
      </div>
    </section>
  );
}