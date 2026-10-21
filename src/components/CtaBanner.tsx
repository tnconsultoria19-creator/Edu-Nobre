import React from 'react';
import { ArrowRight, Sparkles, Award } from 'lucide-react';

interface CtaBannerProps {
  onOpenFormModal: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenFormModal }) => {
  return (
    <section className="py-12 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#11112c] via-[#232329] to-[#ea407f] text-white p-8 sm:p-12 shadow-2xl border border-[#3f3f4a]">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ea407f]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#ea407f] text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Espaço Publicitário & Oportunidades</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-outfit leading-tight">
              Anuncie aqui a sua marca ou formação.
            </h2>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
              Alcance mais de 10.000 formandos e profissionais ativos em Angola. Promova o seu curso, empresa ou serviço com a infraestrutura oficial da Edunombre.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenFormModal}
                className="bg-[#ea407f] hover:bg-[#e7256d] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-full transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Anunciar ou Colaborar</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                <Award className="w-4 h-4 text-[#ea407f]" />
                <span>Atendimento Personalizado via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
