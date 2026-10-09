import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Film, 
  Image as ImageIcon, 
  Save, 
  Check, 
  Plus, 
  Sparkles,
  RotateCcw,
  Video,
  AlertCircle
} from 'lucide-react';
import { MediaItem } from '../../types/store';
import { 
  getStoreMedia, 
  saveStoreMedia, 
  DEFAULT_MEDIA, 
  getMediaFromIndexedDB 
} from '../../services/storage';

// High-performance client-side compressor to guarantee photos fit in browser storage
const compressMediaFile = (file: File): Promise<{ url: string; sizeKb: number }> => {
  return new Promise((resolve, reject) => {
    // If it's a video file
    if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve({ url: result, sizeKb: Math.round(file.size / 1024) });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    // For images, resize to max 1280px and compress to high quality JPEG
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1280;
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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
          resolve({ url: dataUrl, sizeKb });
        } else {
          resolve({ url: e.target?.result as string, sizeKb: Math.round(file.size / 1024) });
        }
      };
      img.onerror = () => {
        resolve({ url: e.target?.result as string, sizeKb: Math.round(file.size / 1024) });
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const MediaManager: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(getStoreMedia());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // New item upload state
  const [newTitle, setNewTitle] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newType, setNewType] = useState<'image' | 'video'>('image');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [fileSizeInfo, setFileSizeInfo] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Sync from IndexedDB on mount if available
  useEffect(() => {
    getMediaFromIndexedDB().then((indexedMedia) => {
      if (indexedMedia && Array.isArray(indexedMedia)) {
        setMediaList(indexedMedia);
      }
    });
  }, []);

  const triggerSaveNotification = (msg: string) => {
    setStatusMessage(msg);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setStatusMessage('');
    }, 2500);
  };

  // Handle file upload from PC with automatic compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (file.type.startsWith('video/')) {
        setNewType('video');
      } else {
        setNewType('image');
      }

      const { url, sizeKb } = await compressMediaFile(file);
      setUploadedUrl(url);
      setFileSizeInfo(`Archivo optimizado listo: ${sizeKb} KB`);
      setIsUploading(false);
    } catch (err) {
      alert('Error al procesar el archivo. Intenta con otra imagen o video.');
      setIsUploading(false);
    }
  };

  const handleAddNewItem = () => {
    if (!uploadedUrl) {
      alert('Por favor selecciona una imagen o video desde tu PC o pega una URL.');
      return;
    }

    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      type: newType,
      url: uploadedUrl,
      title: newTitle.trim() || (newType === 'video' ? 'Video Demostrativo H2derm' : 'Imagen H2derm Oficial'),
      badge: newBadge.trim() || undefined
    };

    const updated = [...mediaList, newItem];
    setMediaList(updated);
    saveStoreMedia(updated); // Guardado inmediato y persistente

    // Reset input fields
    setNewTitle('');
    setNewBadge('');
    setUploadedUrl('');
    setFileSizeInfo('');
    triggerSaveNotification('¡Nueva imagen agregada y guardada!');
  };

  // Reordering functions - Saves immediately to storage
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...mediaList];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setMediaList(updated);
    saveStoreMedia(updated);
    triggerSaveNotification('Orden actualizado y guardado');
  };

  const handleMoveDown = (index: number) => {
    if (index === mediaList.length - 1) return;
    const updated = [...mediaList];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setMediaList(updated);
    saveStoreMedia(updated);
    triggerSaveNotification('Orden actualizado y guardado');
  };

  // Delete single item - Saves immediately to storage
  const handleDelete = (index: number) => {
    const updated = mediaList.filter((_, i) => i !== index);
    setMediaList(updated);
    saveStoreMedia(updated); // Guardado inmediato
    triggerSaveNotification('Imagen eliminada y guardada');
  };

  // Delete ALL original/current items to start completely clean
  const handleDeleteAll = () => {
    if (confirm('¿Deseas eliminar TODAS las imágenes actuales para colocar únicamente las tuyas?')) {
      const updated: MediaItem[] = [];
      setMediaList(updated);
      saveStoreMedia(updated);
      triggerSaveNotification('Todas las fotos anteriores han sido eliminadas');
    }
  };

  const handleSaveOrder = () => {
    saveStoreMedia(mediaList);
    triggerSaveNotification('¡Carrusel guardado con éxito!');
  };

  const handleResetDefaults = () => {
    if (confirm('¿Deseas restablecer las fotos y videos originales del producto?')) {
      setMediaList(DEFAULT_MEDIA);
      saveStoreMedia(DEFAULT_MEDIA);
      triggerSaveNotification('Fotos originales restablecidas');
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Header & Save Button */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Gestor Multimedia del Carrusel (Fotos y Videos)
          </h3>
          <p className="text-xs text-slate-500">
            Sube tus fotos desde la PC, elimina las que no quieras y organiza el orden exacto.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mediaList.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAll}
              className="text-xs font-bold text-rose-700 hover:text-white hover:bg-rose-600 px-3 py-2 rounded-xl border border-rose-300 transition-colors cursor-pointer flex items-center gap-1"
              title="Borrar todas las fotos actuales para dejar solo las tuyas"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Todas</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-semibold text-slate-600 hover:text-purple-700 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Restablecer Originales
          </button>

          <button
            onClick={handleSaveOrder}
            className="bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                <span className="text-emerald-300">{statusMessage || '¡GUARDADO!'}</span>
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

      {/* Banner de Acceso Rápido a Fotos Antes y Después */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 p-4 rounded-2xl border-2 border-purple-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-purple-950">
              ¿Deseas modificar las fotos de «Antes y Después»?
            </h4>
            <p className="text-[11px] text-purple-800">
              Usa la pestaña dedicada <strong>«✨ Fotos Antes y Después»</strong> en la barra superior para subir tus fotos de día 1 y día 28 desde la PC.
            </p>
          </div>
        </div>
      </div>

      {/* Upload New File from PC Section */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-700" />
          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
            Subir Nueva Imagen o Video desde tu Computadora
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          
          {/* File Picker Box */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">
              1. Selecciona el archivo de tu producto (JPG, PNG, WEBP, MP4):
            </label>
            <label className="border-2 border-dashed border-purple-300 hover:border-purple-600 bg-purple-50/50 hover:bg-purple-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
              <Upload className="w-8 h-8 text-purple-700 animate-pulse" />
              <span className="font-bold text-slate-800 text-xs text-center">
                {isUploading ? 'Optimizando archivo...' : 'Haz clic aquí para elegir foto/video de tu PC'}
              </span>
              <span className="text-[11px] text-slate-500">
                Se optimiza automáticamente para cargar ultra rápido
              </span>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {fileSizeInfo && (
              <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{fileSizeInfo}</span>
              </div>
            )}

            {/* Manual URL fallback */}
            <div className="pt-2">
              <label className="font-bold text-slate-500 text-[11px] block mb-1">
                O pega un enlace / URL externa directa:
              </label>
              <input
                type="url"
                value={uploadedUrl}
                onChange={(e) => setUploadedUrl(e.target.value)}
                placeholder="https://ejemplo.com/mi-kit-rostro.jpg"
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>

          {/* Metadata & Preview */}
          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tipo de Contenido:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewType('image')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    newType === 'image' ? 'bg-purple-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Imagen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('video')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    newType === 'video' ? 'bg-purple-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Video MP4</span>
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Título de la Foto / Video:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej: Kit H2derm Completo Vista Frontal"
                className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Etiqueta Flotante (Badge Opcional):</label>
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                placeholder="Ej: KIT COMPLETO · EDICIÓN ESPECIAL"
                className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300"
              />
            </div>

            {uploadedUrl && (
              <div className="p-2.5 border border-slate-200 rounded-xl bg-slate-50 flex items-center gap-3">
                {newType === 'video' ? (
                  <video src={uploadedUrl} className="w-14 h-14 object-cover rounded-lg bg-black" />
                ) : (
                  <img src={uploadedUrl} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-slate-200" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-emerald-700 font-bold block">
                    ✓ Archivo listo para incorporar
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {newTitle || 'Imagen del producto'}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddNewItem}
              disabled={!uploadedUrl}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              <span>AGREGAR AL CARRUSEL Y GUARDAR</span>
            </button>
          </div>

        </div>
      </div>

      {/* Current Media Items Order List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-purple-900 uppercase tracking-wider">
            Fotos y Videos del Carrusel ({mediaList.length}) — Orden Actual
          </h4>
          <span className="text-xs text-slate-500">
            Cambiar el orden o eliminar guarda automáticamente.
          </span>
        </div>

        {mediaList.length === 0 ? (
          <div className="py-10 text-center space-y-3 bg-purple-50/50 rounded-2xl border border-purple-200 p-6">
            <Sparkles className="w-10 h-10 text-purple-700 mx-auto" />
            <h5 className="font-extrabold text-slate-800 text-sm">
              No hay fotos en el carrusel en este momento
            </h5>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Utiliza el recuadro de arriba para subir tus fotos o videos desde tu PC. Cada foto que subas se guardará automáticamente.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mediaList.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-purple-300 transition-colors"
              >
                {/* Thumbnail + info */}
                <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
                  <span className="w-7 h-7 rounded-full bg-purple-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 relative border border-slate-200">
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    )}
                    {item.type === 'video' && (
                      <div className="absolute top-1 left-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                        VIDEO
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                      {item.title}
                    </h5>
                    {item.badge && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded mt-0.5">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 block truncate max-w-xs mt-0.5">
                      {item.type === 'video' ? 'Video' : 'Imagen'} · Posición #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Move Up, Move Down, Delete */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Mover arriba en el carrusel"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === mediaList.length - 1}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Mover abajo en el carrusel"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer ml-1"
                    title="Eliminar esta foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
