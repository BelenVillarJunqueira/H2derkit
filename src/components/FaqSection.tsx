import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿En cuánto tiempo comenzaré a notar los resultados en mi piel?',
      a: 'El alivio de la tirantez y la picazón es inmediato desde la primera aplicación de la crema restructurante y el sérum. A partir de los días 7 a 14 notarás una textura mucho más tersa y luminosa. La atenuación notable de manchas y líneas de expresión alcanza su pico óptimo a los 28 días con el uso continuo.'
    },
    {
      q: '¿Cómo funciona el pago contraentrega en mi domicilio?',
      a: 'El método contraentrega te permite pedir tu kit hoy con total tranquilidad. Nosotros preparamos tu pedido y te lo enviamos por correo privado. Cuando el repartidor llegue a tu casa, le abonas el importe exacto en efectivo o con tarjeta de débito. ¡0% riesgo para ti!'
    },
    {
      q: '¿Puedo pagar con Mercado Pago en cuotas sin interés?',
      a: 'Sí, contamos con pasarela oficial de Mercado Pago 100% segura. Puedes abonar con cualquier tarjeta de crédito en 3 cuotas sin interés o hasta 12 cuotas, dinero en cuenta de Mercado Pago o cupón para Pago Fácil / Rapipago.'
    },
    {
      q: '¿Es apto si tengo piel extremadamente sensible o rosácea?',
      a: 'Totalmente. La fórmula de H2derm fue desarrollada bajo estándares de dermocosmética clínica libre de parabenos, fragancias artificiales irritantes y alcoholes agresivos. Utilizamos Bakuchiol en lugar de retinol clásico justamente para evitar la inflamación o descamación en pieles reactivas.'
    },
    {
      q: '¿Cómo puedo hacer el seguimiento en tiempo real de mi pedido?',
      a: 'Al confirmar tu compra, el sistema te asigna un código único de tracking (por ejemplo H2D-84920). Puedes ingresar a cualquier hora en la pestaña "Seguir Pedido" de nuestra web o enviarnos un WhatsApp para ver el estado exacto: empaquetado, despachado o en camino a tu puerta.'
    },
    {
      q: '¿Qué garantía tengo si el producto no cumple mis expectativas?',
      a: 'Ofrecemos nuestra Garantía de Satisfacción Total de 30 Días. Si dentro de los 30 días de recibir tu kit consideras que tu piel no mejoró como esperabas, nos escribes por WhatsApp o email y gestionamos la devolución del 100% de tu dinero.'
    }
  ];

  return (
    <section id="preguntas-frecuentes" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Resolvemos tus Dudas
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-sm text-slate-600">
            Todo lo que necesitas saber antes de empezar tu tratamiento con H2derm.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-4.5 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-purple-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-purple-700 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-purple-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
