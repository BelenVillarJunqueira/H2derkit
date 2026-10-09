import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { StoreContent } from '../types/store';

interface RoutineStepsSectionProps {
  content: StoreContent;
  onCtaClick: () => void;
}

export const RoutineStepsSection: React.FC<RoutineStepsSectionProps> = ({
  content,
  onCtaClick
}) => {
  const steps = content.routineSteps && content.routineSteps.length > 0 ? content.routineSteps : [];

  return (
    <section id="rutina-pasos" className="py-12 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Fácil de usar · Resultados en 14 días
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {content.routineTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {content.routineSubtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.number || idx}
              className="bg-slate-50/70 rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs flex flex-col hover:border-purple-300 transition-all hover:shadow-md"
            >
              {/* Image with Step number tag */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop';
                  }}
                />
                <div className="absolute top-3 left-3 bg-purple-900 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                  PASO {step.number}
                </div>
                {step.time && (
                  <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {step.time}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-purple-700">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {step.description}
                  </p>
                </div>

                {/* Benefits list */}
                {step.benefits && step.benefits.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-700">
                    {step.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick summary banner */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-bold text-purple-950 text-base">
              Apto para todo tipo de piel · Especialmente pieles secas y sensibles
            </h4>
            <p className="text-xs text-purple-800">
              Testeado dermatológicamente, no comedogénico (no tapa poros) y libre de sulfatos y parabenos.
            </p>
          </div>
          <button
            onClick={onCtaClick}
            className="shrink-0 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            Comprar Kit con Descuento
          </button>
        </div>

      </div>
    </section>
  );
};
