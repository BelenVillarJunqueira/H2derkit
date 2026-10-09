import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  Menu, 
  X, 
  Sparkles,
  Lock,
  PhoneCall
} from 'lucide-react';
import { StoreContent } from '../types/store';

interface NavbarProps {
  content: StoreContent;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  content,
  cartCount,
  onOpenCart,
  onOpenTracking,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Mobile hamburger & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-purple-700 focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-900 via-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-900/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight">H₂</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                  H2<span className="text-purple-700">derm</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 hidden sm:inline-block">
                    Oficial
                  </span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold hidden sm:inline">
                  Dermocosmética Profesional
                </span>
              </div>
            </a>
          </div>

          {/* Center: Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => scrollToSection('producto-oferta')}
              className="hover:text-purple-700 transition-colors cursor-pointer"
            >
              Kit Rostro
            </button>
            <button 
              onClick={() => scrollToSection('antes-despues')}
              className="hover:text-purple-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Antes y Después
            </button>
            <button 
              onClick={() => scrollToSection('rutina-pasos')}
              className="hover:text-purple-700 transition-colors cursor-pointer"
            >
              Los 4 Pasos
            </button>
            <button 
              onClick={() => scrollToSection('opiniones-clientes')}
              className="hover:text-purple-700 transition-colors cursor-pointer"
            >
              Reseñas ({content.ratingCount})
            </button>
            <button 
              onClick={() => scrollToSection('preguntas-frecuentes')}
              className="hover:text-purple-700 transition-colors cursor-pointer"
            >
              Preguntas
            </button>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Seguimiento de pedido */}
            <button
              onClick={onOpenTracking}
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-lg transition-colors cursor-pointer border border-slate-200"
              title="Consultar estado de envío"
            >
              <Truck className="w-3.5 h-3.5 text-purple-700" />
              <span>Seguir Pedido</span>
            </button>

            {/* Carrito / Comprar Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-purple-800 to-purple-700 hover:from-purple-900 hover:to-purple-800 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md shadow-purple-900/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Comprar Kit</span>
              <span className="sm:hidden">Comprar</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center -ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Secret / Discret Admin lock button */}
            <button
              onClick={onOpenAdmin}
              title="Panel de Administración (Pedidos, Textos y Pasarelas)"
              className="p-2 text-slate-400 hover:text-purple-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Acceso administrador"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" /> Distribuidor Oficial H2derm
            </span>
            <span className="text-purple-700 font-bold">Atención 24/7</span>
          </div>

          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            <button 
              onClick={() => scrollToSection('producto-oferta')}
              className="text-left py-2 px-3 rounded-lg hover:bg-purple-50 hover:text-purple-800"
            >
              🛍️ Oferta Especial Kit Rostro
            </button>
            <button 
              onClick={() => scrollToSection('antes-despues')}
              className="text-left py-2 px-3 rounded-lg hover:bg-purple-50 hover:text-purple-800"
            >
              ✨ Resultados Antes y Después
            </button>
            <button 
              onClick={() => scrollToSection('rutina-pasos')}
              className="text-left py-2 px-3 rounded-lg hover:bg-purple-50 hover:text-purple-800"
            >
              🧴 Los 4 Pasos de la Rutina
            </button>
            <button 
              onClick={() => scrollToSection('opiniones-clientes')}
              className="text-left py-2 px-3 rounded-lg hover:bg-purple-50 hover:text-purple-800"
            >
              ⭐ Reseñas de Clientes ({content.ratingCount})
            </button>
            <button 
              onClick={() => scrollToSection('preguntas-frecuentes')}
              className="text-left py-2 px-3 rounded-lg hover:bg-purple-50 hover:text-purple-800"
            >
              ❓ Preguntas Frecuentes
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-800 rounded-xl font-bold text-sm"
            >
              <Truck className="w-4 h-4 text-purple-700" />
              Seguimiento de Mi Pedido en Vivo
            </button>

            <a
              href={`https://wa.me/${content.whatsappNumber.replace(/\D/g, '')}?text=Hola!%20Quiero%20consultar%20por%20el%20Kit%20H2derm`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 text-emerald-700 bg-emerald-50 rounded-xl font-semibold text-xs border border-emerald-200"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Consultas por WhatsApp ({content.whatsappNumber})
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
