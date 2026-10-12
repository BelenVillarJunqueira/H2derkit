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
  HelpCircle,
  ExternalLink,
  Sparkles,
  Link2
} from 'lucide-react';
import { PaymentGatewaysSettings } from '../../types/store';
import { getPaymentGateways, savePaymentGateways, DEFAULT_GATEWAYS, getStoreContent } from '../../services/storage';

export const PaymentGatewaysConfig: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGatewaysSettings>(getPaymentGateways());
  const [storeContent] = useState(() => getStoreContent());
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

        {/* Informative banner on Dinero en Cuenta & Mercado Pago */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 p-4 rounded-2xl text-xs text-sky-950 space-y-2">
          <div className="flex items-center gap-2 font-black text-sm text-sky-900">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Cobro con Dinero en Cuenta, Débito y Cuotas con Mercado Pago</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Puedes configurar Mercado Pago de <b>dos maneras</b>:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-3 rounded-xl border border-sky-200">
              <strong className="text-sky-900 block font-bold mb-1">Opción A: Links de Pago (Recomendada y más fácil)</strong>
              <p className="text-[11px] text-slate-600">
                En tu app de Mercado Pago creas un <b>Link de Pago</b> (Cobrar con link ➔ pones el precio ➔ copiar link). Tus clientes se redirigen automáticamente y pueden pagar directamente en la app con su <b>saldo en cuenta (dinero en cuenta)</b>, débito o tarjetas.
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-sky-200">
              <strong className="text-sky-900 block font-bold mb-1">Opción B: Checkout Pro API (Access Token)</strong>
              <p className="text-[11px] text-slate-600">
                Pega tu <b>Access Token</b> de desarrollador (<code className="bg-slate-100 px-1 rounded font-mono">APP_USR-...</code>). El sistema genera la pasarela oficial automáticamente y permite al cliente identificarse con su cuenta de Mercado Pago.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Pack Specific Links */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-purple-700" />
            <h5 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
              Links de Pago Directos de Mercado Pago por Pack (mpago.la)
            </h5>
          </div>
          <p className="text-[11px] text-slate-500">
            Copia el link de cobro desde la app de Mercado Pago para cada monto y pégalo aquí. Al hacer clic en comprar, el cliente irá directo a abonar dicho pack:
          </p>

          <div className="grid grid-cols-1 gap-3 pt-1">
            {storeContent.packs.map((pack) => (
              <div key={pack.id} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="min-w-[180px]">
                  <strong className="text-slate-900 block font-bold">{pack.title}</strong>
                  <span className="text-[11px] text-purple-800 font-extrabold">
                    Precio: ${pack.salePrice.toLocaleString('es-AR')}
                  </span>
                </div>

                <div className="flex-1 w-full">
                  <input
                    type="url"
                    value={gateways.mercadoPago.packLinks?.[pack.id] || ''}
                    onChange={(e) => {
                      const newPackLinks = { ...(gateways.mercadoPago.packLinks || {}), [pack.id]: e.target.value };
                      setGateways({
                        ...gateways,
                        mercadoPago: {
                          ...gateways.mercadoPago,
                          packLinks: newPackLinks
                        }
                      });
                    }}
                    placeholder={`https://mpago.la/xxxx (Link para ${pack.title})`}
                    className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>
            ))}

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="min-w-[180px]">
                <strong className="text-slate-900 block font-bold">Link General (Comodín)</strong>
                <span className="text-[11px] text-slate-500">
                  Aplica si no configuras los específicos
                </span>
              </div>

              <div className="flex-1 w-full">
                <input
                  type="url"
                  value={gateways.mercadoPago.directPaymentLink || ''}
                  onChange={(e) => setGateways({
                    ...gateways,
                    mercadoPago: { ...gateways.mercadoPago, directPaymentLink: e.target.value }
                  })}
                  placeholder="https://mpago.la/xxxx (Link general opcional)"
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. API Credentials (Checkout Pro) */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-700" />
            <h5 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
              Credenciales de API Checkout Pro (Opcional si usas links)
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Access Token (Token Privado APP_USR-...):
              </label>
              <input
                type="password"
                value={gateways.mercadoPago.accessToken}
                onChange={(e) => setGateways({
                  ...gateways,
                  mercadoPago: { ...gateways.mercadoPago, accessToken: e.target.value }
                })}
                placeholder="APP_USR-xxxxxx-xxxxxx"
                className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Obtenlo desde <a href="https://www.mercadopago.com.ar/developers/panel/credentials" target="_blank" rel="noopener noreferrer" className="text-purple-700 underline font-semibold">Mercado Pago Developers</a>.
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Public Key (Clave Pública):
              </label>
              <input
                type="text"
                value={gateways.mercadoPago.publicKey}
                onChange={(e) => setGateways({
                  ...gateways,
                  mercadoPago: { ...gateways.mercadoPago, publicKey: e.target.value }
                })}
                placeholder="APP_USR-xxxxxx"
                className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-mono"
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
                className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-bold"
              >
                <option value="production">🟢 Producción (Cobro Real a Clientes)</option>
                <option value="sandbox">🟡 Sandbox (Modo de Prueba / Testing)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Máximo de Cuotas Permitidas:
              </label>
              <select
                value={gateways.mercadoPago.maxInstallments || 6}
                onChange={(e) => setGateways({
                  ...gateways,
                  mercadoPago: { ...gateways.mercadoPago, maxInstallments: Number(e.target.value) }
                })}
                className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-bold"
              >
                <option value={3}>Hasta 3 cuotas</option>
                <option value={6}>Hasta 6 cuotas</option>
                <option value={12}>Hasta 12 cuotas</option>
              </select>
            </div>
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
