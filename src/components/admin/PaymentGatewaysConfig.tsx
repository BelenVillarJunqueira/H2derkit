import React, { useState } from 'react';
import { 
  CreditCard, 
  Building2, 
  Truck, 
  Save, 
  Check, 
  Key, 
  ShieldCheck,
  Percent,
  HelpCircle
} from 'lucide-react';
import { PaymentGatewaysSettings } from '../../types/store';
import { getPaymentGateways, savePaymentGateways, DEFAULT_GATEWAYS } from '../../services/storage';

export const PaymentGatewaysConfig: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGatewaysSettings>(getPaymentGateways());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentGateways(gateways);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (confirm('¿Restablecer configuración predeterminada de pagos?')) {
      setGateways(DEFAULT_GATEWAYS);
      savePaymentGateways(DEFAULT_GATEWAYS);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 text-left">
      
      {/* Top Save Bar */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Configuración de Pasarelas de Pago & Bancos
          </h3>
          <p className="text-xs text-slate-500">
            Ingresa tus credenciales de Mercado Pago y datos de transferencia bancaria para recibir los cobros directamente.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-slate-600 hover:text-purple-700 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Valores Por Defecto
          </button>

          <button
            type="submit"
            className="bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                <span className="text-emerald-300">¡CREDENCIALES GUARDADAS!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>GUARDAR PASARELAS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. Mercado Pago Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Mercado Pago (Checkout & Tarjetas)
              </h4>
              <span className="text-xs text-slate-500">
                Cobro con tarjetas de crédito/débito, dinero en cuenta o redes de cobranza.
              </span>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-bold text-slate-700">Activo:</span>
            <input
              type="checkbox"
              checked={gateways.mercadoPago.enabled}
              onChange={(e) => setGateways({
                ...gateways,
                mercadoPago: { ...gateways.mercadoPago, enabled: e.target.checked }
              })}
              className="w-4 h-4 text-purple-700 rounded"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Public Key (Clave Pública de Desarrollador):
            </label>
            <input
              type="text"
              value={gateways.mercadoPago.publicKey}
              onChange={(e) => setGateways({
                ...gateways,
                mercadoPago: { ...gateways.mercadoPago, publicKey: e.target.value }
              })}
              placeholder="APP_USR-xxxxxx"
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Access Token (Token de Acceso Privado):
            </label>
            <input
              type="password"
              value={gateways.mercadoPago.accessToken}
              onChange={(e) => setGateways({
                ...gateways,
                mercadoPago: { ...gateways.mercadoPago, accessToken: e.target.value }
              })}
              placeholder="APP_USR-xxxxxx-xxxxxx"
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Modo de Operación:
            </label>
            <select
              value={gateways.mercadoPago.mode}
              onChange={(e) => setGateways({
                ...gateways,
                mercadoPago: { ...gateways.mercadoPago, mode: e.target.value as 'production' | 'sandbox' }
              })}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold"
            >
              <option value="production">🟢 Producción (Cobro Real a Clientes)</option>
              <option value="sandbox">🟡 Sandbox (Modo de Prueba / Testing)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Máximo de Cuotas Ofrecidas:
            </label>
            <select
              value={gateways.mercadoPago.maxInstallments}
              onChange={(e) => setGateways({
                ...gateways,
                mercadoPago: { ...gateways.mercadoPago, maxInstallments: Number(e.target.value) }
              })}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
            >
              <option value={3}>3 Cuotas</option>
              <option value={6}>6 Cuotas</option>
              <option value={12}>12 Cuotas</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Bank Transfer Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Datos Bancarios & Descuento por Transferencia (CBU / CVU / Alias)
              </h4>
              <span className="text-xs text-slate-500">
                Los clientes pueden transferir directamente a tu cuenta bancaria o billetera virtual.
              </span>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-bold text-slate-700">Activo:</span>
            <input
              type="checkbox"
              checked={gateways.transferencia.enabled}
              onChange={(e) => setGateways({
                ...gateways,
                transferencia: { ...gateways.transferencia, enabled: e.target.checked }
              })}
              className="w-4 h-4 text-purple-700 rounded"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nombre del Banco / Entidad:</label>
            <input
              type="text"
              value={gateways.transferencia.bankName}
              onChange={(e) => setGateways({
                ...gateways,
                transferencia: { ...gateways.transferencia, bankName: e.target.value }
              })}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Titular de la Cuenta:</label>
            <input
              type="text"
              value={gateways.transferencia.accountHolder}
              onChange={(e) => setGateways({
                ...gateways,
                transferencia: { ...gateways.transferencia, accountHolder: e.target.value }
              })}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Alias Bancario / Mercado Pago:</label>
            <input
              type="text"
              value={gateways.transferencia.alias}
              onChange={(e) => setGateways({
                ...gateways,
                transferencia: { ...gateways.transferencia, alias: e.target.value.toUpperCase() }
              })}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-mono font-bold uppercase"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">CBU / CVU (22 dígitos):</label>
            <input
              type="text"
              value={gateways.transferencia.cvu}
              onChange={(e) => setGateways({
                ...gateways,
                transferencia: { ...gateways.transferencia, cvu: e.target.value }
              })}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">CUIT / CUIL:</label>
            <input
              type="text"
              value={gateways.transferencia.cuit}
              onChange={(e) => setGateways({
                ...gateways,
                transferencia: { ...gateways.transferencia, cuit: e.target.value }
              })}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">% Descuento Extra por Transferencia:</label>
            <input
              type="number"
              value={gateways.transferencia.extraDiscountPercent}
              onChange={(e) => setGateways({
                ...gateways,
                transferencia: { ...gateways.transferencia, extraDiscountPercent: Number(e.target.value) }
              })}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="font-bold text-slate-700 block mb-1">Instrucciones para el Cliente:</label>
            <textarea
              rows={2}
              value={gateways.transferencia.instructions}
              onChange={(e) => setGateways({
                ...gateways,
                transferencia: { ...gateways.transferencia, instructions: e.target.value }
              })}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* 3. Contraentrega Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Pago Contraentrega (Pagar en Efectivo al Recibir)
              </h4>
              <span className="text-xs text-slate-500">
                Muy eficaz para venta por impulso: el cliente no duda porque abona en mano cuando recibe.
              </span>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-bold text-slate-700">Activo:</span>
            <input
              type="checkbox"
              checked={gateways.contraentrega.enabled}
              onChange={(e) => setGateways({
                ...gateways,
                contraentrega: { ...gateways.contraentrega, enabled: e.target.checked }
              })}
              className="w-4 h-4 text-purple-700 rounded"
            />
          </label>
        </div>

        <div className="text-xs">
          <label className="font-bold text-slate-700 block mb-1">Mensaje Explicativo en Checkout:</label>
          <input
            type="text"
            value={gateways.contraentrega.description}
            onChange={(e) => setGateways({
              ...gateways,
              contraentrega: { ...gateways.contraentrega, description: e.target.value }
            })}
            className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
          />
        </div>
      </div>

    </form>
  );
};
