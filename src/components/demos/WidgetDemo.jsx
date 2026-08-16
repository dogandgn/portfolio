import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const widgets = [
  {
    id: 'layer-manager',
    title: 'Hiyerarşik Katman Yöneticisi',
    subtitle: 'Dinamik Kırılım ve Harita Senkronizasyonu',
    icon: 'fa-layer-group',
    color: '#38bdf8',
    description: '',
    features: [
      'Katman verilerini öznitelik sütunlarına göre otomatik alt klasörlere ayırır',
      'Listeden yapılan seçimler haritadaki görünürlük ile anlık senkronize olur',
      'Verisi kalmayan gruplar kendini otomatik gizler'
    ]
  },
  {
    id: 'group-filter',
    title: 'Çapraz Katman Filtreleme',
    subtitle: 'Group Filter Mekanizması',
    icon: 'fa-filter',
    color: '#a78bfa',
    description: '',
    features: [
      'Farklı katmanlardaki ortak öznitelikleri (İlçe, Fonksiyon vb.) birbirine bağlar',
      'Tek merkezden tüm haritayı ve listeleri eşzamanlı filtreler',
      'Dinamik bağımlılık yönetimi ile tutarlı veri görünümü sağlar'
    ]
  },
  {
    id: 'search-engine',
    title: 'Güvenli Arama Motoru',
    subtitle: 'SQL Injection Korumalı Global Arama',
    icon: 'fa-magnifying-glass',
    color: '#34d399',
    description: '',
    features: [
      'SQL Injection korumalı yapı ile tüm katmanlarda global arama yapar',
      'Seçilen sonuca haritada otomatik odaklanır (Pan/Highlight)',
      'İlgili klasörü açarak veriyi ağaç yapısında konumlandırır'
    ]
  },
  {
    id: 'smart-export',
    title: 'Akıllı Excel Aktarımı',
    subtitle: 'Smart Export — Çok Sekmeli Dışa Aktarım',
    icon: 'fa-file-excel',
    color: '#f59e0b',
    description: '',
    features: [
      'Yalnızca aktif (seçili) katmanları ve yöneticinin izin verdiği sütunları algılar',
      'Unix Timestamp gibi ham verileri okunabilir formata dönüştürür',
      'Çok sekmeli (multi-sheet) Excel dosyası üretir'
    ]
  },
  {
    id: 'pdf-report',
    title: 'Otomatik Bilgi Paftası Üretimi',
    subtitle: 'Off-screen Map Mimarisi ile PDF Oluşturma',
    icon: 'fa-file-pdf',
    color: '#fb7185',
    description: '',
    features: [
      'İmar planı, uydu ve konum altlıklarının ekran görüntülerini alır',
      'Parsele ait dron/arazi fotoğraflarını (Attachments) çeker',
      'ID üzerinden ek tablolardaki bilgileri (Virtual Join) getirir',
      'CSS Grid şablonuna yerleştirerek A4 PDF formatında dışa aktarır'
    ]
  },
  {
    id: 'admin-panel',
    title: 'Gelişmiş Yönetici Paneli',
    subtitle: 'No-Code Settings Arayüzü',
    icon: 'fa-sliders',
    color: '#60a5fa',
    description: '',
    features: [
      'Arama/filtreleme kısıtlamalarını arayüzden yapılandırır',
      'Renk/tipografi ayarlarını ve imar altlık seçimlerini yönetir',
      'Veri yetkilendirmelerini koda müdahale etmeden düzenler'
    ]
  }
];

function LayerManagerInteractive() {
  const [items, setItems] = useState([
    { id: 1, label: 'Konut Alanı', checked: true },
    { id: 2, label: 'Ticaret Alanı', checked: true },
    { id: 3, label: 'Yeşil Alan', checked: false },
    { id: 4, label: 'Eğitim Alanı', checked: true },
  ]);
  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const activeCount = items.filter(i => i.checked).length;

  return (
    <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <div className="px-3 py-2 bg-slate-800 border-b border-slate-700/50 flex items-center justify-between">
        <span className="text-xs text-slate-300 font-semibold">Katman Ağacı</span>
        <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">{activeCount} aktif</span>
      </div>
      <div className="divide-y divide-slate-700/30">
        {items.map(item => (
          <button key={item.id} onClick={() => toggle(item.id)} className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-700/30 transition-colors text-left">
            <i className={`fa-${item.checked ? 'solid fa-square-check text-sky-400' : 'regular fa-square text-slate-600'} text-sm`}></i>
            <span className={`text-xs ${item.checked ? 'text-slate-200' : 'text-slate-500'}`}>{item.label}</span>
            {item.checked && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 rounded-full bg-sky-400 ml-auto"></motion.div>}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterInteractive() {
  const [selected, setSelected] = useState('Tümü');
  const filters = ['Tümü', 'Merkez', 'Kuzey', 'Güney'];
  return (
    <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 p-3">
      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Bölge Filtresi</div>
      <div className="flex flex-wrap gap-1.5">
        {filters.map(f => (
          <button key={f} onClick={() => setSelected(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selected === f ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' : 'bg-slate-700/50 text-slate-400 hover:text-slate-200 border border-transparent'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-slate-500 flex items-center gap-1.5">
        <i className="fa-solid fa-circle-info"></i>
        <span>Seçim tüm katmanlara uygulanır</span>
      </div>
    </div>
  );
}

function SearchInteractive() {
  const [query, setQuery] = useState('');
  const results = ['2741/3 — Konut Alanı', '1180/12 — Toplu Konut', '3052/1 — Eğitim Tesis'];
  const filtered = query ? results.filter(r => r.toLowerCase().includes(query.toLowerCase())) : [];
  return (
    <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <div className="p-3">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2 text-slate-500 text-xs"></i>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ada veya parsel ara..." className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg text-xs text-white pl-8 pr-3 py-2 outline-none focus:border-emerald-500/60" />
        </div>
      </div>
      {filtered.length > 0 && (
        <div className="border-t border-slate-700/30 divide-y divide-slate-700/20">
          {filtered.map((r, i) => (
            <div key={i} className="px-3 py-2 hover:bg-slate-700/30 cursor-pointer flex items-center gap-2 text-xs text-slate-300">
              <i className="fa-solid fa-location-dot text-emerald-400 text-[10px]"></i>
              {r}
            </div>
          ))}
        </div>
      )}
      {query && filtered.length === 0 && <div className="px-3 py-2 text-[10px] text-slate-500 border-t border-slate-700/30">Sonuç bulunamadı</div>}
    </div>
  );
}

function ExcelInteractive() {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);
  const doExport = () => {
    setExporting(true); setDone(false);
    setTimeout(() => { setExporting(false); setDone(true); }, 2000);
  };
  return (
    <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 p-3 space-y-3">
      <div className="flex items-center gap-2 text-xs text-slate-300">
        <i className="fa-solid fa-table text-amber-400"></i>
        <span>3 aktif katman • 12 sütun seçili</span>
      </div>
      <button onClick={doExport} disabled={exporting} className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${exporting ? 'bg-slate-700 text-slate-400' : done ? 'bg-emerald-600 text-white' : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'}`}>
        <i className={`fa-solid ${exporting ? 'fa-spinner fa-spin' : done ? 'fa-check' : 'fa-download'}`}></i>
        {exporting ? 'Hazırlanıyor...' : done ? 'İndirildi!' : 'Excel Olarak İndir'}
      </button>
    </div>
  );
}

function PdfInteractive() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const generate = () => {
    setRunning(true); setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(iv); setRunning(false); return 100; } return p + 4; });
    }, 60);
  };
  return (
    <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 p-3 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-300"><i className="fa-solid fa-file-pdf text-rose-400 mr-1.5"></i>Bilgi Paftası</span>
        <span className="text-[10px] text-slate-500">A4 Dikey</span>
      </div>
      {(running || progress === 100) && (
        <div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <motion.div className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-400' : 'bg-rose-400'}`} animate={{ width: `${progress}%` }}></motion.div>
          </div>
          <p className={`text-[10px] mt-1 ${progress === 100 ? 'text-emerald-400' : 'text-slate-500'}`}>
            {progress === 100 ? '✓ PDF oluşturuldu' : `Ekran görüntüsü alınıyor... %${progress}`}
          </p>
        </div>
      )}
      <button onClick={generate} disabled={running} className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${running ? 'bg-slate-700 text-slate-400' : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'}`}>
        <i className={`fa-solid ${running ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
        {running ? 'Oluşturuluyor...' : 'PDF Oluştur'}
      </button>
    </div>
  );
}

function AdminInteractive() {
  const [values, setValues] = useState({ search: true, export: true, theme: 'Koyu' });
  return (
    <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 p-3 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-300">Arama İzni</span>
        <button onClick={() => setValues(v => ({ ...v, search: !v.search }))} className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${values.search ? 'bg-sky-500 justify-end' : 'bg-slate-600 justify-start'}`}>
          <div className="w-4 h-4 bg-white rounded-full shadow"></div>
        </button>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-300">Dışa Aktarım</span>
        <button onClick={() => setValues(v => ({ ...v, export: !v.export }))} className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${values.export ? 'bg-sky-500 justify-end' : 'bg-slate-600 justify-start'}`}>
          <div className="w-4 h-4 bg-white rounded-full shadow"></div>
        </button>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-300">Tema</span>
        <select value={values.theme} onChange={e => setValues(v => ({ ...v, theme: e.target.value }))} className="bg-slate-900 text-slate-300 border border-slate-700/50 rounded text-[10px] px-2 py-1 outline-none">
          <option>Koyu</option>
          <option>Açık</option>
        </select>
      </div>
    </div>
  );
}

const interactiveMap = {
  'layer-manager': LayerManagerInteractive,
  'group-filter': FilterInteractive,
  'search-engine': SearchInteractive,
  'smart-export': ExcelInteractive,
  'pdf-report': PdfInteractive,
  'admin-panel': AdminInteractive,
};

export default function WidgetDemo() {
  const [openWidget, setOpenWidget] = useState(null);

  const toggle = (id) => {
    setOpenWidget(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full space-y-4">
      
      <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4 md:p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-cubes text-sky-400"></i>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white">Custom Widget Mimarisi</h3>
            <p className="text-sky-400 text-xs font-semibold tracking-wider uppercase mt-0.5">ArcGIS Experience Builder — React.js & TypeScript</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Karmaşık mekansal verilerin hiyerarşik olarak yönetilmesini, katmanlar arası çapraz filtreleme yapılmasını ve harita üzerindeki verilerin otomatik olarak kurumsal formatta Excel ve PDF raporlarına dönüştürülmesini sağlayan özel widget sistemi. Yöneticiler tüm kuralları koda müdahale etmeden ayarlar arayüzünden yapılandırabilir.
        </p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {['React.js', 'TypeScript', 'ArcGIS Maps SDK', 'Jimu Core/UI', 'CSS Grid', 'XLSX'].map(t => (
            <span key={t} className="bg-slate-800/80 border border-slate-700/50 px-2.5 py-1 rounded-md text-[10px] text-sky-300/80 font-mono">{t}</span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {widgets.map(w => {
          const isOpen = openWidget === w.id;
          const InteractiveComponent = interactiveMap[w.id];
          
          return (
            <div key={w.id} className={`rounded-xl border transition-all overflow-hidden ${isOpen ? 'border-slate-600/60 bg-slate-900/60' : 'border-slate-700/30 bg-slate-900/30 hover:bg-slate-900/50'}`}>
              <button onClick={() => toggle(w.id)} className="w-full flex items-center gap-3 p-3 md:p-4 text-left transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: w.color + '18', border: `1px solid ${w.color}30` }}>
                  <i className={`fa-solid ${w.icon} text-sm`} style={{ color: w.color }}></i>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className={`text-sm font-semibold ${isOpen ? 'text-white' : 'text-slate-200'}`}>{w.title}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{w.subtitle}</p>
                </div>
                <motion.i 
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="fa-solid fa-chevron-down text-slate-500 text-xs shrink-0"
                ></motion.i>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-4 md:px-4 md:pb-5">
                      <div className="flex flex-col lg:flex-row gap-4">
                        
                        <div className="w-full lg:w-1/2">
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
                            <i className="fa-solid fa-play text-[8px]"></i> İnteraktif Demo
                          </div>
                          <InteractiveComponent />
                        </div>

                        <div className="w-full lg:w-1/2">
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Özellikler</div>
                          <div className="space-y-2">
                            {w.features.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                                <i className="fa-solid fa-check text-[8px] mt-1.5 shrink-0" style={{ color: w.color }}></i>
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
