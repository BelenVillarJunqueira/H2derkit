import React from 'react';
import { 
  CheckCircle2, 
  Droplets, 
  ShieldAlert, 
  Sun, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import { StoreContent } from '../types/store';

interface ProblemSolutionSectionProps {
  content: StoreContent;
  onCtaClick: () => void;
}

export const ProblemSolutionSection: React.FC<ProblemSolutionSectionProps> = ({
  content,
  onCtaClick
}) => {
  const problems = content.problemItems && content.problemItems.length > 0 ? content.problemItems : [];

  const icons = [
    <Droplets key="1" className="w-5 h-5" />,
    <ShieldAlert key="2" className="w-5 h-5" />,
    <Sun key="3" className="w-5 h-5" />,
    <Sparkles key="4" className="w-5 h-5" />
  ];

  return (
    <section className="py-12 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            ¿Por Qué las Cremas Comunes No Te Funcionan?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {content.problemTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {content.problemSubtitle}
          </p>
        </div>

        {/* 4 Problems vs 4 Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((item, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 relative hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                {icons[idx % icons.length]}
              </div>
              <div>
                <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">El Problema</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{item.problemName}</h3>
                <p className="text-xs text-slate-600 mt-1">
                  {item.problemDescription}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Solución H2derm
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">{item.solutionName}</h4>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  {item.solutionDescription}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Comparison Table */}
        <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-amber-300 text-xs font-extrabold uppercase tracking-widest">
                La Diferencia Profesional
              </span>
              <h3 className="text-xl sm:text-3xl font-black">
                Cremas Comerciales vs Kit H2derm Profesional
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-purple-800/80 text-purple-200">
                    <th className="py-3 px-3 font-semibold">Beneficio Cutáneo</th>
                    <th className="py-3 px-3 font-semibold text-slate-400">Cremas de Farmacia Común</th>
                    <th className="py-3 px-3 font-bold text-amber-300 bg-purple-800/40 rounded-t-xl">Kit H2derm Oficial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-800/40 text-purple-100">
                  <tr>
                    <td className="py-3 px-3 font-medium">Penetración celular</td>
                    <td className="py-3 px-3 text-slate-400">Superficial (solo epidermis externa)</td>
                    <td className="py-3 px-3 font-bold text-white bg-purple-800/20">Dermis profunda celular</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium">Duración de la hidratación</td>
                    <td className="py-3 px-3 text-slate-400">2 a 4 horas (se evapora rápido)</td>
                    <td className="py-3 px-3 font-bold text-white bg-purple-800/20">24 horas de hidratación continua</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium">Tratamiento de manchas</td>
                    <td className="py-3 px-3 text-slate-400">Nulo o causa irritación severa</td>
                    <td className="py-3 px-3 font-bold text-white bg-purple-800/20">Bakuchiol 1% + ADN Liposomado</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium">Alivio de picazón y tirantez</td>
                    <td className="py-3 px-3 text-slate-400">Temporal con alcoholes pesados</td>
                    <td className="py-3 px-3 font-bold text-white bg-purple-800/20">Reparación de barrera lipídica</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium">Garantía de reembolso</td>
                    <td className="py-3 px-3 text-slate-400">Sin garantía si el envase fue abierto</td>
                    <td className="py-3 px-3 font-bold text-amber-300 bg-purple-800/20">10 Días 100% Sin Riesgo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={onCtaClick}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 transform hover:scale-105"
              >
                <span>Probar H2derm con Envío Gratis y Garantía</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
