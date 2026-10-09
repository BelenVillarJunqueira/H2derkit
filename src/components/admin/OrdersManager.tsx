import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  CheckCircle2, 
  Truck, 
  Clock, 
  Eye, 
  ExternalLink,
  Copy,
  Check,
  PhoneCall,
  Mail,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import { OrderItem, ShippingStatusType, PaymentStatusType } from '../../types/store';
import { getStoreOrders, updateOrderStatus } from '../../services/storage';

export const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>(getStoreOrders());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleStatusChange = (orderId: string, newShippingStatus: ShippingStatusType) => {
    const updated = updateOrderStatus(orderId, newShippingStatus);
    if (updated) {
      const refreshed = getStoreOrders();
      setOrders(refreshed);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || order.shippingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ShippingStatusType) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full">Confirmado</span>;
      case 'preparing':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">Empaquetando</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full">Despachado</span>;
      case 'in_transit':
        return <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded-full">En Reparto</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">Entregado</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full">Cancelado</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, tracking (H2D-...), teléfono o ciudad..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 outline-none"
          >
            <option value="all">Todos los Estados ({orders.length})</option>
            <option value="confirmed">Confirmados</option>
            <option value="preparing">En Preparación</option>
            <option value="shipped">Despachados</option>
            <option value="in_transit">En Reparto</option>
            <option value="delivered">Entregados</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Tracking</th>
                <th className="py-3 px-4">Cliente & Destino</th>
                <th className="py-3 px-4">Pack Solicitado</th>
                <th className="py-3 px-4">Total & Pago</th>
                <th className="py-3 px-4">Estado de Envío</th>
                <th className="py-3 px-4 text-right">Acción Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No se encontraron pedidos con esos criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Tracking Code */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-purple-950 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {order.trackingCode}
                        </span>
                        <button
                          onClick={() => handleCopyCode(order.trackingCode)}
                          className="text-slate-400 hover:text-purple-700 p-1"
                          title="Copiar código de seguimiento"
                        >
                          {copiedCode === order.trackingCode ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('es-AR')}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold">{order.customerName}</strong>
                      <span className="text-slate-500 text-[11px] block">{order.city}, {order.state}</span>
                      <span className="text-slate-400 text-[11px]">{order.phone}</span>
                    </td>

                    {/* Pack */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{order.packTitle}</span>
                      <span className="text-[11px] text-purple-700">Cant: {order.quantity}</span>
                    </td>

                    {/* Total & Payment */}
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 text-sm block font-black">
                        ${order.totalPrice.toLocaleString('es-AR')}
                      </strong>
                      <span className="text-[10px] font-bold uppercase text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {order.paymentMethod}
                      </span>
                    </td>

                    {/* Shipping Status Badge */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.shippingStatus)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Status dropdown quick update */}
                        <select
                          value={order.shippingStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as ShippingStatusType)}
                          className="text-[11px] bg-slate-100 border border-slate-200 rounded-lg p-1.5 font-bold text-slate-700 cursor-pointer"
                        >
                          <option value="confirmed">Confirmar</option>
                          <option value="preparing">Empaquetar</option>
                          <option value="shipped">Despachar</option>
                          <option value="in_transit">En Reparto</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelar</option>
                        </select>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-800 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Ver detalles completos"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-200 space-y-5">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-full"
              aria-label="Cerrar modal de detalles del pedido"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-700 uppercase">Detalle del Pedido</span>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>{selectedOrder.trackingCode}</span>
                {getStatusBadge(selectedOrder.shippingStatus)}
              </h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Cliente:</span>
                <strong className="text-slate-900">{selectedOrder.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Teléfono WhatsApp:</span>
                <a
                  href={`https://wa.me/${selectedOrder.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  {selectedOrder.phone}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span>{selectedOrder.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DNI / CUIT:</span>
                <span>{selectedOrder.dni}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dirección:</span>
                <span>{selectedOrder.street} {selectedOrder.number} {selectedOrder.apartment ? `(${selectedOrder.apartment})` : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ciudad & Código Postal:</span>
                <span>{selectedOrder.city}, {selectedOrder.state} (CP {selectedOrder.zipCode})</span>
              </div>
              {selectedOrder.deliveryNotes && (
                <div className="pt-1 border-t border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Notas de Entrega:</span>
                  <p className="italic text-slate-800 bg-white p-2 rounded border border-slate-200">
                    «{selectedOrder.deliveryNotes}»
                  </p>
                </div>
              )}
            </div>

            {/* Pack & Pricing */}
            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{selectedOrder.packTitle}</span>
                <span>${selectedOrder.totalPrice.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Método de Pago:</span>
                <span className="font-extrabold uppercase text-purple-900">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estado del Pago:</span>
                <span className="font-bold text-emerald-700 uppercase">{selectedOrder.paymentStatus}</span>
              </div>
            </div>

            {/* Change Status Fast Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Actualizar Estado de Envío:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['confirmed', 'preparing', 'shipped', 'in_transit', 'delivered', 'cancelled'] as ShippingStatusType[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedOrder.id, st)}
                    className={`py-2 px-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                      selectedOrder.shippingStatus === st
                        ? 'bg-purple-900 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {st === 'confirmed' && 'Confirmado'}
                    {st === 'preparing' && 'Empaquetando'}
                    {st === 'shipped' && 'Despachado'}
                    {st === 'in_transit' && 'En Reparto'}
                    {st === 'delivered' && 'Entregado'}
                    {st === 'cancelled' && 'Cancelar'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-800 text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
