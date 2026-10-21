import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onOpenFormModal: (need?: string, details?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onOpenFormModal,
}) => {
  if (!isOpen) return null;

  const totalPrice = cartItems.reduce(
    (acc, curr) => acc + curr.item.price * curr.quantity,
    0
  );

  const handleCheckout = () => {
    const itemsSummary = cartItems
      .map(({ item, quantity }) => {
        const lineTotal = item.price * quantity;
        const unitPrice = item.price === 0 ? 'Grátis' : `${item.price.toLocaleString('pt-AO')} AOA`;
        const total = lineTotal === 0 ? 'Grátis' : `${lineTotal.toLocaleString('pt-AO')} AOA`;
        return `${quantity} × ${item.title} — ${unitPrice} por unidade; subtotal: ${total}`;
      })
      .join('\n');
    const totalLabel = totalPrice === 0 ? 'Grátis' : `${totalPrice.toLocaleString('pt-AO')} AOA`;
    const orderSummary = `Pedido de compra Edunombre\n\n${itemsSummary}\n\nTotal estimado: ${totalLabel}\n\nEste é um pedido de compra; o pagamento ainda não foi processado.`;
    onClose();
    onOpenFormModal('Comprar', orderSummary);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#e2d5c8] flex items-center justify-between bg-[#1a1a1a] text-white">
          <div className="flex items-center gap-2 font-black font-outfit text-base">
            <ShoppingBag className="w-5 h-5 text-[#f0a67d]" />
            <span>Seu Carrinho ({cartItems.reduce((sum, entry) => sum + entry.quantity, 0)})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#f7f3ee] text-[#858586] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-[#1a1a1a]">Carrinho Vazio</div>
              <p className="text-xs text-[#858586]">
                Nenhum curso ou e-book adicionado ainda. Explore o catálogo!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#faf7f4] rounded-2xl border border-[#e2d5c8] flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#1a1a1a] truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#be462a] font-bold">
                      {item.price === 0
                        ? 'Grátis'
                        : `${item.price.toLocaleString('pt-AO')} AOA`}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#e2d5c8] bg-[#faf7f4] space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-[#1a1a1a]">
              <span>Total:</span>
              <span className="text-[#be462a] font-black font-outfit text-base">
                {totalPrice === 0
                  ? 'Grátis'
                  : `${totalPrice.toLocaleString('pt-AO')} AOA`}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#746b65]">O pedido será enviado pelo WhatsApp para confirmação. O pagamento ainda não é processado nesta etapa.</p>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#be462a] hover:bg-[#a53b21] text-white text-sm font-semibold py-3.5 rounded-full transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Solicitar compra via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
