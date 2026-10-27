import React, { useEffect, useState } from 'react';
import { X, PlayCircle, BookOpen, Download, CheckCircle, FileText, Award, UploadCloud, Trash2, FolderOpen, ExternalLink } from 'lucide-react';
import { CatalogItem, User } from '../types';
import { deleteLocalAsset, formatFileSize, getLocalAsset, saveLocalAsset } from '../lib/localAssets';

interface UserLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedItems: CatalogItem[];
  currentUser?: User | null;
}

interface UserUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

const storageKey = (userId: string) => 'edunombre_user_uploads_v1_' + userId;
const readUploads = (userId?: string): UserUpload[] => {
  if (!userId || typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(storageKey(userId)) || '[]') as UserUpload[];
  } catch {
    return [];
  }
};
const youtubeEmbed = (value?: string): string | null => {
  if (!value) return null;
  const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return match ? 'https://www.youtube-nocookie.com/embed/' + match[1] : null;
};

export const UserLibraryModal: React.FC<UserLibraryModalProps> = ({ isOpen, onClose, purchasedItems, currentUser }) => {
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'uploads'>('content');
  const [localResourceUrl, setLocalResourceUrl] = useState('');
  const [userUploads, setUserUploads] = useState<UserUpload[]>(() => readUploads(currentUser?.id));
  const [uploadsOwnerId, setUploadsOwnerId] = useState(currentUser?.id || '');

  useEffect(() => {
    const ownerId = currentUser?.id || '';
    setUploadsOwnerId(ownerId);
    setUserUploads(readUploads(ownerId));
  }, [currentUser?.id, isOpen]);

  useEffect(() => {
    if (!currentUser?.id || uploadsOwnerId !== currentUser.id) return;
    try {
      window.localStorage.setItem(storageKey(currentUser.id), JSON.stringify(userUploads));
    } catch {
      // Metadata remains available in component state for this session.
    }
  }, [userUploads, currentUser?.id, uploadsOwnerId]);

  useEffect(() => {
    let alive = true;
    let objectUrl = '';
    setLocalResourceUrl('');
    if (selectedItem?.resourceAssetId) {
      getLocalAsset(selectedItem.resourceAssetId).then((record) => {
        if (alive && record) {
          objectUrl = URL.createObjectURL(record.blob);
          setLocalResourceUrl(objectUrl);
        }
      }).catch(() => undefined);
    }
    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selectedItem?.id, selectedItem?.resourceAssetId]);

  if (!isOpen) return null;

  const downloadAsset = async (assetId: string, fallbackName: string) => {
    try {
      const record = await getLocalAsset(assetId);
      if (!record) {
        alert('Este ficheiro já não está disponível neste navegador.');
        return;
      }
      const url = URL.createObjectURL(record.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = record.name || fallbackName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível abrir o ficheiro.');
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files || []);
    event.currentTarget.value = '';
    for (const file of files) {
      try {
        const saved = await saveLocalAsset(file);
        const entry: UserUpload = { id: saved.id, name: saved.name, type: saved.type, size: saved.size, createdAt: saved.createdAt };
        setUserUploads((previous) => [entry, ...previous]);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Não foi possível carregar o ficheiro.');
      }
    }
  };

  const handleRemoveUpload = async (upload: UserUpload) => {
    if (!window.confirm('Eliminar "' + upload.name + '"?')) return;
    try { await deleteLocalAsset(upload.id); }
    catch { /* Metadata can still be removed if the blob was already deleted. */ }
    setUserUploads((previous) => previous.filter((entry) => entry.id !== upload.id));
  };

  const downloadSelected = async () => {
    if (!selectedItem) return;
    if (selectedItem.resourceAssetId) {
      await downloadAsset(selectedItem.resourceAssetId, selectedItem.resourceAssetName || selectedItem.title);
      return;
    }
    if (selectedItem.contentUrl) {
      window.open(selectedItem.contentUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    alert('Este conteúdo ainda não tem um ficheiro associado.');
  };

  const embedUrl = youtubeEmbed(selectedItem?.youtubeUrl);
  const assetName = selectedItem?.resourceAssetName || selectedItem?.contentUrl || '';
  const assetLower = assetName.toLowerCase();
  const isPdf = (selectedItem?.resourceAssetType || '').toLowerCase().includes('pdf') || assetLower.split('?')[0].endsWith('.pdf');
  const isOfficeFile = /\.(pptx?|docx?|xlsx?)(?:$|\?)/i.test(assetName);
  const officeViewerUrl = selectedItem?.contentUrl && isOfficeFile
    ? 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(selectedItem.contentUrl)
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[94vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#eaf0f4] flex items-center justify-center text-[#185a7d]"><BookOpen className="w-5 h-5" /></div>
            <div>
              <h2 className="text-base font-bold text-[#0c2340]">Minha área</h2>
              <p className="text-[11px] text-slate-500">{currentUser?.name || 'Utilizador'} · conteúdos e ficheiros</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-4 sm:px-5 pt-3 flex gap-2 border-b border-slate-100">
          <button type="button" onClick={() => setActiveTab('content')} className={'px-3 py-2 text-xs font-semibold border-b-2 ' + (activeTab === 'content' ? 'border-[#185a7d] text-[#185a7d]' : 'border-transparent text-slate-500')}>Conteúdos ({purchasedItems.length})</button>
          <button type="button" onClick={() => setActiveTab('uploads')} className={'px-3 py-2 text-xs font-semibold border-b-2 ' + (activeTab === 'uploads' ? 'border-[#185a7d] text-[#185a7d]' : 'border-transparent text-slate-500')}>Os meus ficheiros ({userUploads.length})</button>
        </div>

        <div className="p-3 sm:p-5 overflow-y-auto flex-1 bg-slate-50">
          {activeTab === 'uploads' ? (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eaf0f4] text-[#185a7d] flex items-center justify-center"><UploadCloud className="w-5 h-5" /></div>
                  <div><h3 className="text-sm font-semibold text-[#0c2340]">Carregar documentos</h3><p className="text-[11px] text-slate-500">PDF, slides, Word, Excel ou ZIP</p></div>
                </div>
                <label className="inline-flex items-center justify-center gap-2 rounded-full bg-[#185a7d] hover:bg-[#12415b] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer">
                  <UploadCloud className="w-4 h-4" /> Escolher ficheiros
                  <input type="file" multiple accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip,.txt,.png,.jpg,.jpeg" onChange={handleUpload} className="sr-only" />
                </label>
              </div>
              {userUploads.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500"><FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />Ainda não carregou ficheiros.</div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {userUploads.map((upload) => (
                    <div key={upload.id} className="px-3.5 py-3 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#185a7d] shrink-0" />
                      <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-[#0c2340] truncate">{upload.name}</p><p className="text-[10px] text-slate-500">{formatFileSize(upload.size)} · {new Date(upload.createdAt).toLocaleDateString()}</p></div>
                      <button type="button" onClick={() => void downloadAsset(upload.id, upload.name)} title="Descarregar" aria-label={'Descarregar ' + upload.name} className="p-2 rounded-lg text-[#185a7d] hover:bg-slate-100"><Download className="w-4 h-4" /></button>
                      <button type="button" onClick={() => void handleRemoveUpload(upload)} title="Eliminar" aria-label={'Eliminar ' + upload.name} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] leading-relaxed text-slate-500">Modo de demonstração: estes ficheiros ficam neste navegador e não são enviados para a nuvem.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-4 min-h-[420px]">
              <aside className="space-y-2">
                <h3 className="px-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">A minha biblioteca</h3>
                {purchasedItems.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center">
                    <BookOpen className="w-7 h-7 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs text-slate-500">Ainda não tem conteúdos guardados.</p>
                  </div>
                ) : purchasedItems.map((item) => (
                  <button key={item.id} type="button" onClick={() => setSelectedItem(item)} className={'w-full p-2.5 rounded-xl border text-left flex items-center gap-3 ' + (selectedItem?.id === item.id ? 'border-[#185a7d] bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300')}>
                    <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100" />
                    <span className="min-w-0"><span className="block text-xs font-semibold text-[#0c2340] line-clamp-2">{item.title}</span><span className="block text-[10px] text-emerald-700 mt-1"><CheckCircle className="w-3 h-3 inline mr-1" />Na sua biblioteca</span></span>
                  </button>
                ))}
              </aside>

              <section className="min-w-0">
                {selectedItem ? (
                  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#185a7d]">{selectedItem.contentType}</p><h3 className="text-sm font-bold text-[#0c2340] mt-0.5">{selectedItem.title}</h3></div>
                      {(selectedItem.resourceAssetId || selectedItem.contentUrl) && <button type="button" onClick={() => void downloadSelected()} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-[#185a7d] hover:bg-slate-50"><Download className="w-3.5 h-3.5" /> Descarregar</button>}
                    </div>
                    <div className="p-3 sm:p-4">
                      {embedUrl ? (
                        <div className="aspect-video rounded-xl overflow-hidden bg-slate-900"><iframe src={embedUrl} title={selectedItem.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
                      ) : localResourceUrl && isPdf ? (
                        <iframe src={localResourceUrl} title={selectedItem.title} className="w-full h-[65vh] rounded-lg border border-slate-200" />
                      ) : selectedItem.contentUrl && isPdf ? (
                        <iframe src={selectedItem.contentUrl} title={selectedItem.title} className="w-full h-[65vh] rounded-lg border border-slate-200" />
                      ) : officeViewerUrl ? (
                        <iframe src={officeViewerUrl} title={selectedItem.title} className="w-full h-[65vh] rounded-lg border border-slate-200" />
                      ) : localResourceUrl ? (
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 text-center"><FileText className="w-10 h-10 mx-auto text-[#185a7d] mb-2" /><p className="text-sm font-semibold text-[#0c2340]">{selectedItem.resourceAssetName || 'Ficheiro do curso'}</p><p className="text-xs text-slate-500 mt-1">Este formato deve ser descarregado para abrir.</p><button type="button" onClick={() => void downloadSelected()} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#185a7d] text-white text-xs font-semibold"><Download className="w-4 h-4" /> Descarregar ficheiro</button></div>
                      ) : selectedItem.contentUrl ? (
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 text-center"><ExternalLink className="w-8 h-8 mx-auto text-[#185a7d] mb-2" /><p className="text-sm font-semibold text-[#0c2340]">Abrir material</p><a href={selectedItem.contentUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#185a7d] text-white text-xs font-semibold">Abrir ficheiro <ExternalLink className="w-3.5 h-3.5" /></a></div>
                      ) : (
                        <div className="aspect-video rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center"><PlayCircle className="w-10 h-10 text-slate-400 mb-3" /><p className="text-sm font-semibold">Conteúdo ainda não configurado</p><p className="text-xs text-slate-400 mt-1">O administrador pode adicionar um vídeo do YouTube ou carregar um PDF/slides no portal.</p></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[320px] rounded-xl border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-8 text-center"><Award className="w-9 h-9 text-slate-300 mb-2" /><p className="text-sm font-semibold text-[#0c2340]">Escolha um conteúdo</p><p className="text-xs text-slate-500 mt-1">Os vídeos e documentos abrem aqui.</p></div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
