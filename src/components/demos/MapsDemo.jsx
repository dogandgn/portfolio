import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

const categories = [
  {
    id: 'arsa',
    label: 'Arsa',
    icon: 'fa-vector-square',
    color: '#38bdf8',
    parcels: [
      { id: 'a1', label: '2741/3 — Konut Alanı', ada: 2741, parsel: 3, alan: '1.240 m²', imar: 'Konut Alanı', coords: [[41.0155, 28.9745], [41.0155, 28.9785], [41.0135, 28.9785], [41.0135, 28.9745]] },
      { id: 'a2', label: '2741/7 — Park ve Yeşil Alan', ada: 2741, parsel: 7, alan: '860 m²', imar: 'Park Alanı', coords: [[41.0135, 28.9745], [41.0135, 28.9785], [41.0115, 28.9785], [41.0115, 28.9745]] },
      { id: 'a3', label: '3052/1 — Eğitim Tesis Alanı', ada: 3052, parsel: 1, alan: '3.580 m²', imar: 'Eğitim Alanı', coords: [[41.0115, 28.9745], [41.0115, 28.9785], [41.0095, 28.9785], [41.0095, 28.9745]] },
    ]
  },
  {
    id: 'konut',
    label: 'Konut',
    icon: 'fa-building',
    color: '#f59e0b',
    parcels: [
      { id: 'k1', label: '1180/12 — Toplu Konut Projesi', ada: 1180, parsel: 12, alan: '5.120 m²', imar: 'Toplu Konut', coords: [[41.0155, 28.9800], [41.0155, 28.9850], [41.0135, 28.9850], [41.0135, 28.9800]] },
      { id: 'k2', label: '1180/15 — Karma Kullanım', ada: 1180, parsel: 15, alan: '2.750 m²', imar: 'Karma Kullanım', coords: [[41.0135, 28.9800], [41.0135, 28.9850], [41.0115, 28.9850], [41.0115, 28.9800]] },
      { id: 'k3', label: '1523/4 — Sosyal Donatı Alanı', ada: 1523, parsel: 4, alan: '1.960 m²', imar: 'Sosyal Donatı', coords: [[41.0115, 28.9800], [41.0115, 28.9850], [41.0095, 28.9850], [41.0095, 28.9800]] },
    ]
  }
];

function FlyToParcel({ coords }) {
  const map = useMap();
  if (coords && coords.length > 0) {
    const lat = coords.reduce((s, c) => s + c[0], 0) / coords.length;
    const lng = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    map.flyTo([lat, lng], 16, { duration: 0.8 });
  }
  return null;
}

export default function MapsDemo() {
  const [openCategories, setOpenCategories] = useState({ arsa: true, konut: true });
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [split3D, setSplit3D] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);

  const toggleCategory = (id) => {
    setOpenCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectParcel = (parcel, catColor) => {
    setSelectedParcel({ ...parcel, catColor });
    setSplit3D(false);
    setFlyTarget(parcel.coords);
  };

  const closePanel = () => {
    setSelectedParcel(null);
    setSplit3D(false);
  };

  const allParcels = categories.flatMap(cat =>
    cat.parcels.map(p => ({ ...p, catColor: cat.color }))
  );

  return (
    <div className="w-full rounded-xl overflow-hidden flex flex-col lg:flex-row relative shadow-2xl border border-slate-700/60 bg-slate-950">
      
      <div className="w-full lg:w-72 bg-slate-900/95 border-b lg:border-b-0 lg:border-r border-slate-700/50 flex flex-col shrink-0 z-20 max-h-[300px] lg:max-h-none">
        
        <div className="p-3 border-b border-slate-700/50 flex items-center gap-2 bg-slate-800/60">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center">
            <i className="fa-solid fa-map-location-dot text-sky-400 text-sm"></i>
          </div>
          <span className="text-white text-sm font-bold tracking-wide">Taşınmaz Yönetimi</span>
        </div>

        <div className="p-2 border-b border-slate-700/30">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-500 text-xs"></i>
            <input 
              type="text" 
              placeholder="Kayıt ara..."
              className="w-full bg-slate-800/80 border border-slate-700/50 rounded-lg text-xs text-white px-8 py-2 outline-none focus:border-sky-500/60 transition-colors placeholder-slate-500"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {categories.map(cat => (
            <div key={cat.id}>
              <button 
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-slate-800/40 hover:bg-slate-800/70 border-b border-slate-700/30 transition-colors"
              >
                <i className={`fa-solid ${openCategories[cat.id] ? 'fa-angle-down' : 'fa-angle-right'} text-slate-400 text-xs w-4`}></i>
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }}></div>
                <span className="text-slate-200 text-sm font-semibold flex-grow text-left">{cat.label}</span>
                <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 rounded">{cat.parcels.length}</span>
              </button>

              <AnimatePresence>
                {openCategories[cat.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {cat.parcels.map(p => {
                      const isSelected = selectedParcel?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => selectParcel(p, cat.color)}
                          className={`w-full flex items-center gap-2 pl-9 pr-3 py-2 text-left border-b border-slate-800/50 transition-all text-xs
                            ${isSelected 
                              ? 'bg-sky-500/15 text-white border-l-2 border-l-sky-400' 
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-l-transparent'
                            }`}
                        >
                          <i className={`fa-solid fa-vector-square text-[10px] ${isSelected ? 'text-sky-400' : 'text-slate-600'}`}></i>
                          <span className="truncate">{p.label}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700/50 bg-slate-800/40 p-2">
          <div className="flex items-center justify-around text-slate-400">
            <button className="flex flex-col items-center gap-0.5 hover:text-sky-400 transition-colors p-1.5 rounded">
              <i className="fa-solid fa-ruler-combined text-sm"></i>
              <span className="text-[9px]">Ölçüm</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 hover:text-sky-400 transition-colors p-1.5 rounded">
              <i className="fa-solid fa-table text-sm"></i>
              <span className="text-[9px]">Öznitelik</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 hover:text-sky-400 transition-colors p-1.5 rounded">
              <i className="fa-solid fa-file-pdf text-sm"></i>
              <span className="text-[9px]">Rapor</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row relative" style={{ minHeight: '400px' }}>
        
        <div className={`relative transition-all duration-500 h-[400px] lg:h-auto ${split3D ? 'lg:w-1/2' : 'w-full'}`}>
          <MapContainer 
            center={[41.0125, 28.9800]} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            
            {flyTarget && <FlyToParcel coords={flyTarget} />}

            {allParcels.map(p => (
              <Polygon 
                key={p.id}
                positions={p.coords}
                pathOptions={{ 
                  color: selectedParcel?.id === p.id ? '#fff' : p.catColor, 
                  weight: selectedParcel?.id === p.id ? 3 : 1.5, 
                  fillColor: p.catColor, 
                  fillOpacity: selectedParcel?.id === p.id ? 0.5 : 0.2 
                }}
                eventHandlers={{ click: () => selectParcel(p, p.catColor) }}
              >
                <Popup>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>Ada: {p.ada} / Parsel: {p.parsel}</div>
                  <div style={{ fontSize: 12 }}>{p.alan} — {p.imar}</div>
                </Popup>
              </Polygon>
            ))}
          </MapContainer>

          <div className="absolute top-3 left-3 z-[400] flex flex-col gap-1.5">
            <button className="w-7 h-7 bg-slate-900/90 text-white border border-slate-600/50 hover:bg-slate-700 flex items-center justify-center rounded text-xs"><i className="fa-solid fa-plus"></i></button>
            <button className="w-7 h-7 bg-slate-900/90 text-white border border-slate-600/50 hover:bg-slate-700 flex items-center justify-center rounded text-xs"><i className="fa-solid fa-minus"></i></button>
            <button className="w-7 h-7 bg-slate-900/90 text-white border border-slate-600/50 hover:bg-slate-700 flex items-center justify-center rounded text-xs mt-1"><i className="fa-solid fa-expand"></i></button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-[400] bg-slate-900/80 backdrop-blur-sm text-slate-300 px-3 py-1 text-[10px] font-mono flex items-center gap-3 border-t border-slate-700/30">
            <span className="text-sky-400">WGS84</span>
            <span>41.0125° K</span>
            <span>28.9800° D</span>
          </div>
        </div>

        <AnimatePresence>
          {split3D && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '50%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="hidden lg:flex h-full bg-slate-800 relative overflow-hidden items-center justify-center border-l-2 border-sky-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-slate-700/30 to-slate-900/80"></div>
              <div className="relative z-10" style={{ perspective: '600px' }}>
                <div style={{ transform: 'rotateX(55deg) rotateZ(45deg)' }} className="relative">
                  <div className="w-48 h-48 bg-slate-600/40 border border-slate-500/30 absolute"></div>
                  <div className="w-16 h-16 absolute top-4 left-6" style={{ transform: 'translateZ(50px)' }}>
                    <div className="w-full h-full bg-amber-400/80 border border-amber-500 shadow-xl"></div>
                  </div>
                  <div className="w-12 h-20 absolute top-6 right-8" style={{ transform: 'translateZ(70px)' }}>
                    <div className="w-full h-full bg-sky-400/80 border border-sky-500 shadow-xl"></div>
                  </div>
                  <div className="w-10 h-10 absolute bottom-6 left-14" style={{ transform: 'translateZ(30px)' }}>
                    <div className="w-full h-full bg-emerald-400/80 border border-emerald-500 shadow-xl"></div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-slate-900/70 px-2 py-1 rounded">3B Görünüm (Temsili)</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedParcel && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            className="w-full lg:w-72 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-700/50 shadow-2xl z-[1000] flex flex-col lg:absolute lg:top-0 lg:right-0 lg:h-full"
          >
            <div className="p-3 flex items-center justify-between border-b border-slate-700/50 bg-slate-800/60">
              <button onClick={closePanel} className="text-slate-400 hover:text-white transition-colors">
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <span className="text-white text-sm font-bold">Taşınmaz Detay</span>
              <button onClick={closePanel} className="text-slate-400 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-700/30 text-center">
              <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: selectedParcel.catColor + '20', border: `1px solid ${selectedParcel.catColor}40` }}>
                <i className="fa-solid fa-map-pin" style={{ color: selectedParcel.catColor }}></i>
              </div>
              <h4 className="text-white font-bold text-sm">Ada: {selectedParcel.ada} / Parsel: {selectedParcel.parsel}</h4>
              <p className="text-slate-400 text-xs mt-1">{selectedParcel.alan} — {selectedParcel.imar}</p>
            </div>

            <div className="flex-grow p-3 space-y-2 overflow-y-auto custom-scrollbar">
              {[
                { icon: 'fa-file-lines', text: 'Mekansal Analiz', color: 'text-sky-400', bg: 'bg-sky-500/10' },
                { icon: 'fa-file-signature', text: 'Geometrik Özellikler', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                { icon: 'fa-map-pin', text: 'İmar Uygunluk', color: 'text-rose-400', bg: 'bg-rose-500/10' },
                { icon: 'fa-money-bill-transfer', text: 'Proje Geliştirme Süreçleri', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: 'fa-sack-dollar', text: 'Finansal Göstergeler', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              ].map((item, idx) => (
                <div key={idx} className={`${item.bg} border border-slate-700/30 p-3 rounded-lg hover:border-slate-600/50 cursor-pointer flex items-center transition-all`}>
                  <i className={`fa-solid ${item.icon} ${item.color} w-5 text-center mr-2.5 text-sm`}></i>
                  <span className="text-slate-200 text-xs font-medium">{item.text}</span>
                  <i className="fa-solid fa-chevron-right text-slate-600 text-[10px] ml-auto"></i>
                </div>
              ))}

              <div 
                onClick={() => setSplit3D(!split3D)}
                className={`border p-3 rounded-lg cursor-pointer flex items-center transition-all
                  ${split3D ? 'bg-sky-500/20 border-sky-500/40 ring-1 ring-sky-500/20' : 'bg-sky-500/10 border-slate-700/30 hover:border-slate-600/50'}`}
              >
                <i className="fa-solid fa-cube text-sky-400 w-5 text-center mr-2.5 text-sm"></i>
                <span className="text-white text-xs font-medium">3B Veriler</span>
                <i className={`fa-solid ${split3D ? 'fa-toggle-on text-sky-400' : 'fa-toggle-off text-slate-600'} ml-auto`}></i>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/30 p-3 rounded-lg hover:border-slate-600/50 cursor-pointer flex items-center transition-all">
                <i className="fa-solid fa-building-columns text-slate-400 w-5 text-center mr-2.5 text-sm"></i>
                <span className="text-slate-300 text-xs font-medium">Dış Sistem Entegrasyonu</span>
                <i className="fa-solid fa-external-link text-slate-600 text-[10px] ml-auto"></i>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
