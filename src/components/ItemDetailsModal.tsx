import React from 'react';
import { CatalogItem } from '../types';
import { X, Star, ShoppingBag, CheckCircle2 } from 'lucide-react';

interface ItemDetailsModalProps {
  item: CatalogItem | null;
  onClose: () => void;
  onAddToCart: (item: CatalogItem) => void;
  onOpenFormModal: (need?: string) => void;
  demoMode?: boolean;
  onOpenContent?: (item: CatalogItem) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  onClose,
  onAddToCart,
  onOpenFormModal,
  demoMode = false,
  onOpenContent,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#e2d5c8] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header Image */}
        <div className="relative h-56 bg-gray-100">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <span className="bg-[#be462a] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {item.category}
            </span>
            <h2 className="text-2xl font-black font-outfit leading-tight">
              {item.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Subtitle & Author */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2d5c8] pb-4">
            <div className="flex items-center gap-3">
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-10 h-10 rounded-full object-cover border border-[#be462a]"
              />
              <div>
                <div className="text-xs font-bold text-[#1a1a1a]">
                  {item.author.name}
                </div>
                <div className="text-[10px] text-[#858586]">{item.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#f59e0b] text-sm font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>{item.rating.toFixed(1)}</span>
              <span className="text-xs text-[#858586] font-normal">
                ({item.ratingCount || 100} avaliações)
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#1a1a1a]">Sobre esta formação</h3>
            <p className="text-xs text-[#858586] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Modules accordion if available */}
          {item.modules && item.modules.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-[#1a1a1a]">Conteúdo Curricular</h3>
              <div className="space-y-2">
                {item.modules.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#faf7f4] rounded-xl border border-[#e2d5c8] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#be462a]" />
                      <span className="font-semibold text-[#1a1a1a]">{m.title}</span>
                    </div>
                    <span className="text-[10px] text-[#858586] font-bold">
                      {m.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#faf7f4] border-t border-[#e2d5c8] flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#858586]">Preço Final</div>
            <div className="text-xl font-black text-[#be462a] font-outfit">
              {item.price === 0
                ? 'Grátis'
                : `${item.price.toLocaleString('pt-AO')} AOA`}
            </div>
          </div>

          {demoMode ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="rounded-full bg-[#efe1d6] px-3 py-2 text-[11px] font-semibold text-[#8c3a27]">Modo de teste</span>
              <button type="button" onClick={() => onOpenContent?.(item)} className="bg-[#185a7d] hover:bg-[#12415b] text-white text-xs font-bold px-4 py-3 rounded-full transition-all cursor-pointer flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Abrir conteúdo
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <button onClick={() => { onAddToCart(item); onClose(); }} className="bg-[#1a1a1a] hover:bg-[#2e2e2e] text-white text-xs font-bold px-4 sm:px-5 py-3 rounded-full transition-all cursor-pointer flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-[#f0a67d]" /><span>Adicionar ao Carrinho</span></button>
              <button onClick={() => { onClose(); onOpenFormModal('Comprar'); }} className="bg-[#be462a] hover:bg-[#a53b21] text-white text-xs font-bold px-4 sm:px-5 py-3 rounded-full transition-all shadow-md cursor-pointer">Adquirir via WhatsApp</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
