import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Check, 
  Upload, 
  Sparkles, 
  Package, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Droplet, 
  Camera, 
  Plus, 
  Trash2,
  Microscope,
  HelpCircle,
  PhoneCall,
  RotateCcw,
  Eye,
  Image as ImageIcon,
  CheckCircle2,
  Gift,
  Tag,
  AlertCircle
} from 'lucide-react';
import { StoreContent, RoutineStep, ProblemSolutionItem, ActiveIngredientItem, ClinicalStat } from '../../types/store';
import { getStoreContent, saveStoreContent, getContentFromIndexedDB, DEFAULT_CONTENT } from '../../services/storage';

// Image compressor helper for CMS uploads
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1200;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export interface ContentEditorProps {
  initialSection?: 'routine' | 'beforeAfter' | 'packs' | 'urgency' | 'ingredients' | 'problems' | 'guarantee';
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ initialSection = 'routine' }) => {
  const [content, setContent] = useState<StoreContent>(getStoreContent());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<'routine' | 'beforeAfter' | 'packs' | 'urgency' | 'ingredients' | 'problems' | 'guarantee'>(initialSection);
  const [previewSliderPos, setPreviewSliderPos] = useState<number>(50);

  useEffect(() => {
    getContentFromIndexedDB().then((indexedContent) => {
      if (indexedContent) {
        const localContent = getStoreContent();
        const indexedTime = (indexedContent as any).updatedAt || 0;
        const localTime = (localContent as any).updatedAt || 0;
        if (indexedTime >= localTime) {
          setContent(indexedContent);
        }
      }
    });

    const handleContentUpdate = (e: CustomEvent<StoreContent>) => {
      setContent(e.detail);
    };

    window.addEventListener('h2derm_content_updated', handleContentUpdate as EventListener);
    return () => {
      window.removeEventListener('h2derm_content_updated', handleContentUpdate as EventListener);
    };
  }, []);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveStoreContent(content);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    if (confirm('¿Deseas restablecer todos los textos y datos de la tienda a la configuración original de fábrica?')) {
      setContent(DEFAULT_CONTENT);
      saveStoreContent(DEFAULT_CONTENT);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  // Image upload handler for Routine Steps
  const handleRoutineImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedUrl = await compressImage(file);
      const updatedSteps = [...content.routineSteps];
      updatedSteps[index] = { ...updatedSteps[index], image: compressedUrl };
      const updatedContent = { ...content, routineSteps: updatedSteps };
      setContent(updatedContent);
      saveStoreContent(updatedContent);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch {
      alert('Error al procesar la imagen.');
    }
  };

  // Image upload handler for Before / After
  const handleBeforeAfterImageUpload = async (type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedUrl = await compressImage(file);
      const updatedContent = type === 'before' 
        ? { ...content, beforeImage: compressedUrl }
        : { ...content, afterImage: compressedUrl };
      setContent(updatedContent);
      saveStoreContent(updatedContent);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch {
      alert('Error al procesar la imagen.');
    }
  };

  // Image upload handler for Doctor
  const handleDoctorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedUrl = await compressImage(file);
      const updatedContent = { ...content, dermatologistPhoto: compressedUrl };
      setContent(updatedContent);
      saveStoreContent(updatedContent);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch {
      alert('Error al procesar la imagen.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Floating Save Header */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Editor Completo del Sitio (CMS Visual)
          </h3>
          <p className="text-xs text-slate-500">
            Modifica textos, precios, tiempos e imágenes de cualquier sección sin tocar código.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-semibold text-slate-600 hover:text-rose-600 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Restablecer Valores
          </button>

          <button
            onClick={() => handleSave()}
            className="bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                <span className="text-emerald-300">¡CAMBIOS GUARDADOS!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>GUARDAR CAMBIOS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSection('routine')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'routine' ? 'bg-purple-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🧴 Paso a Paso (Fotos & Textos)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('beforeAfter')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'beforeAfter' ? 'bg-purple-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>✨ Antes y Después (Fotos & % Clínicos)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('packs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'packs' ? 'bg-purple-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🏷️ Precios, Packs y Ofertas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('urgency')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'urgency' ? 'bg-purple-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>⚡ Tiempos, Urgencia y Envíos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('ingredients')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'ingredients' ? 'bg-purple-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🔬 Ingredientes & Dra. Aval</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('problems')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'problems' ? 'bg-purple-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🎯 Problemas vs Solución</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('guarantee')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'guarantee' ? 'bg-purple-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🛡️ Garantía & Contactos</span>
        </button>
      </div>

      {/* 1. SECCIÓN: PASO A PASO (TEXTOS E IMÁGENES DE CADA PRODUCTO) */}
      {activeSection === 'routine' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-base text-purple-900 uppercase tracking-wider flex items-center gap-2">
              <span>🧴 Modificar los 4 Pasos de la Rutina (Imágenes y Textos)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Aquí puedes cambiar las fotos de cada frasco/crema/sérum, títulos, frecuencia y beneficios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Título General de la Sección:</label>
              <input
                type="text"
                value={content.routineTitle}
                onChange={(e) => setContent({ ...content, routineTitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtítulo Explicativo:</label>
              <input
                type="text"
                value={content.routineSubtitle}
                onChange={(e) => setContent({ ...content, routineSubtitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Individual steps list */}
          <div className="space-y-6 pt-2">
            {content.routineSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl border-2 border-purple-100 bg-purple-50/20 space-y-4 text-xs"
              >
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <span className="font-black text-sm text-purple-950 flex items-center gap-2">
                    <span className="bg-purple-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      {step.number}
                    </span>
                    <span>Paso {step.number}: {step.title}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Photo picker & preview */}
                  <div className="lg:col-span-4 space-y-2">
                    <label className="font-bold text-slate-700 block">
                      Foto del Producto (Paso {step.number}):
                    </label>

                    <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <label className="flex items-center justify-center gap-2 p-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl cursor-pointer shadow-sm transition-all text-xs">
                      <Upload className="w-4 h-4" />
                      <span>Subir Foto desde mi PC</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleRoutineImageUpload(idx, e)}
                        className="hidden"
                      />
                    </label>

                    <div className="pt-1">
                      <span className="text-[10px] text-slate-400 block mb-0.5">O pega URL directa:</span>
                      <input
                        type="url"
                        value={step.image}
                        onChange={(e) => {
                          const updated = [...content.routineSteps];
                          updated[idx].image = e.target.value;
                          setContent({ ...content, routineSteps: updated });
                        }}
                        className="w-full p-2 bg-white rounded-lg border border-slate-300 text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Text details for this step */}
                  <div className="lg:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Título del Producto:</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const updated = [...content.routineSteps];
                            updated[idx].title = e.target.value;
                            setContent({ ...content, routineSteps: updated });
                          }}
                          className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Frecuencia / Momento:</label>
                        <input
                          type="text"
                          value={step.time}
                          onChange={(e) => {
                            const updated = [...content.routineSteps];
                            updated[idx].time = e.target.value;
                            setContent({ ...content, routineSteps: updated });
                          }}
                          placeholder="Ej: Día y Noche · Gotero"
                          className="w-full p-2.5 bg-white rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Subtítulo / Acción:</label>
                      <input
                        type="text"
                        value={step.subtitle}
                        onChange={(e) => {
                          const updated = [...content.routineSteps];
                          updated[idx].subtitle = e.target.value;
                          setContent({ ...content, routineSteps: updated });
                        }}
                        className="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-purple-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Descripción del Tratamiento:</label>
                      <textarea
                        rows={2}
                        value={step.description}
                        onChange={(e) => {
                          const updated = [...content.routineSteps];
                          updated[idx].description = e.target.value;
                          setContent({ ...content, routineSteps: updated });
                        }}
                        className="w-full p-2.5 bg-white rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SECCIÓN: ANTES Y DESPUÉS (FOTOS Y ESTADÍSTICAS) */}
      {activeSection === 'beforeAfter' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-base text-purple-900 uppercase tracking-wider flex items-center gap-2">
                <span>📸 Fotos del Antes y Después (Resultados Clínicos)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Sube las fotos reales de Antes y Después desde tu computadora o escribe una URL. Puedes previsualizarlas con el deslizador interactivo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Restablecer fotos del Antes y Después a las originales de fábrica?')) {
                  const updated = {
                    ...content,
                    beforeImage: DEFAULT_CONTENT.beforeImage,
                    afterImage: DEFAULT_CONTENT.afterImage,
                  };
                  setContent(updated);
                  saveStoreContent(updated);
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2000);
                }
              }}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Fotos Originales
            </button>
          </div>

          {/* Interactive Live Comparison Slider Preview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-700" />
                Vista Previa Interactiva en Vivo (Así lo ven tus clientes)
              </span>
              <span className="text-slate-400 font-normal">Mueve el cursor o desliza para comparar</span>
            </div>

            <div
              className="relative w-full aspect-16/9 sm:aspect-21/9 max-h-72 rounded-xl overflow-hidden shadow-inner border border-slate-300 select-none cursor-ew-resize bg-slate-900"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = Math.min(Math.max((x / rect.width) * 100, 5), 95);
                setPreviewSliderPos(percent);
              }}
              onTouchMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const percent = Math.min(Math.max((x / rect.width) * 100, 5), 95);
                setPreviewSliderPos(percent);
              }}
            >
              {/* After image (background) */}
              <img
                src={content.afterImage || DEFAULT_CONTENT.afterImage}
                alt="Después"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <span className="absolute top-3 right-3 bg-purple-900/90 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm">
                DESPUÉS (Día 28)
              </span>

              {/* Before image (clipped overlay) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${previewSliderPos}%` }}
              >
                <img
                  src={content.beforeImage || DEFAULT_CONTENT.beforeImage}
                  alt="Antes"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none"
                  style={{ width: '100%' }}
                />
                <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm">
                  ANTES (Día 0)
                </span>
              </div>

              {/* Divider handle line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize z-10"
                style={{ left: `${previewSliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-purple-700">
                  <div className="flex gap-0.5">
                    <span className="w-0.5 h-2 bg-purple-700 rounded-full" />
                    <span className="w-0.5 h-2 bg-purple-700 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2 Cards: Upload Before & Upload After */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Card FOTO DEL ANTES */}
            <div className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  Foto 1: Piel ANTES del Tratamiento
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Día 0</span>
              </div>

              <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-200 border border-slate-300">
                <img
                  src={content.beforeImage || DEFAULT_CONTENT.beforeImage}
                  alt="Vista previa Antes"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <label className="block w-full text-center py-2.5 px-4 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl shadow-xs cursor-pointer transition">
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Subir Foto de ANTES desde tu PC
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBeforeAfterImageUpload('before', e)}
                    className="hidden"
                  />
                </label>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">O escribe URL directa de la foto:</label>
                  <input
                    type="text"
                    value={content.beforeImage}
                    onChange={(e) => setContent({ ...content, beforeImage: e.target.value })}
                    placeholder="https://ejemplo.com/foto-antes.jpg"
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Card FOTO DEL DESPUÉS */}
            <div className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-purple-950 text-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-700" />
                  Foto 2: Piel DESPUÉS del Tratamiento
                </span>
                <span className="text-[11px] font-bold text-purple-900 bg-purple-200 px-2 py-0.5 rounded">Día 28</span>
              </div>

              <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-purple-100 border border-purple-300">
                <img
                  src={content.afterImage || DEFAULT_CONTENT.afterImage}
                  alt="Vista previa Después"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <label className="block w-full text-center py-2.5 px-4 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl shadow-xs cursor-pointer transition">
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Subir Foto de DESPUÉS desde tu PC
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBeforeAfterImageUpload('after', e)}
                    className="hidden"
                  />
                </label>

                <div>
                  <label className="font-bold text-purple-900 block mb-1">O escribe URL directa de la foto:</label>
                  <input
                    type="text"
                    value={content.afterImage}
                    onChange={(e) => setContent({ ...content, afterImage: e.target.value })}
                    placeholder="https://ejemplo.com/foto-despues.jpg"
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Titles & Texts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Título de la Sección Antes/Después:</label>
              <input
                type="text"
                value={content.beforeAfterTitle}
                onChange={(e) => setContent({ ...content, beforeAfterTitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtítulo Descriptivo:</label>
              <input
                type="text"
                value={content.beforeAfterSubtitle}
                onChange={(e) => setContent({ ...content, beforeAfterSubtitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Clinical Statistics Editor */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Microscope className="w-4 h-4 text-purple-700" />
                  Métricas y Estadísticas del Estudio Clínico
                </h5>
                <p className="text-xs text-slate-500">Muestra datos como % de mejoría en arrugas, hidratación y luminosidad.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newStat: ClinicalStat = {
                    percentage: '95%',
                    badge: 'Estudio Clínico',
                    title: 'Nuevo Beneficio Clínico',
                    description: 'Comprobado en estudio dermatológico de 28 días de uso diario.'
                  };
                  setContent({ ...content, clinicalStats: [...(content.clinicalStats || []), newStat] });
                }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar Métrica
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(content.clinicalStats || []).map((stat, sIdx) => (
                <div key={sIdx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-900 text-sm">Métrica #{sIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = content.clinicalStats.filter((_, i) => i !== sIdx);
                        setContent({ ...content, clinicalStats: updated });
                      }}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                      title="Eliminar métrica"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-0.5">Porcentaje (ej: 98%):</label>
                    <input
                      type="text"
                      value={stat.percentage}
                      onChange={(e) => {
                        const updated = [...content.clinicalStats];
                        updated[sIdx].percentage = e.target.value;
                        setContent({ ...content, clinicalStats: updated });
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-extrabold text-purple-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-0.5">Etiqueta / Badge (ej: En 28 días):</label>
                    <input
                      type="text"
                      value={stat.badge || ''}
                      onChange={(e) => {
                        const updated = [...content.clinicalStats];
                        updated[sIdx].badge = e.target.value;
                        setContent({ ...content, clinicalStats: updated });
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-semibold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-0.5">Título del Resultado:</label>
                    <input
                      type="text"
                      value={stat.title}
                      onChange={(e) => {
                        const updated = [...content.clinicalStats];
                        updated[sIdx].title = e.target.value;
                        setContent({ ...content, clinicalStats: updated });
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-0.5">Explicación Clínica:</label>
                    <textarea
                      rows={2}
                      value={stat.description}
                      onChange={(e) => {
                        const updated = [...content.clinicalStats];
                        updated[sIdx].description = e.target.value;
                        setContent({ ...content, clinicalStats: updated });
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SECCIÓN: PRECIOS, PACKS Y PRODUCTO HERO */}
      {activeSection === 'packs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-base text-purple-900 uppercase tracking-wider flex items-center gap-2">
              <span>🏷️ Precios, Packs y Ofertas de Volumen</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Modifica los precios de 1, 2 y 3 kits, precios tachados, regalos sorpresa y títulos.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kicker Superior (Encabezado de laboratorio):</label>
              <input
                type="text"
                value={content.productKicker}
                onChange={(e) => setContent({ ...content, productKicker: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Título del Producto (H1 Principal):</label>
              <input
                type="text"
                value={content.productTitle}
                onChange={(e) => setContent({ ...content, productTitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Descripción / Tagline de Alto Impacto:</label>
              <textarea
                rows={2}
                value={content.productTagline}
                onChange={(e) => setContent({ ...content, productTagline: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>

          {/* The 3 packs editor */}
          <div className="space-y-5 pt-2">
            {content.packs.map((pack, idx) => {
              const hasGift = Boolean(pack.freeGift && pack.freeGift.trim() !== '');
              return (
                <div key={pack.id} className="p-5 rounded-2xl border-2 border-purple-100 bg-slate-50/80 space-y-4 text-xs shadow-xs">
                  {/* Pack Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-900 text-white font-black text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <strong className="text-slate-900 font-black text-sm">
                        {pack.title}
                      </strong>
                      {pack.badge && (
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[10px] border border-amber-300">
                          {pack.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {hasGift && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...content.packs];
                            updated[idx] = {
                              ...updated[idx],
                              freeGift: '',
                              // Also remove gift bullet from features if present
                              features: (updated[idx].features || []).filter(
                                f => !f.toLowerCase().includes('') && !f.toLowerCase().includes('') && !f.toLowerCase().includes('')
                              )
                            };
                            setContent({ ...content, packs: updated });
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Elimina el regalo y limpia las viñetas que lo mencionen"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Quitar Regalo</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row 1: Title, Subtitle, Badge */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Título del Pack:</label>
                      <input
                        type="text"
                        value={pack.title}
                        onChange={(e) => {
                          const updated = [...content.packs];
                          updated[idx].title = e.target.value;
                          setContent({ ...content, packs: updated });
                        }}
                        className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Subtítulo Descriptivo:</label>
                      <input
                        type="text"
                        value={pack.subtitle || ''}
                        onChange={(e) => {
                          const updated = [...content.packs];
                          updated[idx].subtitle = e.target.value;
                          setContent({ ...content, packs: updated });
                        }}
                        placeholder="Ej: Tratamiento Intensivo (2 Meses)"
                        className="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-slate-700"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700 block">Etiqueta Destacada (Badge):</label>
                        {pack.badge && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...content.packs];
                              updated[idx].badge = '';
                              setContent({ ...content, packs: updated });
                            }}
                            className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                          >
                            Quitar Etiqueta
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={pack.badge || ''}
                        onChange={(e) => {
                          const updated = [...content.packs];
                          updated[idx].badge = e.target.value;
                          setContent({ ...content, packs: updated });
                        }}
                        placeholder="Ej: MÁS VENDIDO · 48% OFF (o dejar vacío)"
                        className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-semibold text-amber-900"
                      />
                    </div>
                  </div>

                  {/* Row 2: Prices and Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Precio de Venta ($ ARS):</label>
                      <input
                        type="number"
                        value={pack.salePrice}
                        onChange={(e) => {
                          const updated = [...content.packs];
                          updated[idx].salePrice = Number(e.target.value);
                          updated[idx].savings = updated[idx].originalPrice - updated[idx].salePrice;
                          setContent({ ...content, packs: updated });
                        }}
                        className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-black text-purple-950 text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Precio Original Tachado ($):</label>
                      <input
                        type="number"
                        value={pack.originalPrice}
                        onChange={(e) => {
                          const updated = [...content.packs];
                          updated[idx].originalPrice = Number(e.target.value);
                          updated[idx].savings = updated[idx].originalPrice - updated[idx].salePrice;
                          setContent({ ...content, packs: updated });
                        }}
                        className="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Kits en este pack (cantidad):</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={pack.quantity}
                        onChange={(e) => {
                          const updated = [...content.packs];
                          updated[idx].quantity = Number(e.target.value);
                          setContent({ ...content, packs: updated });
                        }}
                        className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                  </div>

                  {/* Row 3: Regalo Incluido con botón directo para borrar */}
                  <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-black text-amber-950 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-amber-700" />
                        <span></span>
                      </label>
                      {hasGift && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...content.packs];
                            updated[idx].freeGift = '';
                            setContent({ ...content, packs: updated });
                          }}
                          className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-white px-2 py-0.5 rounded border border-rose-300 cursor-pointer"
                        >
                          Borrar texto de regalo
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={pack.freeGift || ''}
                      onChange={(e) => {
                        const updated = [...content.packs];
                        updated[idx].freeGift = e.target.value;
                        setContent({ ...content, packs: updated });
                      }}
                      placeholder="Dejar vacío si no incluye regalo (ej: 🎁 REGALO: Neceser Térmico)"
                      className="w-full p-2.5 bg-white rounded-xl border border-amber-300 font-medium text-slate-900 placeholder:text-slate-400"
                    />
                    {!hasGift && (
                      <p className="text-[11px] text-slate-500 italic">
                        Actualmente este pack NO tiene regalo activo. No se mostrará ninguna caja de regalo en la tienda ni en el carrito.
                      </p>
                    )}
                  </div>

                  {/* Row 4: Pack Features / Beneficios Bullets */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-extrabold text-slate-800 block">
                          Viñetas y Beneficios de este Pack ({pack.features?.length || 0}):
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Frases con tilde verde que aparecen bajo el pack en la página de compra.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...content.packs];
                          const currentFeats = updated[idx].features || [];
                          updated[idx].features = [...currentFeats, 'Nuevo beneficio'];
                          setContent({ ...content, packs: updated });
                        }}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Viñeta</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(pack.features || []).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => {
                              const updated = [...content.packs];
                              const feats = [...(updated[idx].features || [])];
                              feats[fIdx] = e.target.value;
                              updated[idx].features = feats;
                              setContent({ ...content, packs: updated });
                            }}
                            className="flex-1 p-2 bg-white rounded-lg border border-slate-300 text-xs"
                            placeholder="Ej: Envío prioritario gratis"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...content.packs];
                              updated[idx].features = (updated[idx].features || []).filter((_, i) => i !== fIdx);
                              setContent({ ...content, packs: updated });
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Eliminar esta viñeta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SECCIÓN: TIEMPOS, URGENCIAS Y ENVÍOS */}
      {activeSection === 'urgency' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-base text-purple-900 uppercase tracking-wider flex items-center gap-2">
              <span>⚡ Tiempos, Contador de Urgencia y Envíos</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Controla el stock disponible, tiempo de oferta, entrega y textos de envíos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Minutos del Contador de Oferta:</label>
              <input
                type="number"
                value={content.countdownMinutes}
                onChange={(e) => setContent({ ...content, countdownMinutes: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kits restantes en barra de Stock:</label>
              <input
                type="number"
                value={content.stockRemaining}
                onChange={(e) => setContent({ ...content, stockRemaining: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold text-amber-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Compradores viendo en vivo:</label>
              <input
                type="number"
                value={content.viewersCount}
                onChange={(e) => setContent({ ...content, viewersCount: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tiempo de Entrega Prometido:</label>
              <input
                type="text"
                value={content.shippingEstimatedDays}
                onChange={(e) => setContent({ ...content, shippingEstimatedDays: e.target.value })}
                placeholder="Ej: 24 a 48 horas en todo el país"
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Empresas de Transporte:</label>
              <input
                type="text"
                value={content.shippingCarriersText}
                onChange={(e) => setContent({ ...content, shippingCarriersText: e.target.value })}
                placeholder="Ej: Andreani · Correo Argentino · Moto Express"
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Texto Barra Superior (Urgencia):</label>
              <input
                type="text"
                value={content.announcementText}
                onChange={(e) => setContent({ ...content, announcementText: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtexto de la Barra:</label>
              <input
                type="text"
                value={content.announcementSubtext}
                onChange={(e) => setContent({ ...content, announcementSubtext: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. SECCIÓN: INGREDIENTES Y DOCTORA DERMATÓLOGA */}
      {activeSection === 'ingredients' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-base text-purple-900 uppercase tracking-wider flex items-center gap-2">
              <span>🔬 Ingredientes Activos y Aval Dermatológico</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Personaliza los activos de la fórmula y la foto y testimonio del profesional médico.
            </p>
          </div>

          {/* Doctor info card */}
          <div className="p-4 rounded-2xl border-2 border-purple-100 bg-purple-50/20 space-y-3 text-xs">
            <span className="font-black text-sm text-purple-950 block">
              Dermatóloga / Especialista que avala el producto
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img 
                src={content.dermatologistPhoto} 
                alt="Doctora" 
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-300 shadow-sm shrink-0"
              />
              <div className="space-y-2 flex-1 w-full">
                <label className="flex items-center justify-center gap-2 p-2 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl cursor-pointer text-xs w-full sm:w-auto">
                  <Upload className="w-4 h-4" />
                  <span>Subir Foto del Médico desde PC</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleDoctorImageUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={content.dermatologistDoctorName}
                  onChange={(e) => setContent({ ...content, dermatologistDoctorName: e.target.value })}
                  placeholder="Nombre y Matrícula del médico"
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Cita o Testimonio Médico:</label>
              <textarea
                rows={2}
                value={content.dermatologistQuote}
                onChange={(e) => setContent({ ...content, dermatologistQuote: e.target.value })}
                className="w-full p-2.5 bg-white rounded-xl border border-slate-300 italic"
              />
            </div>
          </div>

          {/* Ingredients list */}
          <div className="space-y-3 pt-2">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Los 6 Activos Biotecnológicos
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {content.activeIngredients.map((ing, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Nombre:</label>
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => {
                        const updated = [...content.activeIngredients];
                        updated[idx].name = e.target.value;
                        setContent({ ...content, activeIngredients: updated });
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold text-purple-950"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Tipo / Fuente:</label>
                    <input
                      type="text"
                      value={ing.type}
                      onChange={(e) => {
                        const updated = [...content.activeIngredients];
                        updated[idx].type = e.target.value;
                        setContent({ ...content, activeIngredients: updated });
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Beneficio:</label>
                    <textarea
                      rows={2}
                      value={ing.benefit}
                      onChange={(e) => {
                        const updated = [...content.activeIngredients];
                        updated[idx].benefit = e.target.value;
                        setContent({ ...content, activeIngredients: updated });
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. SECCIÓN: PROBLEMAS VS SOLUCIÓN */}
      {activeSection === 'problems' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-base text-purple-900 uppercase tracking-wider flex items-center gap-2">
              <span>🎯 Problemas que Soluciona vs Acción de H2derm</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Personaliza el análisis de piel seca, picazón, manchas y luminosidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Título de la Sección de Problemas:</label>
              <input
                type="text"
                value={content.problemTitle}
                onChange={(e) => setContent({ ...content, problemTitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtítulo Explicativo:</label>
              <input
                type="text"
                value={content.problemSubtitle}
                onChange={(e) => setContent({ ...content, problemSubtitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            {content.problemItems.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                <span className="font-black text-xs text-slate-900 block">Tarjeta #{idx + 1}</span>
                <div>
                  <label className="font-bold text-red-600 block mb-0.5">Problema:</label>
                  <input
                    type="text"
                    value={item.problemName}
                    onChange={(e) => {
                      const updated = [...content.problemItems];
                      updated[idx].problemName = e.target.value;
                      setContent({ ...content, problemItems: updated });
                    }}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-0.5">Descripción del Problema:</label>
                  <textarea
                    rows={2}
                    value={item.problemDescription}
                    onChange={(e) => {
                      const updated = [...content.problemItems];
                      updated[idx].problemDescription = e.target.value;
                      setContent({ ...content, problemItems: updated });
                    }}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-purple-700 block mb-0.5">Solución H2derm:</label>
                  <input
                    type="text"
                    value={item.solutionName}
                    onChange={(e) => {
                      const updated = [...content.problemItems];
                      updated[idx].solutionName = e.target.value;
                      setContent({ ...content, problemItems: updated });
                    }}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-0.5">Acción Celular:</label>
                  <textarea
                    rows={2}
                    value={item.solutionDescription}
                    onChange={(e) => {
                      const updated = [...content.problemItems];
                      updated[idx].solutionDescription = e.target.value;
                      setContent({ ...content, problemItems: updated });
                    }}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SECCIÓN: GARANTÍA Y CONTACTOS */}
      {activeSection === 'guarantee' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-base text-purple-900 uppercase tracking-wider flex items-center gap-2">
              <span>🛡️ Garantía Incondicional y Canales de Atención</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Configura los días de devolución sin riesgo y tus canales oficiales de contacto.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Título de Garantía:</label>
              <input
                type="text"
                value={content.guaranteeTitle}
                onChange={(e) => setContent({ ...content, guaranteeTitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Días de Garantía:</label>
              <input
                type="number"
                value={content.guaranteeDays}
                onChange={(e) => setContent({ ...content, guaranteeDays: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold text-amber-800"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Texto de la Garantía:</label>
              <textarea
                rows={2}
                value={content.guaranteeText}
                onChange={(e) => setContent({ ...content, guaranteeText: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp de Atención al Cliente:</label>
              <input
                type="text"
                value={content.whatsappNumber}
                onChange={(e) => setContent({ ...content, whatsappNumber: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email de Soporte:</label>
              <input
                type="email"
                value={content.supportEmail}
                onChange={(e) => setContent({ ...content, supportEmail: e.target.value })}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Save Action */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={() => handleSave()}
          className="bg-purple-900 hover:bg-purple-950 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-xl transition-all cursor-pointer inline-flex items-center gap-2 transform hover:scale-102"
        >
          {savedSuccess ? (
            <>
              <Check className="w-5 h-5 text-emerald-300 stroke-[3]" />
              <span className="text-emerald-300">¡CAMBIOS GUARDADOS EXITOSAMENTE!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>GUARDAR TODOS LOS CAMBIOS</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export const BeforeAfterManager: React.FC = () => {
  return <ContentEditor initialSection="beforeAfter" />;
};

export default ContentEditor;

