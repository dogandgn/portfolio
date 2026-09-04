import React, { useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';

export default function AuthDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="flex h-full min-h-[34rem] w-full items-center justify-center bg-[#0b0d0f] p-6 text-white md:p-10">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[14%] left-[12%] h-44 w-44 rounded-full bg-signal/10 blur-3xl" />
        <div className="absolute right-[8%] bottom-[12%] h-56 w-56 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#151719] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal text-sm font-black text-black">K</div>
            <div>
              <p className="text-sm font-semibold">Kurumsal CBS Portalı</p>
              <p className="text-[11px] text-white/40">Güvenli oturum yönetimi</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Enterprise
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!isAuthenticated ? (
            <Motion.div
              key="login"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.2 }}
              className="p-6 md:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-signal/25 bg-signal/10 text-signal">
                <i className="fa-solid fa-shield-halved text-lg" />
              </div>
              <h3 className="mt-5 text-xl font-bold">Güvenli Giriş</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Harita paneline geçmek için kurumsal portal hesabınızla oturum açın.
              </p>

              <div className="mt-6 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">Portal bağlantısı</p>
                <p className="mt-1.5 truncate font-mono text-xs text-white/65">enterprise.kurum.local/portal</p>
              </div>

              <button
                type="button"
                onClick={() => setIsAuthenticated(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-signal px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-amber-300"
              >
                <i className="fa-solid fa-right-to-bracket" />
                Kurumsal Hesap ile Giriş
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/35">
                <i className="fa-solid fa-lock" />
                OAuth2 ve ArcGIS Identity Manager
              </p>
            </Motion.div>
          ) : (
            <Motion.div
              key="profile"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.2 }}
              className="p-6 md:p-8"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-signal text-base font-black text-black">DA</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-lg font-bold">Doğan Ariç</h3>
                    <i className="fa-solid fa-circle-check text-xs text-emerald-400" />
                  </div>
                  <p className="mt-0.5 text-sm text-white/45">CBS Geliştiricisi</p>
                </div>
              </div>

              <dl className="mt-6 divide-y divide-white/10 rounded-lg border border-white/10 bg-black/20 px-4">
                <div className="flex items-center justify-between gap-4 py-3 text-xs">
                  <dt className="text-white/40">Oturum durumu</dt>
                  <dd className="flex items-center gap-1.5 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Aktif</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3 text-xs">
                  <dt className="text-white/40">Yetkili sayfa</dt>
                  <dd className="text-white/70">Ana Harita Paneli</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3 text-xs">
                  <dt className="text-white/40">Kimlik sağlayıcı</dt>
                  <dd className="text-white/70">ArcGIS Enterprise</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-xs text-emerald-300">
                <i className="fa-solid fa-check" />
                Yetkili sayfaya yönlendirme tamamlandı.
              </div>

              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
              >
                <i className="fa-solid fa-arrow-right-from-bracket" />
                Güvenli Çıkış
              </button>
            </Motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between border-t border-white/10 bg-black/20 px-5 py-3 text-[10px] text-white/30">
          <span>user-profile-logout</span>
          <span className="flex items-center gap-1.5"><i className="fa-solid fa-code" />Builder koruması aktif</span>
        </div>
      </div>
    </div>
  );
}
