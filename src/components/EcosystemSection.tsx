import React from 'react';
import { UserCheck, Share2, ArrowRight, ShieldCheck } from 'lucide-react';

interface EcosystemSectionProps {
  onOpenFormModal: (defaultRole?: string) => void;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({ onOpenFormModal }) => {
  return (
    <section id="aderir" className="py-16 bg-[#f5f5f5] border-b border-[#dfdfe4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#FFEFEF] text-[#ea407f] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border border-[#ea407f]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Faça Parte do Ecossistema</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#11112c] font-outfit">
            Colabore com a Edu nombre
          </h2>
          <p className="text-sm text-[#68687b] leading-relaxed">
            Junte-se à nossa missão de democratizar a educação em África. Seja um formador ou partilhe cursos através do nosso programa de afiliados.
          </p>
        </div>

        {/* 2 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formadores Card */}
          <div className="bg-white rounded-3xl p-8 border border-[#dfdfe4] shadow-custom space-y-6 hover:border-[#ea407f] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFEFEF] border border-[#ea407f]/30 flex items-center justify-center text-[#ea407f]">
                <UserCheck className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-[#11112c] font-outfit">
                Para Formadores
              </h3>

              <p className="text-sm text-[#68687b] leading-relaxed">
                Crie a sua masterclass ou curso, defina o seu preço e alcance milhares de alunos em todo o país. Nós tratamos da infraestrutura técnica, hospedagem de vídeo e processamento de pagamentos.
              </p>
            </div>

            <button
              onClick={() => onOpenFormModal('Ser Formador')}
              className="w-full bg-[#ea407f] hover:bg-[#e7256d] text-white text-xs font-extrabold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Tornar-se Formador</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Afiliados Card */}
          <div className="bg-white rounded-3xl p-8 border border-[#dfdfe4] shadow-custom space-y-6 hover:border-[#11112c] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#f3f4f7] border border-[#dfdfe4] flex items-center justify-center text-[#11112c]">
                <Share2 className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-[#11112c] font-outfit">
                Para Afiliados
              </h3>

              <p className="text-sm text-[#68687b] leading-relaxed">
                Recomende produtos premium do nosso catálogo à sua audiência e ganhe comissões atrativas por cada venda realizada através do seu link exclusivo.
              </p>
            </div>

            <button
              onClick={() => onOpenFormModal('Afiliado')}
              className="w-full bg-[#11112c] hover:bg-[#232329] text-white text-xs font-extrabold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Explorar Programa de Afiliados</span>
              <ArrowRight className="w-4 h-4 text-[#ea407f]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
