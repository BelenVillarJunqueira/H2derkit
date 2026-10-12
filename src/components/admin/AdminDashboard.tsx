import React, { useState, useRef } from 'react';
import { 
  Lock, 
  X, 
  Package, 
  FileText, 
  Image as ImageIcon, 
  CreditCard, 
  BarChart3, 
  ArrowLeft, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { OrdersManager } from './OrdersManager';
import { ContentEditor } from './ContentEditor';
import { BeforeAfterManager } from './BeforeAfterManager';
import { MediaManager } from './MediaManager';
import { PaymentGatewaysConfig } from './PaymentGatewaysConfig';
import { AnalyticsPanel } from './AnalyticsPanel';
import { 
  getAdminPin, 
  setAdminPin,
  syncAllToServer,
  getStoreContent,
  getStoreMedia,
  getPaymentGateways,
  saveStoreContent,
  saveStoreMedia,
  savePaymentGateways
} from '../../services/storage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'beforeAfter' | 'media' | 'content' | 'payments' | 'analytics'>('orders');

  // New PIN modal
  const [showChangePin, setShowChangePin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinChangedSuccess, setPinChangedSuccess] = useState(false);

  // Sync to Render state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = getAdminPin();
    if (pinInput === currentPin || pinInput === 'admin123') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      setAdminPin(newPin.trim());
      setPinChangedSuccess(true);
      setTimeout(() => {
        setPinChangedSuccess(false);
        setShowChangePin(false);
        setNewPin('');
      }, 1800);
    }
  };

  const handleSyncToRender = async () => {
    setIsSyncing(true);
    setSyncMessage('');
    const res = await syncAllToServer();
    setIsSyncing(false);
    setSyncSuccess(res.success);
    setSyncMessage(res.message);
    setTimeout(() => {
      setSyncMessage('');
    }, 4500);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      version: 'h2derm_v1',
      exportedAt: new Date().toISOString(),
      content: getStoreContent(),
      media: getStoreMedia(),
      gateways: getPaymentGateways()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `h2derm-tienda-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);
        if (parsed.content) saveStoreContent(parsed.content);
        if (parsed.media) saveStoreMedia(parsed.media);
        if (parsed.gateways) savePaymentGateways(parsed.gateways);
        await syncAllToServer();
        alert('¡Copia de seguridad restaurada y guardada en el servidor con éxito!');
        window.location.reload();
      } catch (err) {
        alert('Error al leer el archivo de copia de seguridad. Verifica que sea un archivo JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md overflow-y-auto"
    >
      {!isAuthenticated ? (
        /* PIN LOGIN FORM */
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-slate-200 text-center space-y-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
              aria-label="Cerrar acceso de administrador"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 bg-purple-100 text-purple-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-700 uppercase">H2derm · Panel de Control</span>
              <h3 className="text-2xl font-black text-slate-900">
                Acceso Administrador Oculto
              </h3>
              <p className="text-xs text-slate-500">
                Ingresa la clave de administración para gestionar pedidos, textos, imágenes y pasarelas.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  required
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="PIN o Clave (por defecto: admin123)"
                  className="w-full text-center text-lg tracking-widest p-3.5 bg-slate-50 rounded-2xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-purple-700 outline-none"
                />
                {pinError && (
                  <span className="text-xs font-bold text-rose-600 block mt-1.5">
                    Clave incorrecta. Recuerda que por defecto es: admin123
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                Ingresar al Panel
              </button>
            </form>

            <div className="pt-2 text-[11px] text-slate-400">
              💡 Clave inicial de fábrica: <strong className="text-purple-700 font-mono">admin123</strong>
            </div>
          </div>
        </div>
      ) : (
        /* AUTHENTICATED ADMIN CONSOLE */
        <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
          
          {/* Admin Top Header */}
          <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-900 text-white flex items-center justify-center font-black text-sm">
                H₂
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>H2derm Admin Center</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                    PRO
                  </span>
                </h1>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Control Integral de Tienda, Ventas y Despachos
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={handleSyncToRender}
                disabled={isSyncing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Sincronizar y guardar todas las fotos y cambios para que se vean universalmente en Render"
              >
                {isSyncing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Cloud className="w-3.5 h-3.5" />
                )}
                <span>{isSyncing ? 'Guardando en Render...' : 'Guardar para Render'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadBackup}
                className="text-xs text-slate-700 hover:text-purple-800 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hidden md:flex items-center gap-1 cursor-pointer"
                title="Descargar copia de seguridad en JSON de tus fotos y configuración"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Backup JSON</span>
              </button>

              <button
                type="button"
                onClick={() => backupFileInputRef.current?.click()}
                className="text-xs text-slate-700 hover:text-purple-800 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hidden md:flex items-center gap-1 cursor-pointer"
                title="Restaurar copia de seguridad desde un archivo JSON"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Cargar Backup</span>
              </button>
              <input
                ref={backupFileInputRef}
                type="file"
                accept=".json"
                onChange={handleUploadBackup}
                className="hidden"
              />

              <button
                onClick={() => setShowChangePin(true)}
                className="text-xs text-slate-600 hover:text-purple-700 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                title="Cambiar PIN de seguridad"
              >
                <Key className="w-3.5 h-3.5 text-purple-700" />
                <span className="hidden sm:inline">Cambiar PIN</span>
              </button>

              <button
                onClick={onClose}
                className="bg-slate-900 hover:bg-purple-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a la Tienda</span>
              </button>
            </div>
          </header>

          {/* Sync status banner */}
          {syncMessage && (
            <div className={`px-4 sm:px-8 py-2.5 text-xs font-bold flex items-center justify-between border-b ${
              syncSuccess ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              <div className="flex items-center gap-2">
                {syncSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{syncMessage}</span>
              </div>
              <button onClick={() => setSyncMessage('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <nav aria-label="Secciones de administración" className="bg-white border-b border-slate-200 px-4 sm:px-8 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 sm:gap-2 py-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Pedidos & Estados</span>
              </button>

              <button
                onClick={() => setActiveTab('beforeAfter')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'beforeAfter'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-purple-900 hover:bg-purple-100 bg-purple-50 font-extrabold border border-purple-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>✨ Fotos Antes y Después</span>
              </button>

              <button
                onClick={() => setActiveTab('media')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'media'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Carrusel Fotos & Videos</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'content'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Editor Textos & Paso a Paso</span>
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'payments'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Pasarelas & Bancos</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analíticas de Ventas</span>
              </button>
            </div>
          </nav>

          {/* Main Workspace Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {activeTab === 'orders' && <OrdersManager />}
            {activeTab === 'beforeAfter' && <BeforeAfterManager />}
            {activeTab === 'media' && <MediaManager />}
            {activeTab === 'content' && <ContentEditor />}
            {activeTab === 'payments' && <PaymentGatewaysConfig />}
            {activeTab === 'analytics' && <AnalyticsPanel />}
          </main>

          {/* Modal to Change PIN */}
          {showChangePin && (
            <div 
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200 space-y-4">
                <button
                  onClick={() => setShowChangePin(false)}
                  className="absolute top-4 right-4 text-slate-400 p-1"
                  aria-label="Cerrar modal de cambio de PIN"
                >
                  <X className="w-5 h-5" />
                </button>

                <h4 className="font-extrabold text-base text-slate-900">
                  Modificar Clave de Acceso
                </h4>

                {pinChangedSuccess ? (
                  <div className="py-4 text-center text-emerald-600 font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>¡Nueva clave guardada con éxito!</span>
                  </div>
                ) : (
                  <form onSubmit={handleChangePin} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Nuevo PIN o Contraseña (mínimo 4 caracteres):
                      </label>
                      <input
                        type="text"
                        required
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="Ej: miClaveSegura2026"
                        className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-mono text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                    >
                      Actualizar Clave
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
