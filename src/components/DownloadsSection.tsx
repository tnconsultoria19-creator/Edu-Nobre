import React, { useMemo, useState } from 'react';
import { Download, FileText, PlayCircle, ExternalLink } from 'lucide-react';
import { CatalogItem } from '../types';
import { getLocalAsset } from '../lib/localAssets';

interface DownloadsSectionProps {
  items: CatalogItem[];
  onOpenItem: (item: CatalogItem) => void;
}

const shortDescription = (item: CatalogItem) => {
  const source = (item.subtitle || item.description || 'Material de apoio').trim();
  const firstSentence = source.split(/[.!?]/)[0].trim();
  return firstSentence.length > 62 ? firstSentence.slice(0, 59).trimEnd() + '…' : firstSentence;
};

export const DownloadsSection: React.FC<DownloadsSectionProps> = ({ items, onOpenItem }) => {
  const [filterCategory, setFilterCategory] = useState('Todos');
  const resources = useMemo(() => items.filter((item) =>
    item.contentType === 'Arquivos' || Boolean(item.resourceAssetId || item.contentUrl || item.youtubeUrl) ||
    item.format === 'PDF Livre' || item.format === 'Ficheiros'
  ), [items]);
  const categories = ['Todos', ...Array.from(new Set(resources.map((item) => item.category))).sort()];
  const filteredResources = filterCategory === 'Todos'
    ? resources
    : resources.filter((item) => item.category === filterCategory);

  const handleDownload = async (item: CatalogItem) => {
    if (item.resourceAssetId) {
      try {
        const asset = await getLocalAsset(item.resourceAssetId);
        if (!asset) {
          alert('O ficheiro local já não está disponível neste navegador. Carregue-o novamente no portal.');
          return;
        }
        const url = URL.createObjectURL(asset.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = asset.name || item.resourceAssetName || item.title;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 30000);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Não foi possível descarregar o ficheiro.');
      }
      return;
    }
    if (item.contentUrl) {
      window.open(item.contentUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    onOpenItem(item);
  };

  return (
    <section id="downloads" className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0c2340] font-outfit tracking-tight">Downloads</h2>
          <span className="text-xs text-[#6e8090]">{resources.length} materiais</span>
        </div>

        {resources.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((category) => (
              <button key={category} type="button" onClick={() => setFilterCategory(category)}
                className={'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ' +
                  (filterCategory === category ? 'bg-[#185a7d] text-white border-[#185a7d]' : 'bg-white text-[#0c2340] border-[#e2ded6] hover:bg-[#f7f3ee]')}>
                {category}
              </button>
            ))}
          </div>
        )}

        {filteredResources.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d9e0e6] bg-white px-4 py-6 text-sm text-[#6e8090]">
            Os materiais publicados pelo administrador aparecerão aqui.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredResources.map((item) => {
              const hasFile = Boolean(item.resourceAssetId || item.contentUrl);
              const isVideo = Boolean(item.youtubeUrl);
              return (
                <article key={item.id} className="bg-white rounded-xl border border-[#e6ded6] p-3 flex gap-3 min-w-0 hover:border-[#b7c9d5] hover:shadow-sm transition-all">
                  <img src={item.image} alt="" className="w-[76px] h-[88px] rounded-lg object-cover shrink-0 bg-[#f1f4f6]" loading="lazy" />
                  <div className="min-w-0 flex-1 flex flex-col">
                    <span className="text-[10px] font-semibold text-[#185a7d] truncate">{item.category} · {isVideo ? 'Vídeo' : item.resourceAssetName ? item.resourceAssetName.split('.').pop()?.toUpperCase() : item.contentType}</span>
                    <h3 className="mt-1 text-sm font-semibold text-[#0c2340] leading-snug line-clamp-2">{item.title}</h3>
                    <p className="mt-1 text-[11px] text-[#6e8090] leading-snug line-clamp-1">{shortDescription(item)}</p>
                    <div className="mt-auto pt-2 flex gap-2">
                      <button type="button" onClick={() => onOpenItem(item)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#185a7d] hover:underline">
                        {isVideo ? <PlayCircle className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />} Abrir
                      </button>
                      <button type="button" disabled={!hasFile} onClick={() => void handleDownload(item)}
                        className="inline-flex items-center gap-1 text-xs font-semibold disabled:text-slate-300 text-[#8c3a27] hover:underline disabled:no-underline disabled:cursor-not-allowed"
                        title={hasFile ? 'Descarregar o ficheiro' : 'Ainda não há ficheiro associado'}>
                        <Download className="w-3.5 h-3.5" /> Baixar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
