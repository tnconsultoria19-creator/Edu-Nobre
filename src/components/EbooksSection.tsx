import React from 'react';
import { CatalogItem } from '../types';
import { CourseCard } from './CourseCard';
import { BookOpen, ArrowRight } from 'lucide-react';

interface EbooksSectionProps {
  items: CatalogItem[];
  onAddToCart: (item: CatalogItem) => void;
  onToggleWishlist: (item: CatalogItem) => void;
  wishlistIds: string[];
  onQuickView: (item: CatalogItem) => void;
  onViewAll: () => void;
}

export const EbooksSection: React.FC<EbooksSectionProps> = ({
  items,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  onViewAll,
}) => {
  const ebookItems = items.filter(
    (i) => i.contentType === 'E-books' || i.contentType === 'Arquivos'
  );

  return (
    <section id="ebooks" className="py-16 bg-white border-b border-[#dfdfe4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dfdfe4] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#ea407f] text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Leitura & Ferramentas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11112c] font-outfit">
              E-books & Ficheiros em Destaque
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs font-bold text-[#ea407f] hover:text-[#e7256d] flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Todos os E-books</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Ebooks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ebookItems.map((item) => (
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
      </div>
    </section>
  );
};
