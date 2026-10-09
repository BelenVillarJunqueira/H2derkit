import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, X, Bell } from 'lucide-react';
import { isPushSubscribed, setPushSubscribed } from '../services/storage';

export const LiveSalesNotifications: React.FC = () => {
  const [currentNotification, setCurrentNotification] = useState<{
    name: string;
    city: string;
    item: string;
    time: string;
  } | null>(null);

  const [showPushBanner, setShowPushBanner] = useState(false);
  const [pushStatus, setPushStatus] = useState<boolean>(isPushSubscribed());

  const sampleSales = [
    { name: 'Florencia B.', city: 'Palermo, CABA', item: '2x KITS ROSTRO H2derm (Más Vendido)', time: 'hace 2 minutos' },
    { name: 'Camila V.', city: 'Córdoba Capital', item: '3x KITS ROSTRO H2derm (Mejor Ahorro)', time: 'hace 4 minutos' },
    { name: 'Romina D.', city: 'Rosario, Santa Fe', item: '2x KITS ROSTRO H2derm', time: 'hace 6 minutos' },
    { name: 'Silvia M.', city: 'Mendoza', item: '1x KIT ROSTRO H2derm', time: 'hace 9 minutos' },
    { name: 'Agustina T.', city: 'Mar del Plata', item: '2x KITS ROSTRO H2derm', time: 'hace 11 minutos' }
  ];

  useEffect(() => {
    // Show a sales popup after 4 seconds, then rotate every 18 seconds
    const initialTimeout = setTimeout(() => {
      showRandomSale();
    }, 4000);

    const interval = setInterval(() => {
      showRandomSale();
    }, 22000);

    // Show push notification prompt once after 12 seconds if not subscribed
    const pushTimeout = setTimeout(() => {
      if (!isPushSubscribed()) {
        setShowPushBanner(true);
      }
    }, 12000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      clearTimeout(pushTimeout);
    };
  }, []);

  const showRandomSale = () => {
    const random = sampleSales[Math.floor(Math.random() * sampleSales.length)];
    setCurrentNotification(random);

    // Hide after 5 seconds
    setTimeout(() => {
      setCurrentNotification(null);
    }, 5500);
  };

  const handleEnablePush = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification('H2derm Oficial', {
            body: '¡Notificaciones activadas! Te avisaremos cuando tu pedido sea despachado y cuando haya ofertas exclusivas.',
            icon: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=200&auto=format&fit=crop'
          });
        }
      } catch (err) {
        console.log('Push notification simulated', err);
      }
    }
    setPushSubscribed(true);
    setPushStatus(true);
    setShowPushBanner(false);
  };

  return (
    <>
      {/* Social Proof Purchase Toast */}
      {currentNotification && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-purple-200/90 flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span className="font-extrabold text-slate-900">{currentNotification.name}</span>
              <span>en {currentNotification.city}</span>
            </div>
            <p className="text-xs font-bold text-purple-900 truncate">
              {currentNotification.item}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Compra verificada · {currentNotification.time}</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentNotification(null)}
            className="text-slate-400 hover:text-slate-700 p-1 -mr-1"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Push Notification Opt-in Prompt */}
      {showPushBanner && !pushStatus && (
        <div className="fixed top-20 right-4 z-40 max-w-sm bg-purple-950 text-white rounded-2xl p-4 shadow-2xl border border-purple-800 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <h5 className="font-extrabold text-xs text-white">
                ¿Deseas recibir el estado de tu pedido en tiempo real?
              </h5>
              <p className="text-[11px] text-purple-200 leading-snug">
                Activa las notificaciones instantáneas de seguimiento y descuentos exclusivos de H2derm.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleEnablePush}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Sí, Activar Alertas
                </button>
                <button
                  onClick={() => setShowPushBanner(false)}
                  className="text-purple-300 hover:text-white text-xs px-2 py-1.5 transition-colors cursor-pointer"
                >
                  Más tarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
