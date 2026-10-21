import React from 'react';
import { RefreshCw, ShieldCheck, Headphones, Tag } from 'lucide-react';

export const FeatureBar: React.FC = () => {
  const features = [
    {
      icon: <RefreshCw className="w-6 h-6 text-[#ea407f]" />,
      title: 'Garantia de Qualidade',
      desc: 'Reembolso e satisfação',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#ea407f]" />,
      title: 'Pagamento Seguro',
      desc: 'Multicaixa Express e IBAN',
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#ea407f]" />,
      title: 'Apoio Dedicado',
      desc: 'Suporte online permanente',
    },
    {
      icon: <Tag className="w-6 h-6 text-[#ea407f]" />,
      title: 'Ofertas Diárias',
      desc: 'Descontos no catálogo',
    },
  ];

  return (
    <section className="py-8 bg-white border-b border-[#dfdfe4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8f9fa] border border-[#e9ecef] hover:border-[#ea407f]/40 hover:bg-[#FFEFEF]/50 transition-all shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#dfdfe4] flex items-center justify-center shrink-0 shadow-xs">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#11112c] font-outfit">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#68687b]">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
