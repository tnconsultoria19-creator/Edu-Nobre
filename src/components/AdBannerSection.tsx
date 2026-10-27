import React, { useState } from 'react';
import { Sparkles, ArrowRight, ExternalLink, ShieldCheck, Tag } from 'lucide-react';

interface AdBannerProps {
  onAdClick?: () => void;
}

export const AdBannerSection: React.FC<AdBannerProps> = ({ onAdClick }) => {
  const [adIndex, setAdIndex] = useState(0);

  const ads = [
    {
      id: '1',
      tag: 'Parceria Exclusiva',
      sponsor: 'Banco BIC & TN Consultoria',
      title: 'Soluções de Financiamento & Gestão para Empreendedores Angolanos',
      description: 'Abra a sua conta corporativa com isenção de comissões nos primeiros 6 meses e acesso a linhas de microcrédito.',
      cta: 'Saber Mais',
      ctaUrl: '#aderir',
      bgGradient: 'from-[#0c2340] via-[#123659] to-[#185a7d]',
      badgeColor: 'bg-[#e05822] text-white',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '2',
      tag: 'Destaque Patrocinado',
      sponsor: 'Software Primavera / PHC',
      title: 'Modernize a Contabilidade e Faturação da sua Empresa',
      description: 'Implementação certificada pela TN Consultoria com 20% de desconto em licenças e formação inicial gratuita.',
      cta: 'Ver Oferta',
      ctaUrl: '#aderir',
      bgGradient: 'from-[#185a7d] via-[#1c4d6f] to-[#0c2340]',
      badgeColor: 'bg-[#2563eb] text-white',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    }
  ];

  const currentAd = ads[adIndex];

  return (
    <>
      <div className="md:hidden px-4 py-2"><div className="rounded-md border border-[#e6ded6] bg-[#f4eee8] text-center py-2 text-[10px] font-extrabold tracking-[0.2em] text-[#8c3a27]">PUBLICIDADE</div></div>
      <section className="hidden md:block py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Compact, Highly Refined Ad Card */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentAd.bgGradient} text-white shadow-md transition-all duration-500 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6`}>
          
          {/* Subtle Ambient Graphic */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#e05822]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left / Main Copy Area */}
          <div className="relative z-10 flex-1 space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${currentAd.badgeColor} flex items-center gap-1`}>
                <Tag className="w-3 h-3" />
                {currentAd.tag}
              </span>
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Patrocinado por <strong className="text-white font-semibold">{currentAd.sponsor}</strong>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-outfit text-white tracking-tight leading-snug">
              {currentAd.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200/90 max-w-2xl leading-relaxed">
              {currentAd.description}
            </p>
          </div>

          {/* Right Action / CTA & Switcher Area */}
          <div className="relative z-10 flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0">
            <a
              href={currentAd.ctaUrl}
              onClick={() => onAdClick && onAdClick()}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0c2340] hover:bg-[#e05822] hover:text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-sm transition-all duration-300 transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>{currentAd.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Minor Dot Switcher */}
            <div className="flex items-center gap-1.5 mt-1">
              {ads.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAdIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    adIndex === i ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Publicidade ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  );
};
