import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { StoreContent } from '../types/store';

export interface BeforeAfterSectionProps {
  content: StoreContent;
  onCtaClick: () => void;
}

export const BeforeAfterSection: React.FC<BeforeAfterSectionProps> = ({
  content,
  onCtaClick
}) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSliderPos(percent);
  };

  const beforeImg = content.beforeImage || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1200&auto=format&fit=crop';
  const afterImg = content.afterImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop';
  const stats = content.clinicalStats && content.clinicalStats.length > 0 ? content.clinicalStats : [];

  return (
    <section id="antes-despues" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            Evidencia Clínica Comprobada
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {content.beforeAfterTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {content.beforeAfterSubtitle}
          </p>
        </div>

        {/* 2-column: Interactive Slider + Results data */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Interactive Comparison Slider */}
          <div className="lg:col-span-7">
            <div
              className="relative w-full aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden shadow-xl border-4 border-white select-none cursor-ew-resize bg-slate-200"
              onMouseMove={handleSliderMove}
              onTouchMove={handleSliderMove}
            >
              {/* After Image (Background layer) */}
              <img
                src={afterImg}
                alt="Después H2derm - Piel radiante y luminosa"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop';
                }}
              />
              <div className="absolute top-4 right-4 z-10 bg-emerald-700/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{content.afterLabel}</span>
              </div>

              {/* Before Image (Clipped layer) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={beforeImg}
                  alt="Antes H2derm - Piel con sequedad o manchas"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1200&auto=format&fit=crop';
                  }}
                />
                <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {content.beforeLabel}
                </div>
              </div>

              {/* Slider Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                {/* Drag handle button */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-700 text-white flex items-center justify-center shadow-2xl border-2 border-white">
                  <span className="text-[10px] font-black tracking-tighter">◀ ▶</span>
                </div>
              </div>

              {/* Bottom hint */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1 rounded-full pointer-events-none">
                ↔ Desliza para comparar el cambio
              </div>
            </div>

            {/* Description cards beneath slider */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-extrabold text-slate-800 block mb-1">
                  ❌ {content.beforeLabel}
                </span>
                <p className="text-slate-600 leading-snug">
                  {content.beforeDescription}
                </p>
              </div>

              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                <span className="font-extrabold text-purple-900 block mb-1">
                  ✨ {content.afterLabel}
                </span>
                <p className="text-slate-700 leading-snug">
                  {content.afterDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Results & Transformation Stats */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-purple-900">{stat.percentage}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {stat.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {stat.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stat.description}
                  </p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-700 h-full rounded-full" 
                      style={{ width: stat.percentage.includes('%') ? stat.percentage : `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Direct CTA */}
            <button
              onClick={onCtaClick}
              className="w-full bg-slate-900 hover:bg-purple-900 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer group"
            >
              <span>Quiero Renovar Mi Piel Hoy Mismo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default BeforeAfterSection;