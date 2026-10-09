import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  PieChart, 
  Activity,
  CreditCard,
  Truck,
  Sparkles
} from 'lucide-react';
import { getAnalytics } from '../../services/storage';

export const AnalyticsPanel: React.FC = () => {
  const analytics = getAnalytics();
  const conversionRate = ((analytics.completedOrders / analytics.totalVisits) * 100).toFixed(2);
  const averageTicket = Math.round(analytics.totalRevenue / (analytics.completedOrders || 1));

  return (
    <div className="space-y-8 text-left">
      
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Ingresos Totales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ${analytics.totalRevenue.toLocaleString('es-AR')}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs mes anterior</span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pedidos Totales</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {analytics.completedOrders.toLocaleString('es-AR')}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-purple-700">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.1% en conversión directa</span>
          </div>
        </div>

        {/* KPI 3: Average Ticket */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Ticket Promedio</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ${averageTicket.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-slate-500">
            Impulsado por el Pack x2 Más Vendido
          </div>
        </div>

        {/* KPI 4: Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Tasa de Conversión</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">
            🔥 Supera el promedio de Shopify (2.5%)
          </div>
        </div>

      </div>

      {/* Conversion Funnel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-700" /> Embudo de Conversión de la Tienda
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-bold">1. Visitas a la Tienda</span>
            <div className="text-xl font-black text-slate-900">{analytics.totalVisits.toLocaleString('es-AR')}</div>
            <span className="text-[10px] text-slate-400">100% de audiencia</span>
          </div>

          <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 space-y-1">
            <span className="text-xs text-purple-800 font-bold">2. Clics en Comprar</span>
            <div className="text-xl font-black text-purple-950">{analytics.addToCartCount.toLocaleString('es-AR')}</div>
            <span className="text-[10px] text-purple-700 font-semibold">20.6% de las visitas</span>
          </div>

          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200 space-y-1">
            <span className="text-xs text-indigo-800 font-bold">3. Checkout Iniciado</span>
            <div className="text-xl font-black text-indigo-950">{analytics.initiatedCheckouts.toLocaleString('es-AR')}</div>
            <span className="text-[10px] text-indigo-700 font-semibold">11.7% de las visitas</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1">
            <span className="text-xs text-emerald-800 font-bold">4. Compras Concretadas</span>
            <div className="text-xl font-black text-emerald-950">{analytics.completedOrders.toLocaleString('es-AR')}</div>
            <span className="text-[10px] text-emerald-700 font-bold">{conversionRate}% Tasa Real</span>
          </div>

        </div>
      </div>

      {/* Breakdown: Packs and Payment Gateways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sales by Pack */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
            Ventas por Pack de Producto
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Pack x2 Kits (Más Vendido)</span>
                <span className="text-purple-900">62% (584 pedidos)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-700 h-full rounded-full w-[62%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Pack x3 Kits (Mejor Ahorro )</span>
                <span className="text-purple-900">24% (226 pedidos)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full w-[24%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Pack x1 Kit (Individual)</span>
                <span className="text-purple-900">14% (132 pedidos)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full w-[14%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Sales by Payment Method */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
            Métodos de Pago Preferidos
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                  Mercado Pago (Tarjetas / Cuotas)
                </span>
                <span className="text-slate-900">64%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full w-[64%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Pago Contraentrega (Efectivo al recibir)
                </span>
                <span className="text-slate-900">22%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[22%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                  Transferencia Inmediata (-10% OFF)
                </span>
                <span className="text-slate-900">14%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[14%]" />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
