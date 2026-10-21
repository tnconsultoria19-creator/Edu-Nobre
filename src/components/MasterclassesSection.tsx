import React from 'react';
import { MOCK_MASTERCLASSES } from '../data/mockData';
import { Award, Calendar, User, ArrowRight } from 'lucide-react';

interface MasterclassesSectionProps {
  onOpenFormModal: (need?: string) => void;
}

export const MasterclassesSection: React.FC<MasterclassesSectionProps> = ({ onOpenFormModal }) => {
  return (
    <section className="py-16 bg-white border-b border-[#dfdfe4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Title */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dfdfe4] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#ea407f] text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Eventos Ao Vivo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11112c] font-outfit">
              Masterclasses Recomendadas
            </h2>
          </div>

          <button
            onClick={() => onOpenFormModal('Comprar')}
            className="text-xs font-bold text-[#ea407f] hover:text-[#e7256d] flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Agenda Completa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Masterclasses List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_MASTERCLASSES.map((mc) => (
            <div
              key={mc.id}
              className="bg-[#f8f9fa] rounded-2xl p-6 border border-[#dfdfe4] hover:border-[#ea407f] transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#FFEFEF] text-[#ea407f] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
                    {mc.type}
                  </span>
                  <span className="text-xs text-[#68687b] font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#ea407f]" />
                    {mc.date}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#11112c] font-outfit">
                  {mc.title}
                </h3>

                <p className="text-xs text-[#68687b] leading-relaxed">
                  {mc.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#dfdfe4] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#232329] font-semibold">
                  <User className="w-4 h-4 text-[#ea407f]" />
                  <span>{mc.instructor}</span>
                </div>

                <button
                  onClick={() => onOpenFormModal('Comprar')}
                  className="bg-[#ea407f] hover:bg-[#e7256d] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Saber mais
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
