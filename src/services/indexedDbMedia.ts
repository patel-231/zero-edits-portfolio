/**
 * High-capacity IndexedDB storage for local video & image files.
 * Bypasses the 5MB browser localStorage limit and ensures uploaded video files
 * persist permanently across reloads and tab closures!
 */

const DB_NAME = 'zero_edits_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

let dbPromise: Promise<IDBDatabase> | null = null;
const memoryUrlCache = new Map<string, string>();

function getDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

export class IndexedDbMediaService {
  /**
   * Saves a File or Blob directly to IndexedDB
   */
  static async saveMediaBlob(id: string, blob: Blob): Promise<string> {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, id);

      req.onsuccess = () => {
        // Cache object URL
        if (memoryUrlCache.has(id)) {
          URL.revokeObjectURL(memoryUrlCache.get(id)!);
        }
        const objUrl = URL.createObjectURL(blob);
        memoryUrlCache.set(id, objUrl);
        resolve(objUrl);
      };

      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Retrieves a Blob and returns a working object URL
   */
  static async getMediaUrl(id: string): Promise<string | null> {
    if (memoryUrlCache.has(id)) {
      return memoryUrlCache.get(id)!;
    }

    try {
      const db = await getDb();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);

        req.onsuccess = () => {
          const blob = req.result as Blob | undefined;
          if (blob) {
            const url = URL.createObjectURL(blob);
            memoryUrlCache.set(id, url);
            resolve(url);
          } else {
            resolve(null);
          }
        };

        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  /**
   * Deletes a Blob from IndexedDB
   */
  static async deleteMediaBlob(id: string): Promise<void> {
    if (memoryUrlCache.has(id)) {
      URL.revokeObjectURL(memoryUrlCache.get(id)!);
      memoryUrlCache.delete(id);
    }

    try {
      const db = await getDb();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
    } catch {}
  }
}
