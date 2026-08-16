import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-slate-800 bg-slate-900/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            İletişime <span className="text-sky-400">Geç</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Projeleriniz veya iş birliği fırsatları için benimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <a href="mailto:doganaric@gmail.com" className="group bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col items-center text-center hover:border-sky-500/40 hover:bg-sky-500/5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-3 group-hover:bg-sky-500/20 transition-colors">
              <i className="fa-solid fa-envelope text-sky-400 text-lg"></i>
            </div>
            <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">E-Posta</span>
            <span className="text-white text-sm font-medium">doganaric@gmail.com</span>
          </a>

          <a href="tel:+905392032768" className="group bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col items-center text-center hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
              <i className="fa-solid fa-phone text-emerald-400 text-lg"></i>
            </div>
            <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Telefon</span>
            <span className="text-white text-sm font-medium">+90 539 203 27 68</span>
          </a>

          <a href="https://github.com/dogandgn" target="_blank" rel="noreferrer" className="group bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col items-center text-center hover:border-slate-500/40 hover:bg-slate-500/5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-slate-700/30 flex items-center justify-center mb-3 group-hover:bg-slate-600/30 transition-colors">
              <i className="fa-brands fa-github text-white text-lg"></i>
            </div>
            <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">GitHub</span>
            <span className="text-white text-sm font-medium">dogandgn</span>
          </a>

          <a href="https://linkedin.com/in/doganaric" target="_blank" rel="noreferrer" className="group bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col items-center text-center hover:border-blue-500/40 hover:bg-blue-500/5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
              <i className="fa-brands fa-linkedin-in text-blue-400 text-lg"></i>
            </div>
            <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">LinkedIn</span>
            <span className="text-white text-sm font-medium">doganaric</span>
          </a>

        </div>

        <div className="flex justify-center mb-12">
          <a href="#" className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-sky-900/30">
            <i className="fa-solid fa-download"></i>
            CV İndir
          </a>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white tracking-wide">
              Doğan <span className="text-sky-400">Ariç</span>
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              © {currentYear} Tüm hakları saklıdır.
            </p>
          </div>
          <p className="text-slate-600 text-xs">Şehir Plancısı & CBS Geliştiricisi</p>
        </div>

      </div>
    </footer>
  );
}