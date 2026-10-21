import React from 'react';
import { CatalogItem } from '../types';
import { ShoppingBag, Star, Zap } from 'lucide-react';

interface CourseCardProps {
  item: CatalogItem;
  onAddToCart: (item: CatalogItem) => void;
  onToggleWishlist?: (item: CatalogItem) => void;
  isWishlisted?: boolean;
  onQuickView?: (item: CatalogItem) => void;
  currency?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  item,
  onAddToCart,
  onQuickView,
  currency = 'AOA',
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
        className="relative w-full aspect-[16/10] sm:aspect-[4/3] overflow-hidden cursor-pointer shrink-0 bg-[#e2e8f0]"
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block"
          referrerPolicy="no-referrer"
        />

        {/* Top-Left Badge (e.g. Hot) */}
        {item.badge && (
          <span className="absolute top-3 left-3 bg-[#e05822] text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow-xs z-10">
            {item.badge}
          </span>
        )}
      </div>

      {/* 2. Text Content & Actions */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="text-[10px] font-bold text-[#185a7d] bg-[#d5e4ec] px-2 py-0.5 rounded-md uppercase tracking-wider">
              {item.contentType}
            </span>
            <span className="text-[10px] font-bold text-[#e05822] bg-[#fcece6] px-2 py-0.5 rounded-md uppercase tracking-wider">
              {item.category}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView && onQuickView(item)}
            className="text-base font-bold text-[#0c2340] font-outfit line-clamp-2 leading-snug mb-2 group-hover:text-[#be462a] transition-colors cursor-pointer"
          >
            {item.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-black text-[#e05822]">
              {displayPrice}
            </span>
            {item.price > 0 && (
              <span className="text-xs text-[#8c9ba5] line-through font-normal">
                {originalPrice}
              </span>
            )}
          </div>
        </div>

        <div>
          {/* Author & Star Rating Row */}
          <div className="flex items-center justify-between gap-2 mb-4 pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
              <span className="text-xs text-[#475569] font-medium truncate">
                (Author) {item.author.name}
              </span>
            </div>

            {/* Stars Rating */}
            <div className="flex items-center gap-0.5 text-[#ff7a00] shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(item.rating)
                      ? 'fill-current'
                      : i < item.rating
                      ? 'fill-current opacity-70'
                      : 'text-[#cbd5e1]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 3. Direct Purchase Action Button */}
          <button
            onClick={() => onAddToCart(item)}
            className="w-full bg-[#d5e4ec] hover:bg-[#185a7d] hover:text-white active:bg-[#12415b] text-[#185a7d] text-xs sm:text-sm font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
          >
            {item.price === 0 ? (
              <>
                <Zap className="w-4 h-4 text-[#e05822] group-hover:text-white" />
                <span>Aceder Grátis</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Comprar Agora</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
