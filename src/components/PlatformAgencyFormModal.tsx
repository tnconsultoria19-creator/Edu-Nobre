import React, { useEffect, useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { ContactFormData } from '../types';

interface PlatformAgencyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultNeed?: string;
  defaultDetails?: string;
}

export const PlatformAgencyFormModal: React.FC<PlatformAgencyFormModalProps> = ({
  isOpen,
  onClose,
  defaultNeed = 'Comprar',
  defaultDetails = '',
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    need: (defaultNeed as ContactFormData['need']) || 'Comprar',
    provinceCountry: 'Luanda, Angola',
    fieldOfStudy: '',
    details: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const allowedNeeds: ContactFormData['need'][] = ['Comprar', 'Ser Formador', 'Afiliado', 'Corp.'];
    const need = allowedNeeds.includes(defaultNeed as ContactFormData['need'])
      ? defaultNeed as ContactFormData['need']
      : 'Comprar';
    setFormData((current) => ({ ...current, need, details: defaultDetails }));
    setSubmitted(false);
  }, [isOpen, defaultNeed, defaultDetails]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Prepare WhatsApp link
    const text = `*Novo Contacto Edunombre*%0A%0A*Nome:* ${encodeURIComponent(formData.fullName)}%0A*Necessidade:* ${encodeURIComponent(formData.need)}%0A*Localização:* ${encodeURIComponent(formData.provinceCountry)}%0A*Área:* ${encodeURIComponent(formData.fieldOfStudy)}%0A*Detalhes:* ${encodeURIComponent(formData.details)}`;
    const whatsappUrl = `https://wa.me/?text=${text}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#e2d5c8] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#1a1a1a] text-white p-6 flex items-center justify-between border-b border-[#333333]">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#f0a67d] font-extrabold">
              Plataforma & Agência
            </div>
            <h2 className="text-xl font-black font-outfit">O que precisa hoje?</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[#1a1a1a]">Pedido Enviado com Sucesso!</h3>
              <p className="text-xs text-[#858586] max-w-md mx-auto">
                O seu pedido foi preparado no WhatsApp. Confirme o envio na aplicação para concluir.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-[#be462a] text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer shadow"
              >
                Concluir
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1a1a1a] mb-1">
                  Nome Completo / Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Ex: João Baptista ou Empresa LDA"
                  className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl p-3 text-xs text-[#1a1a1a] focus:border-[#be462a] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1a1a1a] mb-1">
                    Qual é a sua necessidade? *
                  </label>
                  <select
                    value={formData.need}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        need: e.target.value as ContactFormData['need'],
                      })
                    }
                    className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl p-3 text-xs text-[#1a1a1a] focus:border-[#be462a] focus:outline-none cursor-pointer"
                  >
                    <option value="Comprar">Comprar Cursos / E-books</option>
                    <option value="Ser Formador">Ser Formador na Edunombre</option>
                    <option value="Afiliado">Programa de Afiliados</option>
                    <option value="Corp.">Solução Corporativa / Empresas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1a1a1a] mb-1">
                    Província / País *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.provinceCountry}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        provinceCountry: e.target.value,
                      })
                    }
                    placeholder="Ex: Luanda, Benguela, Cabinda..."
                    className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl p-3 text-xs text-[#1a1a1a] focus:border-[#be462a] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1a1a1a] mb-1">
                  Área de Formação ou Interesse *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fieldOfStudy}
                  onChange={(e) =>
                    setFormData({ ...formData, fieldOfStudy: e.target.value })
                  }
                  placeholder="Ex: Oratória, Marketing, Direito, Finanças..."
                  className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl p-3 text-xs text-[#1a1a1a] focus:border-[#be462a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1a1a1a] mb-1">
                  Detalhes do Pedido / Questão
                </label>
                <textarea
                  rows={3}
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  placeholder="Descreva brevemente o que pretende alcançar ou a sua proposta..."
                  className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl p-3 text-xs text-[#1a1a1a] focus:border-[#be462a] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="bg-[#be462a] hover:bg-[#a53b21] text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Pedido (WhatsApp)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
