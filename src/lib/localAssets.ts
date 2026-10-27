export interface LocalAssetRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  createdAt: string;
}

const DATABASE_NAME = 'edunombre-local-assets';
const STORE_NAME = 'assets';
let databasePromise: Promise<IDBDatabase> | null = null;

const openDatabase = (): Promise<IDBDatabase> => {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('O armazenamento local não está disponível neste navegador.'));
  }
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Não foi possível abrir o armazenamento.'));
    });
  }
  return databasePromise;
};

export const saveLocalAsset = async (file: File): Promise<Omit<LocalAssetRecord, 'blob'>> => {
  const database = await openDatabase();
  const record: LocalAssetRecord = {
    id: 'asset-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9),
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    blob: file,
    createdAt: new Date().toISOString(),
  };
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(record);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Não foi possível guardar o ficheiro.'));
    transaction.onabort = () => reject(transaction.error || new Error('O armazenamento do ficheiro foi interrompido.'));
  });
  const { blob: _blob, ...metadata } = record;
  return metadata;
};

export const getLocalAsset = async (id: string): Promise<LocalAssetRecord | null> => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve((request.result as LocalAssetRecord | undefined) || null);
    request.onerror = () => reject(request.error || new Error('Não foi possível abrir o ficheiro.'));
  });
};

export const deleteLocalAsset = async (id: string): Promise<void> => {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Não foi possível eliminar o ficheiro.'));
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
