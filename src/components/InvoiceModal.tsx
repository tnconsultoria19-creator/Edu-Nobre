import React from 'react';
import { Download, FileText, Printer, X, CircleCheck, Clock3 } from 'lucide-react';
import { CartItem } from '../types';
import { OrderCreateResult } from '../lib/api';

interface InvoiceModalProps {
  order: OrderCreateResult | null;
  items: CartItem[];
  onClose: () => void;
}

const money = (amount: number) => amount === 0 ? '0 Kz' : amount.toLocaleString('pt-AO') + ' Kz';

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, items, onClose }) => {
  if (!order) return null;
  const isPaid = order.status === 'paid';
  const issueDate = new Date().toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' });
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-3 sm:p-6">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #edunobre-invoice, #edunobre-invoice * { visibility: visible !important; }
          #edunobre-invoice { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; max-width: none !important; max-height: none !important; overflow: visible !important; border: 0 !important; box-shadow: none !important; }
          .invoice-no-print { display: none !important; }
          @page { size: A4; margin: 15mm; }
        }
      `}</style>
      <section id="edunobre-invoice" role="dialog" aria-modal="true" aria-labelledby="invoice-title" className="w-full max-w-3xl max-h-[94vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="invoice-no-print flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#185a7d]"><FileText className="h-5 w-5" /></div>
            <div>
              <h2 id="invoice-title" className="text-lg font-bold text-[#0c2340]">{isPaid ? 'Recibo de inscrição' : 'Pró-forma'}</h2>
              <p className="text-xs text-slate-500">Edunombre · Documento de pedido</p>
            </div>
          </div>
          <button type="button" aria-label="Fechar" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </header>

        <div className="p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 sm:flex-row">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#185a7d]">EDUNOMBRE</p>
              <h3 className="mt-2 text-2xl font-bold text-[#0c2340]">{isPaid ? 'Comprovativo de inscrição' : 'Pró-forma de compra'}</h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">Documento para acompanhar o pedido. Os valores são apresentados em Kwanzas (Kz).</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-500">Número do documento</p>
              <p className="mt-1 font-mono text-lg font-bold text-[#0c2340]">{order.invoiceNumber}</p>
              <p className="mt-2 text-xs text-slate-500">Emitido em {issueDate}</p>
            </div>
          </div>

          <div className="my-6 rounded-xl border p-4 ${isPaid ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}">
            <div className="flex items-start gap-3">
              {isPaid ? <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /> : <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />}
              <div>
                <p className={isPaid ? 'text-sm font-bold text-emerald-900' : 'text-sm font-bold text-amber-900'}>{isPaid ? 'Inscrição confirmada' : 'A aguardar pagamento'}</p>
                <p className={isPaid ? 'mt-1 text-xs leading-relaxed text-emerald-800' : 'mt-1 text-xs leading-relaxed text-amber-900'}>
                  {isPaid
                    ? 'O total é zero. A inscrição gratuita foi confirmada e o conteúdo deverá estar disponível na sua área de aprendizagem.'
                    : 'Este documento não é um comprovativo de pagamento. A ligação ao gateway de pagamentos ainda não está configurada, pelo que não foi emitida qualquer referência Multicaixa, pedido MCX Express ou código QR. Não pague utilizando números ou códigos fora do seu banco/provedor autorizado.'}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-3 pr-3 font-semibold">Descrição</th>
                  <th className="py-3 px-3 text-right font-semibold">Qtd.</th>
                  <th className="py-3 px-3 text-right font-semibold">Preço unitário</th>
                  <th className="py-3 pl-3 text-right font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map(({ item, quantity }) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-4 pr-3">
                      <p className="font-semibold text-[#0c2340]">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.contentType} · {item.category}</p>
                    </td>
                    <td className="px-3 py-4 text-right text-slate-600">{quantity}</td>
                    <td className="px-3 py-4 text-right text-slate-600">{money(item.price)}</td>
                    <td className="py-4 pl-3 text-right font-semibold text-[#0c2340]">{money(item.price * quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex justify-end">
            <div className="w-full max-w-sm space-y-2 rounded-xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{money(order.totalAmountAOA)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-[#0c2340]"><span>Total</span><span>{money(order.totalAmountAOA)}</span></div>
              <p className="text-right text-[11px] text-slate-500">Método seleccionado: {order.paymentMethod === 'free' ? 'Gratuito' : order.paymentMethod === 'reference' ? 'Pagamento por referência (a configurar)' : 'Multicaixa Express (a configurar)'}</p>
            </div>
          </div>

          <footer className="mt-8 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500">
            Este documento foi gerado automaticamente pela plataforma. Para pedidos pagos, a inscrição só será activada após confirmação do pagamento pelo provedor integrado ou por um administrador autorizado que confirme a recepção real dos fundos.
          </footer>
        </div>

        <div className="invoice-no-print flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Fechar</button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#185a7d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#12415b]"><Printer className="h-4 w-4" /> Imprimir / Guardar PDF <Download className="h-4 w-4" /></button>
        </div>
      </section>
    </div>
  );
};
