import React, { useState } from 'react';
import { X, PlayCircle, BookOpen, Download, CheckCircle, FileText, Lock, Star, ChevronRight, Award } from 'lucide-react';
import { CatalogItem } from '../types';

interface UserLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedItems: CatalogItem[];
}

export const UserLibraryModal: React.FC<UserLibraryModalProps> = ({
  isOpen,
  onClose,
  purchasedItems,
}) => {
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Top Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#185a7d] flex items-center justify-center text-white">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold font-outfit text-white">
                Os Meus Conteúdos Adquiridos
              </h2>
              <p className="text-xs text-slate-300">
                Aceda aos seus cursos, livros e documentos desbloqueados para estudo.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-6">
          {purchasedItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto my-8">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-[#0c2340]">Ainda não tem conteúdos adquiridos</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explore o catálogo principal para comprar ou descarregar cursos, e-books e minutas jurídicas.
              </p>
              <button
                onClick={onClose}
                className="bg-[#185a7d] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm cursor-pointer"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: List of purchased items */}
              <div className="md:col-span-1 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Biblioteca ({purchasedItems.length})
                </h3>

                <div className="space-y-2">
                  {purchasedItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setActiveLessonIndex(0);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        selectedItem?.id === item.id
                          ? 'bg-white border-[#185a7d] shadow-md ring-2 ring-[#185a7d]/20'
                          : 'bg-white/80 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100" />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-[#0c2340] line-clamp-1">{item.title}</h4>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle className="w-3 h-3" /> Acesso Vitalício
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Player / Viewer for Selected Item */}
              <div className="md:col-span-2">
                {selectedItem ? (
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
                    
                    {/* Item Header */}
                    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                          {selectedItem.contentType}
                        </span>
                        <h3 className="text-base font-bold text-[#0c2340] mt-1">{selectedItem.title}</h3>
                        <p className="text-xs text-slate-500">Por {selectedItem.author.name}</p>
                      </div>

                      <button
                        onClick={() => {
                          const element = document.createElement("a");
                          const file = new Blob([`Conteúdo Exclusivo TN Consultoria:\n${selectedItem.title}\n\n${selectedItem.description}`], {type: 'text/plain'});
                          element.href = URL.createObjectURL(file);
                          element.download = `${selectedItem.title}.txt`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        className="bg-[#185a7d] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" /> Baixar Anexos
                      </button>
                    </div>

                    {/* Media Player Screen Simulation */}
                    <div className="bg-slate-900 rounded-2xl aspect-video w-full flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner p-6 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                        <PlayCircle className="w-10 h-10 text-white fill-white/20" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">AULA {activeLessonIndex + 1}: Introdução & Módulo Prático</h4>
                        <p className="text-xs text-slate-300 mt-1 max-w-md">
                          {selectedItem.description}
                        </p>
                      </div>
                    </div>

                    {/* Course Modules List */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Aulas & Módulos do Curso
                      </h4>
                      <div className="space-y-1.5">
                        {[
                          'Módulo 1: Fundamentos Enquadramento Legal e Fiscal',
                          'Módulo 2: Casos Práticos de Aplicação e Estruturação',
                          'Módulo 3: Modelos e Exercícios de Avaliação',
                          'Módulo 4: Encerramento e Emissão de Certificado Digital'
                        ].map((m, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveLessonIndex(idx)}
                            className={`p-3 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                              activeLessonIndex === idx
                                ? 'bg-[#185a7d]/10 text-[#185a7d] font-bold border border-[#185a7d]/30'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <PlayCircle className="w-4 h-4 text-[#185a7d]" />
                              <span>{m}</span>
                            </div>
                            <span className="text-[11px] text-slate-400">15 min</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-xs text-slate-400">
                    Selecione um item da lista à esquerda para começar a assistir ou ler.
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
