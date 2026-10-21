import React from 'react';
import { CatalogItem } from '../types';
import { CourseCard } from './CourseCard';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

interface ReaditTopSectionProps {
  items: CatalogItem[];
  onAddToCart: (item: CatalogItem) => void;
  onToggleWishlist: (item: CatalogItem) => void;
  wishlistIds: string[];
  onQuickView: (item: CatalogItem) => void;
  onOpenFormModal: () => void;
}

export const ReaditTopSection: React.FC<ReaditTopSectionProps> = ({
  items,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  onOpenFormModal,
}) => {
  return (
    <section className="py-16 bg-[#f5f5f5] border-b border-[#dfdfe4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Section Title & Hybrid Intro */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dfdfe4] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dfdfe4] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#ea407f] text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plataforma Híbrida</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11112c] font-outfit">
                O seu ponto de partida estratégico.
              </h2>
            </div>
            <button
              onClick={onOpenFormModal}
              className="bg-[#11112c] hover:bg-[#232329] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow"
            >
              <span>Aderir à Plataforma</span>
              <ArrowRight className="w-4 h-4 text-[#ea407f]" />
            </button>
          </div>

          <p className="text-sm text-[#68687b] leading-relaxed max-w-4xl font-normal">
            Não somos apenas um portal de cursos. Somos uma plataforma híbrida. Encontrou a especialização ideal? Avance na sua carreira. Domina uma área específica? A Edu nombre fornece-lhe a infraestrutura para monetizar o seu saber. Explore o nosso portfólio de conhecimento e dê o passo seguinte.
          </p>
        </div>

        {/* Content Layout with Side CTA Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main 4 Cards Grid */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {items.slice(0, 4).map((item) => (
              <CourseCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(item.id)}
                onQuickView={onQuickView}
              />
            ))}
          </div>

          {/* Right CTA Promo Card matching Boimela template banner */}
          <div className="lg:col-span-3 bg-gradient-to-br from-[#ea407f] to-[#e7256d] rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl relative overflow-hidden min-h-[380px]">
            {/* Background Decorative Graphic */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase">
                <Zap className="w-3.5 h-3.5" />
                <span>Bónus Exclusivo</span>
              </div>

              <h3 className="text-2xl font-extrabold font-outfit leading-tight">
                Alcance o Topo da Sua Carreira!
              </h3>

              <p className="text-xs text-white/90 leading-relaxed font-normal">
                Registe-se hoje na Edunombre e receba 25% de desconto no seu primeiro curso ou e-book premium.
              </p>
            </div>

            <div className="pt-6 relative z-10 space-y-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
                <div className="text-xs uppercase font-bold text-white/80">Código Promocional</div>
                <div className="text-lg font-black tracking-widest font-outfit text-white">EDUNOMBRE25</div>
              </div>

              <button
                onClick={onOpenFormModal}
                className="w-full bg-white text-[#ea407f] hover:bg-gray-100 text-xs font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Aproveitar Desconto</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
