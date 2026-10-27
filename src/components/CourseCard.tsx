import React from 'react';
import { CatalogItem } from '../types';
import { ShoppingBag, Zap, Heart, BookOpen } from 'lucide-react';

interface CourseCardProps {
  item: CatalogItem;
  onAddToCart: (item: CatalogItem) => void;
  onToggleWishlist?: (item: CatalogItem) => void;
  isWishlisted?: boolean;
  onQuickView?: (item: CatalogItem) => void;
  currency?: string;
  demoMode?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  item,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false,
  currency = 'AOA',
  demoMode = false,
}) => {
  // Format price display in AOA / Kwanzas (like Kubeta.ao)
  const isAOA = currency === 'AOA';
  const displayPrice = isAOA
    ? item.price === 0
      ? 'Grátis'
      : `${item.price.toLocaleString('pt-AO')} AOA`
    : `$${(item.price / 1000).toFixed(2)}`;

  const originalPrice = item.originalPrice
    ? isAOA
      ? `${item.originalPrice.toLocaleString('pt-AO')} AOA`
      : `$${(item.originalPrice / 1000).toFixed(2)}`
    : isAOA
    ? `${Math.round(item.price * 1.3).toLocaleString('pt-AO')} AOA`
    : `$${((item.price * 1.3) / 1000).toFixed(2)}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group overflow-hidden">
      {/* 1. Full-Bleed Edge-to-Edge Product Image (0px padding, no grey box, full width) */}
      <div 
        onClick={() => onQuickView && onQuickView(item)}
        className="relative w-full aspect-[16/9] overflow-hidden cursor-pointer shrink-0 bg-[#f3eee8]"
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block"
          referrerPolicy="no-referrer"
        />

        {onToggleWishlist && (
          <button type="button" aria-label={isWishlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} title={isWishlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} onClick={(event) => { event.stopPropagation(); onToggleWishlist(item); }} className="absolute top-3 right-3 z-10 rounded-full bg-white/95 p-2 text-[#574f49] shadow-sm transition-colors hover:text-[#be462a]">
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-[#be462a]' : ''}`} />
          </button>
        )}

        {/* Top-Left Badge (e.g. Hot) */}
        {item.badge && (
          <span className="absolute top-3 left-3 bg-[#e05822] text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow-xs z-10">
            {item.badge}
          </span>
        )}
      </div>

      {/* 2. Text Content & Actions */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="text-[9px] sm:text-[11px] font-semibold text-[#8c3a27] bg-[#f8eee8] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md tracking-wide">{item.category}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView && onQuickView(item)}
            className="text-sm sm:text-base font-semibold text-[#26211e] font-outfit line-clamp-2 leading-snug mb-2 group-hover:text-[#be462a] transition-colors cursor-pointer"
          >
            {item.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm sm:text-base font-bold text-[#8c3a27]">
              {displayPrice}
            </span>
            {item.price > 0 && (
              <span className="hidden sm:inline text-xs text-[#8c9ba5] line-through font-normal">
                {originalPrice}
              </span>
            )}
          </div>
        </div>

        <div>
          {onQuickView && (
            <button type="button" onClick={() => onQuickView(item)} className="w-full mb-2 py-1.5 sm:py-2 text-[11px] sm:text-sm font-semibold text-[#625a54] hover:text-[#8c3a27] border border-[#e6ded6] rounded-full transition-colors cursor-pointer">
              Ver detalhes
            </button>
          )}
          {/* 3. Direct Purchase Action Button */}
          {demoMode ? (
            <button type="button" onClick={() => onQuickView?.(item)} className="w-full bg-[#f4eee8] text-[#7b3524] text-[10px] sm:text-sm font-semibold py-2 sm:py-3 px-2 sm:px-4 rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>Ver pré-visualização</span>
            </button>
          ) : (
            <button onClick={() => onAddToCart(item)} className="w-full bg-[#f4eee8] hover:bg-[#be462a] hover:text-white active:bg-[#8c301a] text-[#7b3524] text-[11px] sm:text-sm font-semibold py-2 sm:py-2.5 px-2 sm:px-3 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-colors">
              {item.price === 0 ? <><Zap className="w-4 h-4 text-[#e05822] group-hover:text-white" /><span>Aceder Grátis</span></> : <><ShoppingBag className="w-4 h-4" /><span>Comprar Agora</span></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
