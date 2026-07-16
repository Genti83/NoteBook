export const getDirectoryHandle = async (): Promise<any> => {
  return new Promise((resolve) => {
    const request = indexedDB.open('blloku-fs', 1);
    request.onupgradeneeded = (e: any) => {
      e.target.result.createObjectStore('handles');
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction('handles', 'readonly');
      const store = tx.objectStore('handles');
      const getReq = store.get('rootFolder');
      getReq.onsuccess = async (ev: any) => {
        const handle = ev.target.result;
        if (handle) {
          // Verify permissions
          if (await verifyPermission(handle)) {
             resolve(handle);
          } else {
             resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      getReq.onerror = () => resolve(null);
    };
    request.onerror = () => resolve(null);
  });
};

export const saveDirectoryHandle = (handle: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('blloku-fs', 1);
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction('handles', 'readwrite');
      const store = tx.objectStore('handles');
      store.put(handle, 'rootFolder');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject();
    };
    request.onerror = () => reject();
  });
};

export const verifyPermission = async (fileHandle: any) => {
  const options = { mode: 'readwrite' };
  try {
     if ((await fileHandle.queryPermission(options)) === 'granted') {
       return true;
     }
     if ((await fileHandle.requestPermission(options)) === 'granted') {
       return true;
     }
  } catch(e) {}
  return false;
};
