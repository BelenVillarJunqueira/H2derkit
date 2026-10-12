import React, { useState } from 'react';
import {
    Save,
    Check,
    Upload,
    Sparkles,
    RotateCcw,
    Eye,
    Trash2,
    Plus,
    Microscope,
    Camera,
    Image as ImageIcon
} from 'lucide-react';
import { StoreContent, ClinicalStat } from '../../types/store';
import { getStoreContent, saveStoreContent, uploadImageToServer, DEFAULT_CONTENT } from '../../services/storage';

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

export const BeforeAfterManager: React.FC = () => {
    const [content, setContent] = useState<StoreContent>(getStoreContent());
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [previewSliderPos, setPreviewSliderPos] = useState(50);

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        saveStoreContent(content);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
    };

    const handleBeforeAfterImageUpload = async (target: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const serverUrl = await uploadImageToServer(file, target);
            if (target === 'before') {
                setContent(prev => ({ ...prev, beforeImage: serverUrl }));
            } else {
                setContent(prev => ({ ...prev, afterImage: serverUrl }));
            }
        } catch {
            alert('Error al procesar la imagen seleccionada.');
        }
    };

    const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const x = clientX - rect.left;
        const percent = Math.min(Math.max((x / rect.width) * 100, 5), 95);
        setPreviewSliderPos(percent);
    };

    return (
        <div className="space-y-6">
            {/* Top Banner with Action buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-700 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Editor Visual de Resultados</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                        Gestor de Fotos Antes y Después & Evidencia Clínica
                    </h3>
                    <p className="text-xs text-slate-500">
                        Sube o reemplaza las fotos del comparador interactivo y ajusta los textos y porcentajes clínicos.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('¿Restablecer las fotos y textos de Antes/Después a los valores iniciales de fábrica?')) {
                                const restored = {
                                    ...content,
                                    beforeAfterTitle: DEFAULT_CONTENT.beforeAfterTitle,
                                    beforeAfterSubtitle: DEFAULT_CONTENT.beforeAfterSubtitle,
                                    beforeLabel: DEFAULT_CONTENT.beforeLabel,
                                    afterLabel: DEFAULT_CONTENT.afterLabel,
                                    beforeDescription: DEFAULT_CONTENT.beforeDescription,
                                    afterDescription: DEFAULT_CONTENT.afterDescription,
                                    beforeImage: DEFAULT_CONTENT.beforeImage,
                                    afterImage: DEFAULT_CONTENT.afterImage,
                                    clinicalStats: DEFAULT_CONTENT.clinicalStats
                                };
                                setContent(restored);
                                saveStoreContent(restored);
                                setSavedSuccess(true);
                                setTimeout(() => setSavedSuccess(false), 3000);
                            }
                        }}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restablecer
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSave()}
                        className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition shadow-sm cursor-pointer ${savedSuccess
                                ? 'bg-emerald-600 text-white'
                                : 'bg-purple-900 hover:bg-purple-950 text-white'
                            }`}
                    >
                        {savedSuccess ? (
                            <>
                                <Check className="w-4 h-4" />
                                ¡Cambios Guardados!
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Guardar Fotos y Textos
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Form Body */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                {/* Headings Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Título Principal de la Sección:</label>
                        <input
                            type="text"
                            value={content.beforeAfterTitle}
                            onChange={(e) => setContent({ ...content, beforeAfterTitle: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs font-extrabold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-700"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo Descriptivo:</label>
                        <input
                            type="text"
                            value={content.beforeAfterSubtitle}
                            onChange={(e) => setContent({ ...content, beforeAfterSubtitle: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs text-slate-700 focus:bg-white focus:ring-2 focus:ring-purple-700"
                        />
                    </div>
                </div>

                {/* Live Interactive Preview Box */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-purple-300 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Vista Previa en Vivo del Comparador (Desliza con el mouse o dedo)
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Posición: {Math.round(previewSliderPos)}%</span>
                    </div>

                    <div
                        className="relative w-full aspect-16/9 sm:aspect-21/9 rounded-xl overflow-hidden shadow-2xl border border-slate-700 select-none cursor-ew-resize bg-black"
                        onMouseMove={handleSliderMove}
                        onTouchMove={handleSliderMove}
                    >
                        {/* Background After Image */}
                        <img
                            src={content.afterImage || DEFAULT_CONTENT.afterImage}
                            alt="Después"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                        <span className="absolute top-3 right-3 bg-purple-900/90 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm">
                            DESPUÉS (Día 28)
                        </span>

                        {/* Foreground Before Image with clip */}
                        <div
                            className="absolute inset-0 overflow-hidden pointer-events-none"
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
                                <label className="font-bold text-slate-600 block mb-1">O escribe URL directa de la foto:</label>
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

                {/* Text descriptions under photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div>
                            <label className="text-xs font-extrabold text-slate-800 block mb-1">Etiqueta del Antes:</label>
                            <input
                                type="text"
                                value={content.beforeLabel}
                                onChange={(e) => setContent({ ...content, beforeLabel: e.target.value })}
                                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 block mb-1">Descripción del problema visible:</label>
                            <textarea
                                rows={2}
                                value={content.beforeDescription}
                                onChange={(e) => setContent({ ...content, beforeDescription: e.target.value })}
                                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
                        <div>
                            <label className="text-xs font-extrabold text-purple-950 block mb-1">Etiqueta del Después:</label>
                            <input
                                type="text"
                                value={content.afterLabel}
                                onChange={(e) => setContent({ ...content, afterLabel: e.target.value })}
                                className="w-full p-2 bg-white rounded-lg border border-purple-300 text-xs font-bold text-purple-900"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 block mb-1">Descripción del resultado logrado:</label>
                            <textarea
                                rows={2}
                                value={content.afterDescription}
                                onChange={(e) => setContent({ ...content, afterDescription: e.target.value })}
                                className="w-full p-2 bg-white rounded-lg border border-purple-300 text-xs text-slate-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Clinical stats section */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
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
                                        className="text-red-500 hover:text-red-700 p-1"
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

                {/* Bottom Save Bar */}
                <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <button
                        type="button"
                        onClick={() => handleSave()}
                        className={`px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition shadow-md cursor-pointer ${savedSuccess
                                ? 'bg-emerald-600 text-white'
                                : 'bg-purple-900 hover:bg-purple-950 text-white'
                            }`}
                    >
                        {savedSuccess ? (
                            <>
                                <Check className="w-5 h-5" />
                                ¡Cambios Guardados con Éxito!
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Guardar Todos los Cambios
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BeforeAfterManager;
