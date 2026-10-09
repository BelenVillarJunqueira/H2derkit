import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Play, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { MediaItem } from '../types/store';

interface MediaCarouselProps {
  media: MediaItem[];
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({ media }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Safety check: if media array is empty or index is out of bounds
  if (!media || media.length === 0) {
    return (
      <div className="w-full aspect-square sm:aspect-4/3 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-3 shadow-inner">
          <Sparkles className="w-6 h-6" />
        </div>
        <h4 className="font-extrabold text-slate-800 text-sm">
          Aún no has cargado fotos para el carrusel
        </h4>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Accede al panel de administración para subir tus fotos y videos desde tu computadora.
        </p>
      </div>
    );
  }

  const safeIndex = Math.max(0, Math.min(selectedIndex, media.length - 1));
  const currentItem = media[safeIndex];

  const handlePrev = () => {
    setSelectedIndex((safeIndex - 1 + media.length) % media.length);
  };

  const handleNext = () => {
    setSelectedIndex((safeIndex + 1) % media.length);
  };

  return (
    <div className="w-full select-none">
      {/* Main Display Stage */}
      <div className="relative w-full aspect-square sm:aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 shadow-lg border border-slate-200/80 group">
        
        {/* Badge in top left */}
        {currentItem.badge && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-purple-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{currentItem.badge}</span>
          </div>
        )}

        {/* Zoom button in top right */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-3 right-3 z-20 bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 p-2 rounded-full shadow-md backdrop-blur-xs transition-all hover:scale-105"
          title="Ver en pantalla completa"
          aria-label="Ver en pantalla completa"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Content item: Video or Image */}
        {currentItem.type === 'video' ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <video
              key={currentItem.url}
              src={currentItem.url}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Video overlay controls */}
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-[11px] font-semibold text-white/90 bg-black/50 px-2 py-0.5 rounded-full">
                Video Demostrativo
              </span>
            </div>
          </div>
        ) : (
          <img
            key={currentItem.url}
            src={currentItem.url}
            alt={currentItem.title || 'Producto H2derm'}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-102"
            onError={(e) => {
              // Fallback if URL fails
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=900&auto=format&fit=crop';
            }}
          />
        )}

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Imagen anterior"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer border border-slate-200/50"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 -ml-0.5" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Imagen siguiente"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer border border-slate-200/50"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 -mr-0.5" />
        </button>

        {/* Counter Pill in bottom right */}
        <div className="absolute bottom-3 right-3 z-20 bg-slate-950/75 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {safeIndex + 1} / {media.length}
        </div>
      </div>

      {/* Thumbnails row */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {media.map((item, idx) => {
          const isActive = idx === safeIndex;
          return (
            <button
              key={item.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-purple-700 ring-2 ring-purple-400/50 scale-102 shadow-md'
                  : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={item.type === 'video' ? (item.thumbnail || item.url) : item.url}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=300&auto=format&fit=crop';
                }}
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Trust bar beneath images */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-600 bg-purple-50/60 border border-purple-100 rounded-xl p-2.5">
        <div className="flex flex-col items-center justify-center gap-0.5">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span>Fórmula Clínica</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-0.5 border-x border-purple-200/60 px-1">
          <span className="text-emerald-700 font-bold text-xs">Cruelty Free</span>
          <span>No Testeado en Animales</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-0.5">
          <span className="text-purple-900 font-bold text-xs">100% Puro</span>
          <span>Sin Parabenos</span>
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {isZoomOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-black p-2.5 rounded-full transition-all"
            aria-label="Cerrar vista completa"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.type === 'video' ? (
              <video
                src={currentItem.url}
                controls
                autoPlay
                className="max-w-full max-h-[75vh] rounded-xl shadow-2xl"
              />
            ) : (
              <img
                src={currentItem.url}
                alt={currentItem.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />
            )}
            <p className="text-white text-sm font-semibold mt-3 text-center">
              {currentItem.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
