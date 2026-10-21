import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  FileSpreadsheet, 
  FileCheck, 
  FileCode, 
  Star, 
  Sparkles, 
  X, 
  ArrowRight,
  BookOpen,
  Share2,
  HardDrive
} from 'lucide-react';

export interface DownloadItem {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: 'PDF' | 'XLSX' | 'DOCX' | 'PPTX';
  fileSize: string;
  downloadsCount: number;
  rating: number;
  author: string;
  publishedDate: string;
  isFree: boolean;
  coverImage: string;
  previewPages: string[];
  tableOfContents?: string[];
  summary: string;
}

export const DownloadsSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<DownloadItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Todos');

  const downloads: DownloadItem[] = [
    {
      id: 'd1',
      title: 'Minuta Padrão de Contrato Individual de Trabalho (Angola)',
      description: 'Modelo jurídico pronto a usar de acordo com a Lei Geral do Trabalho de Angola nº 12/23. Inclui cláusulas de confidencialidade e período experimental.',
      category: 'Modelos Jurídicos',
      fileType: 'DOCX',
      fileSize: '1.4 MB',
      downloadsCount: 1420,
      rating: 4.9,
      author: 'Dra. Sarah Fontenot & TN Jurídico',
      publishedDate: 'Março 2024',
      isFree: true,
      coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
      previewPages: [
        'CONTRATO DE TRABALHO POR TEMPO INDETERMINADO\n\nEntre:\n1. EMPREGADOR: Sociedade Comercial...\n2. TRABALHADOR: Sr(a)...\n\nCLÁUSULA 1ª (Objecto e Categoria Profissional)\nO Trabalhador é admitido ao serviço da Empregadora para exercer as funções...',
        'CLÁUSULA 2ª (Local e Horário de Trabalho)\n1. A prestação de trabalho decorrerá nas instalações de Luanda...\n2. O horário normal de trabalho é de 40 horas semanais...',
        'CLÁUSULA 3ª (Retribuição)\n1. O Trabalhador auferirá o salário base mensal de...',
      ],
      tableOfContents: [
        '1. Qualificação das Partes',
        '2. Cláusulas Obrigatórias e Remuneração',
        '3. Cláusula de Confidencialidade e Não-Concorrência',
        '4. Regime de Férias e Subsídios',
        '5. Rescisão e Foro Competente'
      ],
      summary: 'Instrumento essencial para departamentos de RH e gestores de empresas em Angola garantirem conformidade imediata com a nova legislação laboral.',
    },
    {
      id: 'd2',
      title: 'Planilha Completa de Projeção Financeira & Fluxo de Caixa 2024/2025',
      description: 'Folha de cálculo automatizada no Excel com DRE, Balanço Projetado, Ponto de Equilíbrio, Indicadores de Rentabilidade (VAL, TIR) e gráficos dinâmicos.',
      category: 'Gestão Financeira',
      fileType: 'XLSX',
      fileSize: '3.8 MB',
      downloadsCount: 2840,
      rating: 5.0,
      author: 'Prof. Joan Martinez',
      publishedDate: 'Fevereiro 2024',
      isFree: true,
      coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      previewPages: [
        'PAINEL EXECUTIVO:\n- Faturação Anual Prevista: 45.000.000 Kz\n- Margem EBITDA: 28.4%\n- Ponto de Equilíbrio (Break-even): Mês 4\n- Payback Descontado: 1.8 Anos',
        'FOLHA 1: Pressupostos de Vendas & Preços Médios\nFOLHA 2: Custos Fixos, Variáveis e Imposto Industrial\nFOLHA 3: Demonstração de Resultados (DRE)',
      ],
      tableOfContents: [
        '1. Dashboard de Indicadores Principais',
        '2. Mapeamento de Receitas e Custos',
        '3. Demonstração de Fluxo de Caixa Direto',
        '4. Análise de Cenários (Otimista, Base, Pessimista)',
        '5. Relatório Pronto para Apresentação a Bancos e Investidores'
      ],
      summary: 'Criada para startups, PMEs e consultores apresentarem planos financeiros estruturados com rigor internacional.',
    },
    {
      id: 'd3',
      title: 'Guia Prático do Imposto sobre o Valor Acrescentado (IVA) em Angola',
      description: 'Manual passo-a-passo sobre regras de dedutibilidade, mapa de fornecedores, regimes de enquadramento da AGT e calendarização de obrigações fiscais.',
      category: 'Fiscalidade & Contabilidade',
      fileType: 'PDF',
      fileSize: '4.2 MB',
      downloadsCount: 3190,
      rating: 4.8,
      author: 'Erika Walker (Especialista Tributária)',
      publishedDate: 'Janeiro 2024',
      isFree: true,
      coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      previewPages: [
        'MANUAL DO IVA ANGOLANO - EDIÇÃO ATUALIZADA\n\nCapítulo 1: Incidência Objetiva e Subjetiva\nO IVA incide sobre as transmissões de bens e prestações de serviços efetuadas no território nacional a título oneroso...',
        'Capítulo 2: Regimes de Enquadramento\n- Regime Geral\n- Regime Simplificado\n- Regime de Exclusão...',
      ],
      tableOfContents: [
        '1. Princípios Gerais e Legislação Aplicável',
        '2. Operações Isentas com e sem Direito à Dedução',
        '3. Obrigações Declarativas e Submissão no Portal AGT',
        '4. Erros Frequentes e Como Evitar Coimas'
      ],
      summary: 'Referência rápida para contabilistas, gestores e estudantes dominarem o imposto mais dinâmico do sistema tributário angolano.',
    },
    {
      id: 'd4',
      title: 'Template de Pitch Deck de Alto Impacto para Captação de Investimento',
      description: 'Apresentação profissional com 15 slides estruturados (Problema, Solução, Mercado, Modelo de Negócio, Tração, Equipa e Pedido de Financiamento).',
      category: 'Empreendedorismo',
      fileType: 'PPTX',
      fileSize: '8.1 MB',
      downloadsCount: 1950,
      rating: 4.9,
      author: 'TN Consultoria Estratégica',
      publishedDate: 'Abril 2024',
      isFree: true,
      coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
      previewPages: [
        'SLIDE 1: Capa & Proposta Única de Valor\nSLIDE 2: O Problema Real do Mercado em África\nSLIDE 3: A Nossa Solução & Vantagem Competitiva\nSLIDE 4: Tamanho do Mercado (TAM, SAM, SOM)...',
      ],
      tableOfContents: [
        'Slide 1-3: Introdução e Oportunidade',
        'Slide 4-7: Produto, Tecnologia e Validação',
        'Slide 8-11: Modelo de Receitas e Estratégia Go-To-Market',
        'Slide 12-15: Finanças, Equipa e Contactos'
      ],
      summary: 'Utilizado por empreendedores de sucesso para apresentar ideias perante fundos de capital de risco e programas de aceleração.',
    },
  ];

  const categories = ['Todos', 'Modelos Jurídicos', 'Gestão Financeira', 'Fiscalidade & Contabilidade', 'Empreendedorismo'];

  const filteredDownloads = filterCategory === 'Todos'
    ? downloads
    : downloads.filter(d => d.category === filterCategory);

  const handleDownload = (item: DownloadItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(item.id);
    
    // Simulate instant secure file packaging and trigger download
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccess(item.id);
      
      // Create a dummy download file simulation
      const element = document.createElement("a");
      const file = new Blob([
        `Documento Oficial TN Consultoria:\n${item.title}\n\nAutor: ${item.author}\nData: ${item.publishedDate}\n\nResumo:\n${item.summary}\n\nObrigado por utilizar os recursos da TN Consultoria.`
      ], {type: 'text/plain;charset=utf-8'});
      element.href = URL.createObjectURL(file);
      element.download = `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.${item.fileType.toLowerCase()}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setTimeout(() => {
        setDownloadSuccess(null);
      }, 4000);
    }, 1000);
  };

  const getFormatBadge = (type: DownloadItem['fileType']) => {
    switch(type) {
      case 'PDF':
        return <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>;
      case 'XLSX':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1"><FileSpreadsheet className="w-3 h-3" /> EXCEL</span>;
      case 'DOCX':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1"><FileCheck className="w-3 h-3" /> WORD</span>;
      case 'PPTX':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1"><FileCode className="w-3 h-3" /> POWERPOINT</span>;
    }
  };

  return (
    <section id="downloads" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Elegant Section Header with Visual Divider */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#185a7d]/10 text-[#185a7d] text-xs font-bold uppercase tracking-wider">
            <Download className="w-3.5 h-3.5" />
            Recursos & Minutas Prontas
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0c2340] font-outfit tracking-tight">
            Central de Downloads & Documentos
          </h2>
          
          <p className="text-xs sm:text-sm text-[#5e6d77] leading-relaxed">
            Aceda a modelos contratuais, planilhas financeiras automatizadas e manuais fiscais prontos para utilização imediata no seu negócio.
          </p>

          {/* Symmetrical divider line */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#185a7d]/40 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-[#185a7d]" />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#185a7d]/40 rounded-full" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-[#185a7d] text-white shadow-sm'
                  : 'bg-white/80 hover:bg-white text-[#0c2340] shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Downloads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDownloads.map((item) => {
            const isDownloading = downloadingId === item.id;
            const isSuccess = downloadSuccess === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group border-0"
              >
                {/* Full Bleed Card Image with Preview Overlay Button */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* File Format Badge */}
                  <div className="absolute top-3 left-3 z-10 shadow-xs">
                    {getFormatBadge(item.fileType)}
                  </div>

                  {/* Free badge */}
                  <div className="absolute top-3 right-3 z-10 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                    GRÁTIS
                  </div>

                  {/* Hover Quick Preview Button */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="bg-white hover:bg-[#185a7d] hover:text-white text-[#0c2340] text-xs font-bold py-2 px-3.5 rounded-full flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Pré-visualizar
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#8c9ba5]">
                      <span>{item.category}</span>
                      <span className="font-semibold text-slate-700">{item.fileSize}</span>
                    </div>

                    <h3 
                      onClick={() => setSelectedItem(item)}
                      className="text-sm font-bold text-[#0c2340] group-hover:text-[#185a7d] line-clamp-2 leading-snug cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#5e6d77] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Meta & Buttons */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#8c9ba5]">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <strong className="text-slate-700">{item.rating}</strong>
                      </span>
                      <span>{item.downloadsCount.toLocaleString()} downloads</span>
                    </div>

                    {/* Action Buttons: Preview & Download */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 bg-[#f4f6f8] hover:bg-[#ebf1f5] text-[#0c2340] text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver
                      </button>

                      <button
                        onClick={(e) => handleDownload(item, e)}
                        disabled={isDownloading}
                        className={`flex-1 text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                          isSuccess
                            ? 'bg-emerald-600 text-white'
                            : isDownloading
                            ? 'bg-slate-300 text-slate-600'
                            : 'bg-[#185a7d] hover:bg-[#12415b] text-white'
                        }`}
                      >
                        {isSuccess ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Baixado!
                          </>
                        ) : isDownloading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                            A gerar...
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            Baixar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Document Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="p-4 sm:p-6 bg-[#f8fafc] border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFormatBadge(selectedItem.fileType)}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0c2340] leading-snug line-clamp-1">
                    {selectedItem.title}
                  </h3>
                  <p className="text-xs text-[#6e8090]">
                    Por {selectedItem.author} • {selectedItem.fileSize} • {selectedItem.publishedDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Document Preview */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Document Overview Box */}
              <div className="bg-[#f4f7f9] p-4 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#185a7d]">
                  Resumo do Recurso
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedItem.summary}
                </p>
              </div>

              {/* Table of Contents */}
              {selectedItem.tableOfContents && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c2340]">
                    Índice & Conteúdo do Arquivo
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedItem.tableOfContents.map((toc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                        <CheckCircle className="w-3.5 h-3.5 text-[#185a7d] shrink-0" />
                        <span>{toc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Page Sample Excerpt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c2340]">
                    Pré-visualização do Documento
                  </h4>
                  <span className="text-[11px] text-slate-400">Páginas de amostra</span>
                </div>

                <div className="bg-[#1e293b] text-slate-200 p-5 rounded-2xl font-mono text-xs leading-relaxed space-y-4 max-h-60 overflow-y-auto shadow-inner border border-slate-800">
                  {selectedItem.previewPages.map((page, idx) => (
                    <div key={idx} className="space-y-1 pb-3 border-b border-slate-700/60 last:border-0 last:pb-0">
                      <span className="text-[10px] text-amber-400 font-bold block mb-1">
                        [PÁGINA {idx + 1}]
                      </span>
                      <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300">
                        {page}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer Action */}
            <div className="p-4 sm:p-6 bg-[#f8fafc] border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#185a7d]" />
                <span>Formato: <strong>.{selectedItem.fileType.toLowerCase()}</strong></span>
                <span>•</span>
                <span>{selectedItem.downloadsCount} descarregamentos</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  onClick={() => handleDownload(selectedItem)}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs font-bold bg-[#185a7d] hover:bg-[#12415b] text-white shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Descarregar Grátis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
