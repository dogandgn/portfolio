import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-gunmetal bg-void mt-24">
      <div className="max-w-[1344px] mx-auto px-6 py-16">
        
        <div className="mb-4">
          <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">İletişim</span>
        </div>
        <div className="mb-12">
          <h2 className="text-3xl md:text-[32px] font-bold text-white leading-snug tracking-tight">
            İletişime <span className="text-signal">Geç</span>
          </h2>
          <p className="text-ash text-sm mt-2 max-w-md">
            Projeleriniz veya iş birliği fırsatları için benimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          <a href="mailto:doganaric@gmail.com" className="group bg-deep border border-gunmetal rounded-[24px] p-5 flex flex-col items-center text-center hover:border-signal/40 transition-all">
            <div className="w-11 h-11 rounded-xl bg-signal/10 flex items-center justify-center mb-3 group-hover:bg-signal/20 transition-colors">
              <i className="fa-solid fa-envelope text-signal text-base"></i>
            </div>
            <span className="text-muted text-[10px] uppercase tracking-[0.7em] mb-1">E-Posta</span>
            <span className="text-white text-sm font-medium">doganaric@gmail.com</span>
          </a>

          <a href="tel:+905392032768" className="group bg-deep border border-gunmetal rounded-[24px] p-5 flex flex-col items-center text-center hover:border-signal/40 transition-all">
            <div className="w-11 h-11 rounded-xl bg-signal/10 flex items-center justify-center mb-3 group-hover:bg-signal/20 transition-colors">
              <i className="fa-solid fa-phone text-signal text-base"></i>
            </div>
            <span className="text-muted text-[10px] uppercase tracking-[0.7em] mb-1">Telefon</span>
            <span className="text-white text-sm font-medium">+90 539 203 27 68</span>
          </a>

          <a href="https://github.com/dogandgn" target="_blank" rel="noreferrer" className="group bg-deep border border-gunmetal rounded-[24px] p-5 flex flex-col items-center text-center hover:border-signal/40 transition-all">
            <div className="w-11 h-11 rounded-xl bg-steel/20 flex items-center justify-center mb-3 group-hover:bg-steel/30 transition-colors">
              <i className="fa-brands fa-github text-white text-base"></i>
            </div>
            <span className="text-muted text-[10px] uppercase tracking-[0.7em] mb-1">GitHub</span>
            <span className="text-white text-sm font-medium">dogandgn</span>
          </a>

          <a href="https://linkedin.com/in/doganaric" target="_blank" rel="noreferrer" className="group bg-deep border border-gunmetal rounded-[24px] p-5 flex flex-col items-center text-center hover:border-signal/40 transition-all">
            <div className="w-11 h-11 rounded-xl bg-signal/10 flex items-center justify-center mb-3 group-hover:bg-signal/20 transition-colors">
              <i className="fa-brands fa-linkedin-in text-signal text-base"></i>
            </div>
            <span className="text-muted text-[10px] uppercase tracking-[0.7em] mb-1">LinkedIn</span>
            <span className="text-white text-sm font-medium">doganaric</span>
          </a>

        </div>

        <div className="flex justify-center mb-12">
          <a href="/cv.jpg" download className="inline-flex items-center gap-2 bg-signal text-white px-6 py-3 rounded-full font-medium text-sm hover:brightness-110 transition-all">
            <i className="fa-solid fa-download"></i>
            CV İndir
          </a>
        </div>

        <div className="border-t border-gunmetal pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold text-white tracking-tight">
              Doğan <span className="text-signal">Ariç</span>
            </h3>
            <p className="text-muted text-xs mt-1">
              © {currentYear} Tüm hakları saklıdır.
            </p>
          </div>
          <p className="text-pewter text-xs">Şehir Plancısı & CBS Geliştiricisi</p>
        </div>

      </div>
    </footer>
  );
}