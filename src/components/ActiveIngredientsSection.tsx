import React from 'react';
import { ShieldCheck, Microscope, Award } from 'lucide-react';
import { StoreContent } from '../types/store';

interface ActiveIngredientsSectionProps {
  content: StoreContent;
}

export const ActiveIngredientsSection: React.FC<ActiveIngredientsSectionProps> = ({ content }) => {
  const ingredients = content.activeIngredients && content.activeIngredients.length > 0 ? content.activeIngredients : [];
  const doctorName = content.dermatologistDoctorName || 'Dra. Mariana Estévez · Médica Dermatóloga (M.N. 128.490)';
  const doctorQuote = content.dermatologistQuote || '«H2derm logra lo que pocos kits consiguen: combinar el poder antiedad del Bakuchiol sin resecar, y la hidratación intensiva sin sobrecargar la piel.»';
  const doctorPhoto = content.dermatologistPhoto || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop';

  return (
    <section className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            <Microscope className="w-3.5 h-3.5 text-purple-700" />
            Fórmula Biotecnológica Segura
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ingredientes Clínicos de Grado Profesional
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Cada componente fue seleccionado y calibrado en concentraciones exactas para una absorción profunda sin efecto graso.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ingredients.map((ing, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-purple-300 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {ing.tag}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {ing.name}
                </h3>
                <span className="text-xs font-semibold text-slate-500 block">
                  {ing.type}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {ing.benefit}
              </p>
            </div>
          ))}
        </div>

        {/* Dermatologist note */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <img
            src={doctorPhoto}
            alt={doctorName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-purple-100 shrink-0 shadow-md"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop';
            }}
          />
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
              <Award className="w-4 h-4 text-purple-700" />
              <span className="text-xs font-bold text-slate-900">Avalado por Especialistas en Dermocosmética</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 italic">
              {doctorQuote}
            </p>
            <span className="text-xs font-extrabold text-purple-900 block">
              {doctorName}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
