import React from 'react';
import { Mail, MapPin, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="bg-white border-t border-[#e6ded6] text-xs text-[#746b65]">
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold tracking-tight text-[#1a1a1a]">Edunombre<span className="text-[#be462a]">.</span></span>
        <span className="hidden sm:inline text-[#d6cec5]">|</span>
        <span>Aprendizagem online</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <a href="mailto:contacto@edunombre.com" className="inline-flex items-center gap-1.5 hover:text-[#be462a]"><Mail className="w-3.5 h-3.5" /> contacto@edunombre.com</a>
        <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Luanda, Angola</span>
        <span>© {new Date().getFullYear()} Edunombre</span>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Voltar ao topo" className="w-10 h-10 rounded-full border border-[#e6ded6] flex items-center justify-center text-[#1a1a1a] hover:bg-[#f7f3ee]"><ArrowUp className="w-4 h-4" /></button>
      </div>
    </div>
  </footer>
);
