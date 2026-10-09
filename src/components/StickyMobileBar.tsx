import React from 'react';
import { ShoppingBag, Zap } from 'lucide-react';
import { ProductPack } from '../types/store';

interface StickyMobileBarProps {
  selectedPack: ProductPack;
  currencySymbol: string;
  onBuyNow: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  selectedPack,
  currencySymbol,
  onBuyNow
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-between gap-3">
        {/* Pack title + price */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black text-purple-700 truncate max-w-[150px]">
              {selectedPack.title}
            </span>
            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">
              Envío Gratis
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-900 leading-tight">
              {currencySymbol}{selectedPack.salePrice.toLocaleString('es-AR')}
            </span>
            <span className="text-[11px] text-slate-400 line-through">
              {currencySymbol}{selectedPack.originalPrice.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Buy Now Button */}
        <button
          onClick={onBuyNow}
          className="flex-1 max-w-[190px] bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 active:scale-98 text-white font-black text-xs py-3 px-3 rounded-xl shadow-lg shadow-purple-900/30 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-tight"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
          <span>Comprar Ahora</span>
        </button>
      </div>
    </div>
  );
};
