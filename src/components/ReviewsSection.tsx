import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  Camera, 
  Plus, 
  X,
  Sparkles,
  ShieldCheck 
} from 'lucide-react';
import { ReviewItem } from '../types/store';
import { addReview } from '../services/storage';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  onReviewsUpdated: (reviews: ReviewItem[]) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onReviewsUpdated
}) => {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New review form state
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const filteredReviews = filterRating 
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPhotoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const created = addReview({
      name: newName.trim(),
      city: newCity.trim() || 'Argentina',
      rating: newRating,
      verified: true,
      title: newTitle.trim() || '¡Excelente experiencia con H2derm!',
      comment: newComment.trim(),
      photoUrl: newPhotoUrl || undefined,
      date: 'Reciente'
    });

    onReviewsUpdated([created, ...reviews]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmittedMessage(false);
      setNewName('');
      setNewCity('');
      setNewTitle('');
      setNewComment('');
      setNewPhotoUrl('');
    }, 1800);
  };

  return (
    <section id="opiniones-clientes" className="py-12 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Opiniones de Clientes Reales
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Calificación 4.9 de 5 Estrellas
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <span className="font-extrabold text-slate-900 text-base">4.9 / 5.0</span>
              <span>· Más de 2.840 pedidos entregados</span>
            </div>
          </div>

          {/* Action: Add Review */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-purple-800 hover:bg-purple-900 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer self-start md:self-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Escribir Mi Reseña con Foto</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterRating === null
                ? 'bg-purple-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas las reseñas ({reviews.length})
          </button>
          <button
            onClick={() => setFilterRating(5)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterRating === 5
                ? 'bg-purple-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>5 Estrellas</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </button>
          <button
            onClick={() => setFilterRating(4)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterRating === 4
                ? 'bg-purple-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>4 Estrellas</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50/70 rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Author row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        {rev.name}
                        {rev.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.2 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verificada
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-slate-500">{rev.city} · {rev.date}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Title & Comment */}
                <h5 className="font-extrabold text-slate-900 text-sm">
                  «{rev.title}»
                </h5>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {rev.comment}
                </p>

                {/* Attached Photo */}
                {rev.photoUrl && (
                  <div className="pt-2">
                    <img
                      src={rev.photoUrl}
                      alt="Resultado de cliente H2derm"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-2 border-white shadow-md hover:scale-105 transition-transform cursor-pointer"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Footer row with Helpful counter */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px] text-purple-900 font-semibold">
                  Kit adquirido: H2derm Profesional
                </span>
                <button 
                  className="flex items-center gap-1.5 hover:text-purple-700 transition-colors cursor-pointer"
                  onClick={() => {
                    rev.likes += 1;
                    onReviewsUpdated([...reviews]);
                  }}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Útil ({rev.likes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal: Write Review */}
      {isModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 rounded-full"
              aria-label="Cerrar modal de reseña"
            >
              <X className="w-6 h-6" />
            </button>

            {submittedMessage ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  ¡Gracias por compartir tu experiencia!
                </h3>
                <p className="text-xs text-slate-600">
                  Tu reseña ha sido publicada y ayuda a cientos de personas a mejorar su piel.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-purple-700 uppercase">Comunidad H2derm</span>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Deja tu Reseña y Foto
                  </h3>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tu Calificación:
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Ej: Laura Rossi"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Ciudad / Provincia</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Ej: Córdoba"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Título de tu opinión</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej: ¡Mi piel cambió por completo en 2 semanas!"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Comentario detallado *</label>
                  <textarea
                    required
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Cuéntanos cómo sentiste tu piel, qué cambios viste en las manchas o sequedad..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Adjuntar Foto de Resultado (Opcional)
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <Camera className="w-4 h-4 text-purple-700" />
                    <span className="text-xs text-slate-600 font-medium">
                      {newPhotoUrl ? 'Foto cargada con éxito' : 'Subir foto desde tu dispositivo'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {newPhotoUrl && (
                    <img
                      src={newPhotoUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover mt-2 border border-slate-200"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-800 hover:bg-purple-900 text-white font-extrabold text-sm py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Publicar Mi Reseña Verificada
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
