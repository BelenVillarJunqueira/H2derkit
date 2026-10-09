import React, { useState, useEffect } from 'react';
import { Truck, Clock, Sparkles, Bell, ShieldCheck } from 'lucide-react';
import { StoreContent } from '../types/store';

interface AnnouncementBarProps {
  content: StoreContent;
  onOpenTracking: () => void;
  onOpenPushPrompt: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  content,
  onOpenTracking,
  onOpenPushPrompt
}) => {
  // Urgency countdown: starts at countdownMinutes and ticks down
  const [secondsLeft, setSecondsLeft] = useState(content.countdownMinutes * 60 + 38);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 14 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <aside aria-label="Anuncios y promociones" className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white text-xs py-2 px-3 sm:px-4 shadow-sm border-b border-purple-800/40 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-4 text-center md:text-left">
        {/* Left message with icons */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-purple-100 font-medium">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shadow-sm animate-pulse">
            <Sparkles className="w-3 h-3" />
            OFERTA RELÁMPAGO
          </span>
          <span className="hidden sm:inline text-purple-300">|</span>
          <span className="flex items-center gap-1.5 font-semibold text-white">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            ENVÍO GRATIS A TODO EL PAÍS
          </span>
          <span className="text-purple-300">·</span>
          <span className="text-purple-200">3 CUOTAS SIN INTERÉS O PAGO AL RECIBIR</span>
        </div>

        {/* Right side: Countdown + Quick links */}
        <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-purple-200">
          <div className="flex items-center gap-1 bg-purple-950/70 border border-purple-700/50 px-2 py-0.5 rounded-full text-amber-300">
            <Clock className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>La oferta termina en:</span>
            <span className="font-mono font-bold text-white tracking-widest">{formattedTime}</span>
          </div>

          <button
            onClick={onOpenTracking}
            className="hover:text-white underline decoration-purple-400 underline-offset-2 transition-colors cursor-pointer flex items-center gap-1 text-purple-200"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Rastrear pedido</span>
          </button>

          <button
            onClick={onOpenPushPrompt}
            title="Activar avisos de despacho"
            className="hidden sm:flex items-center gap-1 hover:text-white text-purple-300 transition-colors cursor-pointer"
          >
            <Bell className="w-3 h-3 text-amber-300" />
            <span>Alertas</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
