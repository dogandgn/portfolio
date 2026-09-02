import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

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
    <div className="bg-deep/60 rounded-lg border border-gunmetal overflow-hidden">
      <div className="px-3 py-2 bg-deep border-b border-gunmetal flex items-center justify-between">
        <span className="text-xs text-fog font-semibold">Katman Ağacı</span>
        <span className="text-[10px] text-signal bg-signal/10 px-2 py-0.5 rounded-full">{activeCount} aktif</span>
      </div>
      <div className="divide-y divide-gunmetal">
        {items.map(item => (
          <button key={item.id} onClick={() => toggle(item.id)} className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-void/50 transition-colors text-left">
            <i className={`fa-${item.checked ? 'solid fa-square-check text-signal' : 'regular fa-square text-steel'} text-sm`}></i>
            <span className={`text-xs ${item.checked ? 'text-silver' : 'text-pewter'}`}>{item.label}</span>
            {item.checked && <Motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 rounded-full bg-signal ml-auto"></Motion.div>}
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
    <div className="bg-deep/60 rounded-lg border border-gunmetal p-3">
      <div className="text-[10px] text-ash uppercase tracking-wider mb-2">Bölge Filtresi</div>
      <div className="flex flex-wrap gap-1.5">
        {filters.map(f => (
          <button key={f} onClick={() => setSelected(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selected === f ? 'bg-signal/10 text-signal border border-signal/40' : 'bg-gunmetal/50 text-ash hover:text-silver border border-transparent'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-pewter flex items-center gap-1.5">
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
    <div className="bg-deep/60 rounded-lg border border-gunmetal overflow-hidden">
      <div className="p-3">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2 text-pewter text-xs"></i>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ada veya parsel ara..." className="w-full bg-void/60 border border-gunmetal rounded-lg text-xs text-ink pl-8 pr-3 py-2 outline-none focus:border-signal/60" />
        </div>
      </div>
      {filtered.length > 0 && (
        <div className="border-t border-gunmetal divide-y divide-gunmetal">
          {filtered.map((r, i) => (
            <div key={i} className="px-3 py-2 hover:bg-void/50 cursor-pointer flex items-center gap-2 text-xs text-fog">
              <i className="fa-solid fa-location-dot text-signal text-[10px]"></i>
              {r}
            </div>
          ))}
        </div>
      )}
      {query && filtered.length === 0 && <div className="px-3 py-2 text-[10px] text-pewter border-t border-gunmetal">Sonuç bulunamadı</div>}
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
    <div className="bg-deep/60 rounded-lg border border-gunmetal p-3 space-y-3">
      <div className="flex items-center gap-2 text-xs text-fog">
        <i className="fa-solid fa-table text-signal"></i>
        <span>3 aktif katman • 12 sütun seçili</span>
      </div>
      <button onClick={doExport} disabled={exporting} className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${exporting ? 'bg-gunmetal text-ash' : done ? 'bg-signal text-ink' : 'bg-signal/10 text-signal hover:bg-signal/30 border border-signal/40'}`}>
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
    <div className="bg-deep/60 rounded-lg border border-gunmetal p-3 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-fog"><i className="fa-solid fa-file-pdf text-signal mr-1.5"></i>Bilgi Paftası</span>
        <span className="text-[10px] text-pewter">A4 Dikey</span>
      </div>
      {(running || progress === 100) && (
        <div>
          <div className="w-full h-1.5 bg-void rounded-full overflow-hidden">
            <Motion.div className={`h-full rounded-full ${progress === 100 ? 'bg-signal' : 'bg-signal/80'}`} animate={{ width: `${progress}%` }}></Motion.div>
          </div>
          <p className={`text-[10px] mt-1 ${progress === 100 ? 'text-signal' : 'text-pewter'}`}>
            {progress === 100 ? '✓ PDF oluşturuldu' : `Ekran görüntüsü alınıyor... %${progress}`}
          </p>
        </div>
      )}
      <button onClick={generate} disabled={running} className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${running ? 'bg-gunmetal text-ash' : 'bg-signal/10 text-signal hover:bg-signal/30 border border-signal/40'}`}>
        <i className={`fa-solid ${running ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
        {running ? 'Oluşturuluyor...' : 'PDF Oluştur'}
      </button>
    </div>
  );
}

function AdminInteractive() {
  const [values, setValues] = useState({ search: true, export: true, theme: 'Koyu' });
  return (
    <div className="bg-deep/60 rounded-lg border border-gunmetal p-3 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-fog">Arama İzni</span>
        <button onClick={() => setValues(v => ({ ...v, search: !v.search }))} className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${values.search ? 'bg-signal justify-end' : 'bg-steel justify-start'}`}>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </button>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-fog">Dışa Aktarım</span>
        <button onClick={() => setValues(v => ({ ...v, export: !v.export }))} className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${values.export ? 'bg-signal justify-end' : 'bg-steel justify-start'}`}>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </button>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-fog">Tema</span>
        <select value={values.theme} onChange={e => setValues(v => ({ ...v, theme: e.target.value }))} className="bg-void text-fog border border-gunmetal rounded text-[10px] px-2 py-1 outline-none">
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
      
      <div className="bg-deep border border-gunmetal rounded-xl p-4 md:p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-signal/15 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-cubes text-signal"></i>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-ink">Custom Widget Mimarisi</h3>
            <p className="text-signal text-xs font-semibold tracking-wider uppercase mt-0.5">ArcGIS Experience Builder — React.js & TypeScript</p>
          </div>
        </div>
        <p className="text-ash text-sm leading-relaxed">
          Karmaşık mekansal verilerin hiyerarşik olarak yönetilmesini, katmanlar arası çapraz filtreleme yapılmasını ve harita üzerindeki verilerin otomatik olarak kurumsal formatta Excel ve PDF raporlarına dönüştürülmesini sağlayan özel widget sistemi. Yöneticiler tüm kuralları koda müdahale etmeden ayarlar arayüzünden yapılandırabilir.
        </p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {['React.js', 'TypeScript', 'ArcGIS Maps SDK', 'Jimu Core/UI', 'CSS Grid', 'XLSX'].map(t => (
            <span key={t} className="bg-gunmetal border border-graphite/50 px-2.5 py-1 rounded-md text-[10px] text-signal/80 font-mono">{t}</span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {widgets.map(w => {
          const isOpen = openWidget === w.id;
          const InteractiveComponent = interactiveMap[w.id];
          
          return (
            <div key={w.id} className={`rounded-xl border transition-all overflow-hidden ${isOpen ? 'border-graphite/60 bg-deep/60' : 'border-gunmetal bg-deep/30 hover:bg-deep/50'}`}>
              <button onClick={() => toggle(w.id)} className="w-full flex items-center gap-3 p-3 md:p-4 text-left transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: w.color + '18', border: `1px solid ${w.color}30` }}>
                  <i className={`fa-solid ${w.icon} text-sm`} style={{ color: w.color }}></i>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className={`text-sm font-semibold ${isOpen ? 'text-ink' : 'text-silver'}`}>{w.title}</h4>
                  <p className="text-[10px] text-pewter truncate">{w.subtitle}</p>
                </div>
                <Motion.i
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="fa-solid fa-chevron-down text-pewter text-xs shrink-0"
                ></Motion.i>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <Motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-4 md:px-4 md:pb-5">
                      <div className="flex flex-col lg:flex-row gap-4">
                        
                        <div className="w-full lg:w-1/2">
                          <div className="text-[10px] text-pewter uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
                            <i className="fa-solid fa-play text-[8px]"></i> İnteraktif Demo
                          </div>
                          <InteractiveComponent />
                        </div>

                        <div className="w-full lg:w-1/2">
                          <div className="text-[10px] text-pewter uppercase tracking-wider mb-2 font-semibold">Özellikler</div>
                          <div className="space-y-2">
                            {w.features.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-fog leading-relaxed">
                                <i className="fa-solid fa-check text-[8px] mt-1.5 shrink-0" style={{ color: w.color }}></i>
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
