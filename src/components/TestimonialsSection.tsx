import React from 'react';
import { MOCK_REVIEWS } from '../data/mockData';
import { Star, MessageSquare } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-[#dfdfe4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[#ea407f] text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Depoimentos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#11112c] font-outfit">
            O Que Dizem os Nossos Formandos
          </h2>
          <p className="text-sm text-[#68687b]">
            Histórias reais de profissionais e alunos que aceleraram a sua carreira com a Edunombre.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#f8f9fa] rounded-2xl p-6 border border-[#dfdfe4] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#ea407f] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#FC0]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-[#232329] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#dfdfe4] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#ea407f]"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-[#11112c] font-outfit">
                      {rev.name}
                    </h3>
                    <p className="text-[10px] text-[#68687b]">{rev.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
