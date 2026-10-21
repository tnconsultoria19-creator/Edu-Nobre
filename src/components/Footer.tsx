import React from 'react';
import { Phone, Mail, MapPin, ArrowUp, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#e2d5c8] pt-14 pb-8 text-[#858586] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Contacts */}
          <div className="space-y-4">
            <div className="flex items-baseline">
              <span className="text-2xl font-black text-[#1a1a1a] font-outfit">
                Edunombre
              </span>
              <span className="text-[#be462a] text-2xl font-black ml-0.5">.</span>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-[#1a1a1a]">
                Tem dúvidas? Ligue para nós
              </div>
              <a
                href="tel:+244900000000"
                className="text-lg font-black text-[#be462a] font-outfit block hover:underline"
              >
                +244 900 000 000
              </a>
            </div>

            <div className="space-y-1.5 pt-2 text-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#be462a]" />
                <span>contacto@edunombre.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#be462a] shrink-0 mt-0.5" />
                <span>Luanda, Angola (Atendimento Presencial e Online)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Customers Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#1a1a1a] font-outfit">
              Apoio ao Cliente
            </h3>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-[#be462a] transition-colors">Como Comprar Cursos</a></li>
              <li><a href="#" className="hover:text-[#be462a] transition-colors">Termos do Formador</a></li>
              <li><a href="#" className="hover:text-[#be462a] transition-colors">Programa de Afiliados</a></li>
              <li><a href="#" className="hover:text-[#be462a] transition-colors">Política de Reembolso</a></li>
              <li><a href="#" className="hover:text-[#be462a] transition-colors">Perguntas Frequentes (FAQ)</a></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#1a1a1a] font-outfit">
              Categorias Populares
            </h3>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-[#be462a] transition-colors">Comunicação e Oratória</a></li>
              <li><a href="#" className="hover:text-[#be462a] transition-colors">Marketing e Vendas</a></li>
              <li><a href="#" className="hover:text-[#be462a] transition-colors">Finanças Pessoais</a></li>
              <li><a href="#" className="hover:text-[#be462a] transition-colors">Kandengues Tech</a></li>
              <li><a href="#" className="hover:text-[#be462a] transition-colors">Direito e Minutas</a></li>
            </ul>
          </div>

          {/* Col 4: Subscribe Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#1a1a1a] font-outfit">
              Subscrever a Newsletter
            </h3>
            <p className="text-xs text-[#858586]">
              Receba ofertas exclusivas de e-books, novos cursos e novidades no seu e-mail.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
              <input
                type="email"
                placeholder="Introduza o seu e-mail"
                className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-l-xl py-2 px-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#be462a] placeholder:text-[#858586]"
              />
              <button
                type="submit"
                className="bg-[#be462a] hover:bg-[#a53b21] text-white text-xs font-bold px-4 py-2 rounded-r-xl transition-colors cursor-pointer"
              >
                Subscrever
              </button>
            </form>

            <div className="pt-2">
              <div className="text-[11px] font-bold text-[#1a1a1a] mb-2">Siga-nos</div>
              <div className="flex items-center gap-2">
                {[Facebook, Twitter, Linkedin, Youtube].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-8 h-8 rounded-full bg-[#efe1d6] hover:bg-[#be462a] hover:text-white flex items-center justify-center transition-colors cursor-pointer text-[#1a1a1a]"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-[#e2d5c8] flex flex-wrap items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} Todos os Direitos Reservados. <span className="font-bold text-[#1a1a1a]">Edunombre Angola</span>.
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-bold text-[#858586]">Pagamentos Seguros:</span>
            <div className="flex items-center gap-2">
              <span className="bg-[#1a1a1a] text-white text-[10px] font-black px-2.5 py-1 rounded-md">Multicaixa</span>
              <span className="bg-[#1a1a1a] text-white text-[10px] font-black px-2.5 py-1 rounded-md">Express</span>
              <span className="bg-[#1a1a1a] text-white text-[10px] font-black px-2.5 py-1 rounded-md">IBAN</span>
              <span className="bg-[#1a1a1a] text-white text-[10px] font-black px-2.5 py-1 rounded-md">VISA</span>
            </div>
          </div>

          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full bg-[#be462a] text-white flex items-center justify-center shadow hover:bg-[#a53b21] transition-colors cursor-pointer"
            title="Voltar ao Topo"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
