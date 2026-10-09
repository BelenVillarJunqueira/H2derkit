import React from 'react';
import { ShieldCheck, Truck, Lock, PhoneCall, Mail, Clock } from 'lucide-react';
import { StoreContent } from '../types/store';

interface FooterProps {
  content: StoreContent;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  content,
  onOpenTracking,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-black text-sm">
                H₂
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                H2<span className="text-purple-400">derm</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tratamientos biotecnológicos de grado profesional formulados para restaurar la salud cutánea, eliminar la sequedad y devolver la luminosidad natural del rostro.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sitio Oficial & Certificado SSL 256-Bit</span>
              </div>
              <div> H2derm - Argentina</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navegación Rápida
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <a href="#producto-oferta" className="hover:text-white transition-colors">
                  Kit Rostro H2derm (Oferta 50% OFF)
                </a>
              </li>
              <li>
                <a href="#antes-despues" className="hover:text-white transition-colors">
                  Resultados Clínicos Antes y Después
                </a>
              </li>
              <li>
                <a href="#rutina-pasos" className="hover:text-white transition-colors">
                  Los 4 Pasos de la Rutina
                </a>
              </li>
              <li>
                <a href="#opiniones-clientes" className="hover:text-white transition-colors">
                  Reseñas Verificadas ({content.ratingCount})
                </a>
              </li>
              <li>
                <button 
                  onClick={onOpenTracking}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1 text-purple-300"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Seguimiento de Envíos en Vivo</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              PROBÁ NUESTROS PRODUCTOS
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>Garantía de Satisfacción</span>


              </div>
              <div className="flex items-center gap-2">

                <span>Calidad testeada</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Envíos a todo el país</span>

                
              </div>
            </div>
          </div>

          {/* Logistics & Payment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Logística & Pagos Seguros
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {content.shippingCarriersText}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded">
                Mercado Pago
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded">
                Visa / Master
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded">
                Contraentrega
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded">
                Transferencia CBU
              </span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} H2derm®. Todos los derechos reservados. Tienda Oficial de Cosmética Profesional.
          </div>

          {/* Hidden Admin Access trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
              title="Panel de Administración (Pedidos, Textos y Pasarelas)"
            >
              <Lock className="w-3 h-3" />
              <span>Admin H2derm</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
