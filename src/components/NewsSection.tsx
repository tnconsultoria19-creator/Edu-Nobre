import React from 'react';
import { MOCK_NEWS } from '../data/mockData';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';

export const NewsSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#f5f5f5] border-b border-[#dfdfe4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[#ea407f] text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Actualizações & Artigos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#11112c] font-outfit">
            Notícias e Tendências na Educação
          </h2>
          <p className="text-sm text-[#68687b]">
            Fique a par das novidades do ecossistema educacional e de mercado em Angola.
          </p>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_NEWS.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl border border-[#dfdfe4] overflow-hidden shadow-custom hover:border-[#ea407f] transition-all flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#ea407f] text-white text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider shadow">
                  {article.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[10px] text-[#68687b]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#ea407f]" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#ea407f]" />
                      {article.author}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#11112c] font-outfit line-clamp-2 group-hover:text-[#ea407f] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#68687b] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#dfdfe4]/60">
                  <button className="text-xs font-bold text-[#ea407f] hover:text-[#e7256d] flex items-center gap-1 transition-colors cursor-pointer">
                    <span>Ler Artigo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
