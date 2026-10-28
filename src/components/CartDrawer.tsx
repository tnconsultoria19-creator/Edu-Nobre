import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, FileText, ShieldAlert } from 'lucide-react';
import { CartItem } from '../types';

type PaymentMethod = 'multicaixa_express' | 'reference';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onOpenFormModal: (need?: string, details?: string, paymentMethod?: PaymentMethod) => void | Promise<void>;
  busy?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onOpenFormModal,
  busy = false,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('multicaixa_express');
  if (!isOpen) return null;

  const totalPrice = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <header className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#0c2340] text-white">
          <div className="flex items-center gap-2 font-bold text-base">
            <ShoppingBag className="w-5 h-5" />
            <span>Carrinho ({cartItems.reduce((sum, entry) => sum + entry.quantity, 0)})</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar carrinho" className="p-2 rounded-full hover:bg-white/10 text-white"><X className="w-5 h-5" /></button>
        </header>

        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto"><ShoppingBag className="w-8 h-8" /></div>
              <div className="text-sm font-bold text-[#0c2340]">Carrinho vazio</div>
              <p className="text-xs text-slate-500">Adicione um curso ou material antes de continuar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map(({ item, quantity }) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#0c2340]">{item.title}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{quantity} × {item.price === 0 ? 'Grátis' : item.price.toLocaleString('pt-AO') + ' Kz'}</div>
                  </div>
                  <button type="button" onClick={() => onRemoveItem(item.id)} className="text-slate-400 hover:text-rose-600 p-2" title="Remover"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <footer className="p-5 border-t border-slate-200 bg-white space-y-4">
            <div className="flex items-center justify-between text-sm font-bold text-[#0c2340]">
              <span>Total</span>
              <span className="font-outfit text-xl">{totalPrice === 0 ? 'Grátis' : totalPrice.toLocaleString('pt-AO') + ' Kz'}</span>
            </div>

            {totalPrice > 0 && (
              <div className="space-y-2">
                <label htmlFor="checkout-payment-method" className="block text-xs font-semibold text-slate-700">Como prefere pagar?</label>
                <select id="checkout-payment-method" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-[#0c2340]">
                  <option value="multicaixa_express">Multicaixa Express (app / telefone)</option>
                  <option value="reference">Pagamento por referência</option>
                </select>
              </div>
            )}

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <p className="text-[11px] leading-relaxed text-amber-900">
                {totalPrice === 0
                  ? 'Os conteúdos gratuitos podem ser inscritos sem pagamento.'
                  : 'O gateway ainda precisa de credenciais de comerciante. Esta etapa gera uma pró-forma, mas não emite uma referência Multicaixa nem confirma pagamento.'}
              </p>
            </div>
            <button type="button" disabled={busy} onClick={() => void onOpenFormModal('Comprar', '', paymentMethod)} className="w-full bg-[#185a7d] hover:bg-[#12415b] disabled:opacity-60 text-white text-sm font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{busy ? 'A preparar documento…' : 'Gerar pró-forma'}</span>
              {!busy && <ArrowRight className="w-4 h-4" />}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};
