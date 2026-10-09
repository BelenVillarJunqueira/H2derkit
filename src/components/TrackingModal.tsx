import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  ExternalLink,
  PhoneCall,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { OrderItem } from '../types/store';
import { findOrderByTracking } from '../services/storage';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackingCode?: string;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  isOpen,
  onClose,
  initialTrackingCode = ''
}) => {
  const [query, setQuery] = useState(initialTrackingCode);
  const [order, setOrder] = useState<OrderItem | null>(
    initialTrackingCode ? findOrderByTracking(initialTrackingCode) : null
  );
  const [searched, setSearched] = useState(Boolean(initialTrackingCode));

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = findOrderByTracking(query.trim());
    setOrder(found);
    setSearched(true);
  };

  const statusSteps = [
    { key: 'confirmed', label: 'Confirmado', desc: 'Pago o reserva verificada' },
    { key: 'preparing', label: 'Empaquetado', desc: 'Laboratorio H2derm' },
    { key: 'shipped', label: 'Despachado', desc: 'En centro logístico' },
    { key: 'in_transit', label: 'En Reparto', desc: 'Móvil hacia tu puerta' },
    { key: 'delivered', label: 'Entregado', desc: 'Recibido en domicilio' }
  ];

  const getStepIndex = (status: OrderItem['shippingStatus']): number => {
    switch (status) {
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'shipped': return 2;
      case 'in_transit': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.shippingStatus) : 0;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-full transition-colors cursor-pointer"
          aria-label="Cerrar modal de seguimiento"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6 text-left">
          <div className="flex items-center gap-1.5 text-purple-700 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            <span>Centro de Rastreos H2derm</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Seguimiento de Pedido en Tiempo Real
          </h3>
          <p className="text-xs text-slate-500">
            Ingresa tu código de tracking (ej. <span className="font-mono text-purple-700 font-bold">H2D-84920</span>), tu email o teléfono.
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: H2D-84920 o tu correo electrónico"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none uppercase placeholder:normal-case font-medium"
            />
          </div>
          <button
            type="submit"
            className="bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer shrink-0"
          >
            Rastrear
          </button>
        </form>

        {/* Result Area */}
        {order ? (
          <div className="space-y-6 text-left">
            
            {/* Top Order Card */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">Número de Envío:</span>
                <span className="font-mono text-lg font-black text-purple-950">
                  {order.trackingCode}
                </span>
                <div className="text-xs text-slate-600 mt-0.5">
                  Destinatario: <strong>{order.customerName}</strong> ({order.city})
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] font-bold text-slate-500 block">Transportista Asignado:</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg inline-block mt-0.5">
                  {order.carrier}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2">
              <div className="relative flex items-center justify-between">
                {/* Connecting Line */}
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-purple-700 transition-all duration-500 z-0"
                  style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 95}%` }}
                />

                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-purple-700 text-white shadow-md ring-4 ring-purple-100'
                            : 'bg-slate-200 text-slate-500'
                        } ${isCurrent ? 'scale-110' : ''}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-bold mt-1.5 text-center max-w-[65px] leading-tight ${
                          isCompleted ? 'text-purple-900 font-extrabold' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline history */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
              <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                Bitácora de Movimientos
              </h5>
              <div className="space-y-2.5">
                {order.statusHistory.slice().reverse().map((hist, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-purple-700 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{hist.title}</strong>
                        <span className="text-[11px] text-slate-500 font-mono">{hist.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{hist.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp help button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span>¿Tienes dudas sobre la entrega?</span>
              <a
                href={`https://wa.me/5491149208842?text=Hola,%20quisiera%20consultar%20sobre%20mi%20pedido%20${order.trackingCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Consultar soporte por WhatsApp
              </a>
            </div>

          </div>
        ) : searched ? (
          <div className="py-8 text-center space-y-3 bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h4 className="font-extrabold text-slate-800 text-sm">
              No encontramos ningún pedido con ese identificador
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Verifica haber escrito correctamente tu código (ej: <strong>H2D-84920</strong>) o el email utilizado al comprar.
            </p>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">
            Tip: Puedes probar con el código de prueba <button onClick={() => { setQuery('H2D-84920'); setOrder(findOrderByTracking('H2D-84920')); setSearched(true); }} className="text-purple-700 font-bold underline cursor-pointer">H2D-84920</button> para ver un ejemplo en vivo.
          </div>
        )}

      </div>
    </div>
  );
};
