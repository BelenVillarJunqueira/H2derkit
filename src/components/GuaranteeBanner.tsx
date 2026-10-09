import React from 'react';
import { ShieldCheck, RotateCcw, ArrowRight } from 'lucide-react';
import { StoreContent } from '../types/store';

interface GuaranteeBannerProps {
  content: StoreContent;
  onCtaClick: () => void;
}

export const GuaranteeBanner: React.FC<GuaranteeBannerProps> = ({
  content,
  onCtaClick
}) => {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-50 via-purple-50/40 to-slate-50 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
          
          {/* Gold Shield Icon */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex flex-col items-center justify-center shrink-0 shadow-xl border-4 border-white rotate-1 hover:rotate-0 transition-transform">
            <RotateCcw className="w-10 h-10 text-slate-950 stroke-[2.5]" />
            <span className="font-black text-xs uppercase tracking-tighter mt-1">30 DÍAS</span>
          </div>

          {/* Text & Button */}
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              0% Riesgo · 100% Satisfacción
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {content.guaranteeTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {content.guaranteeText}
            </p>
            <div className="pt-2">
              <button
                onClick={onCtaClick}
                className="bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Asegurar Mi Kit H2derm con Garantía</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
