import React from 'react';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-gunmetal mt-24">
      <div className="max-w-[1344px] mx-auto px-6 py-16">
        
        <div className="mb-4">
          <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">İletişim</span>
        </div>
        <div className="mb-12">
          <h2 className="text-3xl md:text-[32px] font-bold text-ink leading-snug tracking-tight">
            İletişime <span className="text-signal">Geç</span>
          </h2>
          <p className="text-muted text-sm mt-2 max-w-md">
            Projeleriniz veya iş birliği fırsatları için benimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          <a href="mailto:doganaric@gmail.com" className="group bg-deep border border-gunmetal rounded-2xl p-5 flex flex-col items-center text-center hover:border-signal/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-signal/10 flex items-center justify-center mb-3 group-hover:bg-signal/20 transition-colors">
              <i className="fa-solid fa-envelope text-signal text-base"></i>
            </div>
            <span className="text-muted text-[10px] uppercase tracking-[0.7em] mb-1">E-Posta</span>
            <span className="text-ink text-sm font-medium">doganaric@gmail.com</span>
          </a>

          <a href="tel:+905392032768" className="group bg-deep border border-gunmetal rounded-2xl p-5 flex flex-col items-center text-center hover:border-signal/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-signal/10 flex items-center justify-center mb-3 group-hover:bg-signal/20 transition-colors">
              <i className="fa-solid fa-phone text-signal text-base"></i>
            </div>
            <span className="text-muted text-[10px] uppercase tracking-[0.7em] mb-1">Telefon</span>
            <span className="text-ink text-sm font-medium">+90 539 203 27 68</span>
          </a>

          <a href="https://github.com/dogandgn" target="_blank" rel="noreferrer" className="group bg-deep border border-gunmetal rounded-2xl p-5 flex flex-col items-center text-center hover:border-signal/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-ink/5 flex items-center justify-center mb-3 group-hover:bg-ink/10 transition-colors">
              <i className="fa-brands fa-github text-ink text-base"></i>
            </div>
            <span className="text-muted text-[10px] uppercase tracking-[0.7em] mb-1">GitHub</span>
            <span className="text-ink text-sm font-medium">dogandgn</span>
          </a>

          <a href="https://linkedin.com/in/doganaric" target="_blank" rel="noreferrer" className="group bg-deep border border-gunmetal rounded-2xl p-5 flex flex-col items-center text-center hover:border-signal/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-signal/10 flex items-center justify-center mb-3 group-hover:bg-signal/20 transition-colors">
              <i className="fa-brands fa-linkedin-in text-signal text-base"></i>
            </div>
            <span className="text-muted text-[10px] uppercase tracking-[0.7em] mb-1">LinkedIn</span>
            <span className="text-ink text-sm font-medium">doganaric</span>
          </a>

        </div>




      </div>
    </footer>
  );
}