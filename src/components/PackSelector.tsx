import React from 'react';
import { Check, Sparkles, Gift } from 'lucide-react';
import { ProductPack } from '../types/store';

interface PackSelectorProps {
  packs: ProductPack[];
  selectedPackId: string;
  currencySymbol: string;
  onSelectPack: (packId: string) => void;
}

export const PackSelector: React.FC<PackSelectorProps> = ({
  packs,
  selectedPackId,
  currencySymbol,
  onSelectPack
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <span>Elige tu Pack con Descuento:</span>
        </label>
        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
          Envío 100% Gratis en todos
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {packs.map((pack) => {
          const isSelected = pack.id === selectedPackId;
          const unitPrice = Math.round(pack.salePrice / pack.quantity);

          return (
            <div
              key={pack.id}
              onClick={() => onSelectPack(pack.id)}
              className={`relative rounded-2xl p-4 sm:p-4.5 cursor-pointer transition-all border-2 text-left ${
                isSelected
                  ? 'border-purple-800 bg-purple-50/40 shadow-md ring-2 ring-purple-600/30'
                  : 'border-slate-200 hover:border-purple-300 bg-white hover:bg-slate-50/60'
              }`}
            >
              {/* Badge if Popular or Best Savings */}
              {pack.badge && (
                <div className={`absolute -top-3 right-4 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1 ${
                  pack.isPopular
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950'
                    : 'bg-gradient-to-r from-purple-800 to-indigo-800 text-white'
                }`}>
                  <Sparkles className="w-3 h-3" />
                  {pack.badge}
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                {/* Radio check + Titles */}
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center border-2 transition-all shrink-0 ${
                    isSelected
                      ? 'border-purple-800 bg-purple-800 text-white'
                      : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                      {pack.title}
                      {pack.discountPercentage > 0 && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          -{pack.discountPercentage}%
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {pack.subtitle}
                    </p>

                    {/* Unit price mention if multi-pack */}
                    {pack.quantity > 1 && (
                      <p className="text-xs font-semibold text-purple-900 mt-1">
                        👉 Solo {currencySymbol}{unitPrice.toLocaleString('es-AR')} por kit
                      </p>
                    )}

                    {/* Free gift callout */}
                    {pack.freeGift && pack.freeGift.trim() !== '' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300/80">
                        <Gift className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{pack.freeGift}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing section on the right */}
                <div className="text-right shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400 line-through">
                      {currencySymbol}{pack.originalPrice.toLocaleString('es-AR')}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {currencySymbol}{pack.salePrice.toLocaleString('es-AR')}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">
                      Ahorras {currencySymbol}{pack.savings.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pack features bullets */}
              {Array.isArray(pack.features) && pack.features.filter(f => f && f.trim() !== '').length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 font-medium">
                  {pack.features.filter(f => f && f.trim() !== '').map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
