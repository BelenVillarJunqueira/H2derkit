import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Building2, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Gift, 
  ArrowRight,
  PhoneCall,
  Upload,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  ProductPack, 
  StoreContent, 
  PaymentGatewaysSettings, 
  PaymentMethodType, 
  OrderItem 
} from '../types/store';
import { createOrder, getPaymentGateways } from '../services/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPack: ProductPack;
  content: StoreContent;
  onOrderCompleted: (order: OrderItem) => void;
  onSelectPack: (packId: string) => void;
  onRemoveFromCart: () => void;
  isCartEmpty: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPack,
  content,
  onOrderCompleted,
  onSelectPack,
  onRemoveFromCart,
  isCartEmpty
}) => {
  const gateways = getPaymentGateways();

  // Customer shipping details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dni, setDni] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Buenos Aires');
  const [zipCode, setZipCode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('mercadopago');

  // Mercado Pago card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState(3);

  // Transfer proof file
  const [transferProof, setTransferProof] = useState<string | null>(null);
  const [copiedAlias, setCopiedAlias] = useState(false);

  // Change product switcher drawer inside checkout
  const [showPackSwitcher, setShowPackSwitcher] = useState(false);

  // Submission state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);

  if (!isOpen) return null;

  // Calculate totals
  const subtotal = selectedPack ? selectedPack.salePrice : 0;
  const transferDiscount = paymentMethod === 'transferencia' 
    ? Math.round(subtotal * (gateways.transferencia.extraDiscountPercent / 100))
    : 0;
  const finalTotal = subtotal - transferDiscount;

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(gateways.transferencia.alias);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const handleTransferFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTransferProof(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPack || isCartEmpty) {
      alert('Tu carrito está vacío. Por favor selecciona un pack para continuar.');
      return;
    }

    if (!name.trim() || !phone.trim() || !street.trim() || !city.trim()) {
      alert('Por favor completa todos los campos requeridos de envío.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder({
        customerName: name.trim(),
        email: email.trim() || `${phone.replace(/\D/g, '')}@cliente.h2derm.com`,
        phone: phone.trim(),
        dni: dni.trim() || 'No especificado',
        street: street.trim(),
        number: number.trim() || 'S/N',
        apartment: apartment.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim() || '1000',
        deliveryNotes: deliveryNotes.trim() || undefined,
        packId: selectedPack.id,
        packTitle: selectedPack.title,
        quantity: selectedPack.quantity,
        unitPrice: selectedPack.salePrice,
        totalPrice: finalTotal,
        discountApplied: selectedPack.savings + transferDiscount,
        paymentMethod,
        paymentStatus: paymentMethod === 'contraentrega' ? 'pending' : 'paid',
        shippingStatus: 'confirmed',
        carrier: 'Andreani Express & Correo Argentino',
        paymentProofUrl: transferProof || undefined,
        mercadoPagoDetails: paymentMethod === 'mercadopago' ? {
          paymentId: `MP-${Date.now()}`,
          cardLast4: cardNumber ? cardNumber.slice(-4) : '8821',
          cardBrand: 'Visa / Mastercard',
          installments
        } : undefined
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }

      setIsProcessing(false);
      setCompletedOrder(order);
      onOrderCompleted(order);
    }, 1200);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-full transition-colors cursor-pointer z-10"
          aria-label="Cerrar modal de compra"
        >
          <X className="w-6 h-6" />
        </button>

        {completedOrder ? (
          /* SUCCESS SCREEN */
          <div className="text-center py-6 sm:py-10 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                ¡Pedido Confirmado con Éxito!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                ¡Gracias por tu compra, {completedOrder.customerName.split(' ')[0]}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Tu kit H2derm ya fue asignado a nuestro laboratorio para embalaje prioritario con despacho en 24hs.
              </p>
            </div>

            {/* Tracking Code Box */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 max-w-md mx-auto text-center space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Tu Código de Seguimiento en Vivo:
              </span>
              <span className="font-mono text-2xl font-black text-purple-950 tracking-wider">
                {completedOrder.trackingCode}
              </span>
              <p className="text-[11px] text-purple-700">
                Guarda este código para rastrear el móvil de entrega en tiempo real.
              </p>
            </div>

            {/* Order details summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 max-w-md mx-auto text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Producto:</span>
                <span className="font-bold">{completedOrder.packTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Método de Pago:</span>
                <span className="font-bold uppercase text-purple-800">
                  {completedOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dirección de Entrega:</span>
                <span className="font-bold">{completedOrder.street} {completedOrder.number}, {completedOrder.city}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Abonado:</span>
                <span className="text-purple-900">${completedOrder.totalPrice.toLocaleString('es-AR')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <a
                href={`https://wa.me/5491149208842?text=Hola!%20Acabo%20de%20hacer%20el%20pedido%20${completedOrder.trackingCode}%20a%20nombre%20de%20${encodeURIComponent(completedOrder.customerName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Confirmar por WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Volver a la Tienda
              </button>
            </div>
          </div>
        ) : isCartEmpty || !selectedPack ? (
          /* EMPTY CART VIEW - Allows user to easily pick another pack, undo, or go back */
          <div className="py-6 sm:py-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border-2 border-rose-200 shadow-inner">
              <Trash2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-black uppercase text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                Carrito Vacío
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Has eliminado el pedido del carrito
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                ¿Te arrepentiste o deseas cambiar por otro producto? Elige a continuación la opción que prefieres llevar con despacho prioritario y envío 100% gratis:
              </p>
            </div>

            {/* Quick pack selector in empty cart */}
            <div className="grid grid-cols-1 gap-2.5 max-w-lg mx-auto text-left">
              {content.packs.map((pack) => (
                <div
                  key={pack.id}
                  onClick={() => onSelectPack(pack.id)}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-700 bg-white hover:bg-purple-50/40 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-xs hover:shadow-md"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 group-hover:text-purple-900">
                        {pack.title}
                      </span>
                      {pack.badge && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 block">{pack.subtitle}</span>
                    {pack.freeGift && pack.freeGift.trim() !== '' && (
                      <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1 mt-1">
                        <Gift className="w-3 h-3 text-amber-600" />
                        <span>{pack.freeGift}</span>
                      </span>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base sm:text-lg font-black text-purple-950 block">
                      {content.currencySymbol}{pack.salePrice.toLocaleString('es-AR')}
                    </span>
                    <button
                      type="button"
                      className="text-xs font-bold bg-purple-900 group-hover:bg-purple-950 text-white px-3 py-1.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <span>Elegir este</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {selectedPack && (
                <button
                  type="button"
                  onClick={() => onSelectPack(selectedPack.id)}
                  className="text-xs font-bold text-purple-800 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Deshacer y conservar {selectedPack.title}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline underline-offset-4 cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a la tienda para seguir mirando</span>
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE CHECKOUT FORM */
          <form onSubmit={handleSubmitOrder} className="space-y-6 text-left">
            
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-purple-700 text-xs font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>One-Page Checkout Seguro SSL 256-Bit</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Finalizar Compra · Envío Gratis
              </h3>
            </div>

            {/* Selected Pack Summary Card with DELETE and CHANGE PRODUCT buttons */}
            <div className="bg-purple-50/70 border-2 border-purple-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {selectedPack.quantity}x KIT
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {selectedPack.title}
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Envío 100% Bonificado
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base sm:text-lg font-black text-purple-950 block">
                    {content.currencySymbol}{subtotal.toLocaleString('es-AR')}
                  </span>
                  {selectedPack.savings > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 block">
                      Ahorras ${selectedPack.savings.toLocaleString('es-AR')}
                    </span>
                  )}
                </div>
              </div>

              {/* Botones para Eliminar del Carrito o Cambiar Producto */}
              <div className="pt-2.5 border-t border-purple-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowPackSwitcher(!showPackSwitcher)}
                  className="text-purple-800 hover:text-purple-950 font-bold flex items-center gap-1.5 hover:underline cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-purple-200 shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${showPackSwitcher ? 'rotate-180 text-purple-900' : ''} transition-transform`} />
                  <span>{showPackSwitcher ? 'Ocultar opciones' : '🔄 Cambiar por otro producto / pack'}</span>
                </button>

                <button
                  type="button"
                  onClick={onRemoveFromCart}
                  className="text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
                  title="Eliminar este producto del pedido si te arrepentiste"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar del carrito</span>
                </button>
              </div>

              {/* Desplegable rápido para cambiar de producto sin salir */}
              {showPackSwitcher && (
                <div className="pt-2 border-t border-purple-200 space-y-2 animate-in fade-in duration-150">
                  <span className="text-[11px] font-extrabold text-purple-950 block">
                    Elige el nuevo pack que prefieres:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {content.packs.map((p) => {
                      const isCurrent = p.id === selectedPack.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            onSelectPack(p.id);
                            setShowPackSwitcher(false);
                          }}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                            isCurrent
                              ? 'border-purple-800 bg-white ring-2 ring-purple-600/30 font-bold'
                              : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/20'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900">{p.title}</span>
                            {p.badge && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-purple-950">
                              {content.currencySymbol}{p.salePrice.toLocaleString('es-AR')}
                            </span>
                            {isCurrent ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                Actual
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-purple-700 hover:underline">
                                Cambiar a este ➔
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Step 1: Customer & Shipping Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">1</span>
                <span>Datos de Envío a Domicilio</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Lucía Martínez"
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp / Celular *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 11 5829-3012"
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email (para seguimiento) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tuemail@ejemplo.com"
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">DNI / CUIT (para la factura)</label>
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ej: 38492019"
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>

              {/* Street & address fields */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Calle / Avenida *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ej: Av. Santa Fe"
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="3420"
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Piso / Depto</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Ej: 4B"
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ciudad *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej: Palermo / Rosario"
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código Postal</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="1425"
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Aclaraciones para el repartidor (Opcional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Ej: Dejar en portería o tocar timbre 4B"
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
            </div>

            {/* Step 2: Payment Gateway Selection */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">2</span>
                <span>Selecciona Tu Método de Pago</span>
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                
                {/* 1. Mercado Pago */}
                {gateways.mercadoPago.enabled && (
                  <div
                    onClick={() => setPaymentMethod('mercadopago')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'mercadopago'
                        ? 'border-purple-800 bg-purple-50/50 ring-2 ring-purple-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'mercadopago'}
                          onChange={() => setPaymentMethod('mercadopago')}
                          className="text-purple-800"
                        />
                        <div>
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">
                            Mercado Pago (Tarjetas o Dinero en Cuenta)
                          </span>
                          <span className="text-[11px] text-purple-700 font-semibold">
                            Hasta 3 Cuotas Sin Interés · Protección al Comprador
                          </span>
                        </div>
                      </div>
                      <span className="bg-sky-100 text-sky-800 font-black text-[10px] px-2 py-0.5 rounded">
                        MERCADO PAGO
                      </span>
                    </div>

                    {/* Expanded MP Fields */}
                    {paymentMethod === 'mercadopago' && (
                      <div className="mt-3 pt-3 border-t border-purple-200/60 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Credencial vinculada: Oficial H2derm</span>
                          <span className="text-emerald-700 font-bold">● Pasarela Conectada</span>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Número de Tarjeta</label>
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4509 2384 1029 4820"
                            className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Vencimiento (MM/AA)</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="08/29"
                              className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Código CVV</label>
                            <input
                              type="text"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="382"
                              className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Plan de Cuotas</label>
                          <select
                            value={installments}
                            onChange={(e) => setInstallments(Number(e.target.value))}
                            className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
                          >
                            <option value={1}>1 pago de ${subtotal.toLocaleString('es-AR')}</option>
                            <option value={3}>3 cuotas SIN INTERÉS de ${Math.round(subtotal / 3).toLocaleString('es-AR')}</option>
                            <option value={6}>6 cuotas de ${Math.round((subtotal * 1.1) / 6).toLocaleString('es-AR')}</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Contraentrega */}
                {gateways.contraentrega.enabled && (
                  <div
                    onClick={() => setPaymentMethod('contraentrega')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'contraentrega'
                        ? 'border-purple-800 bg-purple-50/50 ring-2 ring-purple-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'contraentrega'}
                          onChange={() => setPaymentMethod('contraentrega')}
                          className="text-purple-800"
                        />
                        <div>
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">
                            Pago Contraentrega (Pagar al Recibir)
                          </span>
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            Pagas en efectivo en la puerta de tu casa al recibir
                          </span>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] px-2 py-0.5 rounded">
                        0% RIESGO
                      </span>
                    </div>

                    {paymentMethod === 'contraentrega' && (
                      <div className="mt-2 text-xs text-slate-600 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                        {gateways.contraentrega.description}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Transferencia Bancaria Directa */}
                {gateways.transferencia.enabled && (
                  <div
                    onClick={() => setPaymentMethod('transferencia')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'transferencia'
                        ? 'border-purple-800 bg-purple-50/50 ring-2 ring-purple-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'transferencia'}
                          onChange={() => setPaymentMethod('transferencia')}
                          className="text-purple-800"
                        />
                        <div>
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">
                            Transferencia Bancaria Inmediata
                          </span>
                          <span className="text-[11px] text-amber-700 font-bold">
                            💥 {gateways.transferencia.extraDiscountPercent}% de Descuento Extra Automático
                          </span>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-900 font-black text-[10px] px-2 py-0.5 rounded">
                        -10% EXTRA
                      </span>
                    </div>

                    {paymentMethod === 'transferencia' && (
                      <div className="mt-3 pt-3 border-t border-purple-200/60 space-y-2 text-xs bg-white p-3 rounded-xl border border-purple-100">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Alias Bancario / MP:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-purple-950 bg-purple-100 px-2 py-0.5 rounded">
                              {gateways.transferencia.alias}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyAlias}
                              className="text-purple-700 hover:text-purple-900 p-1"
                              title="Copiar alias"
                            >
                              {copiedAlias ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-500">CBU / CVU:</span>
                          <span className="font-mono text-[11px] text-slate-800">{gateways.transferencia.cvu}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-500">Titular:</span>
                          <span className="font-bold text-slate-800">{gateways.transferencia.accountHolder}</span>
                        </div>

                        {/* File Upload for receipt */}
                        <div className="pt-2">
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Adjuntar comprobante de pago (Opcional):
                          </label>
                          <label className="flex items-center justify-center gap-2 p-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 text-[11px] text-slate-600">
                            <Upload className="w-3.5 h-3.5 text-purple-700" />
                            <span>{transferProof ? 'Comprobante adjuntado' : 'Subir captura de comprobante'}</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleTransferFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Total breakdown */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-1.5 text-xs text-slate-700 border border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal ({selectedPack.title}):</span>
                <span>{content.currencySymbol}{subtotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Envío a Domicilio:</span>
                <span>¡GRATIS!</span>
              </div>
              {transferDiscount > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>Descuento 10% Transferencia:</span>
                  <span>-{content.currencySymbol}{transferDiscount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total a Pagar:</span>
                <span className="text-purple-900 text-lg">
                  {content.currencySymbol}{finalTotal.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 hover:from-purple-900 hover:via-purple-800 hover:to-indigo-900 text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando tu pedido de forma segura...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>CONFIRMAR Y FINALIZAR PEDIDO</span>
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>

            <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transacción 100% Encriptada · Garantía Oficial H2derm 30 Días</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
