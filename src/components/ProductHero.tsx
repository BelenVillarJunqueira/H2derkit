import React from 'react';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  Clock, 
  CreditCard, 
  Eye, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { StoreContent, MediaItem } from '../types/store';
import { MediaCarousel } from './MediaCarousel';
import { PackSelector } from './PackSelector';

interface ProductHeroProps {
  content: StoreContent;
  media: MediaItem[];
  selectedPackId: string;
  onSelectPack: (packId: string) => void;
  onBuyNow: () => void;
}

export const ProductHero: React.FC<ProductHeroProps> = ({
  content,
  media,
  selectedPackId,
  onSelectPack,
  onBuyNow
}) => {
  const selectedPack = content.packs.find(p => p.id === selectedPackId) || content.packs[1] || content.packs[0];

  return (
    <section id="producto-oferta" className="py-6 sm:py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Column Left: Media Carousel (Sticky on Desktop) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <MediaCarousel media={media} />
          </div>

          {/* Column Right: High Conversion Buying Engine */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Top Kicker & Reviews */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {content.productKicker}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Stock Disponible
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {content.productTitle}
              </h1>

              {/* Star rating + Live Viewers */}
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800 ml-1">{content.ratingScore}</span>
                  <a href="#opiniones-clientes" className="underline hover:text-purple-700 ml-0.5">
                    ({content.ratingCount.toLocaleString('es-AR')} opiniones verificadas)
                  </a>
                </div>

                <span className="text-slate-300">·</span>

                <div className="flex items-center gap-1 text-purple-900 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
                  <Eye className="w-3.5 h-3.5 text-purple-700 animate-pulse" />
                  <span>{content.viewersCount} personas viendo esto</span>
                </div>
              </div>
            </div>

            {/* Tagline / Subtitle */}
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              {content.productTagline}
            </p>

            {/* Urgency Stock Bar */}
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500 animate-bounce" />
                  ¡Últimas {content.stockRemaining} unidades con tarifa promocional!
                </span>
                <span className="text-amber-800 text-[11px]">89% reservado</span>
              </div>
              <div className="w-full bg-amber-200/60 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full w-[89%]" />
              </div>
            </div>

            {/* Pack Selector (Quantity Breaks) */}
            <PackSelector
              packs={content.packs}
              selectedPackId={selectedPackId}
              currencySymbol={content.currencySymbol}
              onSelectPack={onSelectPack}
            />

            {/* Huge Buy Button (Urgent CTA) */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onBuyNow}
                className="w-full relative group bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 hover:from-purple-900 hover:via-purple-800 hover:to-indigo-900 text-white font-extrabold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-xl shadow-purple-950/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden border border-purple-600"
              >
                {/* Shimmer light effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out" />
                
                <div className="relative flex flex-col items-center justify-center">
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                    COMPRAR AHORA · ENVÍO GRATIS
                  </span>
                  <span className="text-xs font-normal text-purple-200 mt-0.5">
                    Paga en 3 Cuotas Sin Interés o en Efectivo al Recibir
                  </span>
                </div>
              </button>

              <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <CreditCard className="w-3.5 h-3.5 text-purple-700" />
                  Mercado Pago Protegido
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-medium">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Pago Contraentrega
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-medium">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  30 Días Garantía
                </span>
              </div>
            </div>

            {/* Payment & Security Logos Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Pasarelas & Métodos Aceptados:</span>
                <span className="text-emerald-700 text-[11px] font-extrabold">SSL 256-Bit Encriptado</span>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-slate-600">
                <span className="bg-sky-100 text-sky-800 font-bold px-2 py-1 rounded text-[11px]">
                  Mercado Pago
                </span>
                <span className="bg-slate-200 text-slate-800 font-bold px-2 py-1 rounded text-[11px]">
                  Visa / Mastercard
                </span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded text-[11px]">
                  Contraentrega (Efectivo)
                </span>
                <span className="bg-purple-100 text-purple-800 font-bold px-2 py-1 rounded text-[11px]">
                  Transferencia -10% OFF
                </span>
              </div>
            </div>

            {/* What you receive highlight */}
            <div className="border border-purple-200 bg-purple-50/50 rounded-xl p-4 text-xs space-y-2">
              <h4 className="font-extrabold text-purple-950 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-700" />
                ¿Qué incluye cada Kit H2derm Oficial?
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-700" />
                  <span><strong>1x Espuma de limpieza</strong> suave para el rostro</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-700" />
                  <span><strong>1x Serum </strong> con ADN liposomado</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-700" />
                  <span><strong>1x Crema Humectante 24h</strong> con ácido Hialurónico</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-700" />
                  <span><strong>1x Crema Reestructurante</strong> para rostro, cuello y escote</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductHero;
