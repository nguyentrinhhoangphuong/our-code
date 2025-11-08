class CacheDB {
  constructor() {
    this.dbName = 'FilterCacheDB';
    this.version = 1;
    this.db = null;
  }

  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('cacheData')) {
          const cacheStore = db.createObjectStore('cacheData', { keyPath: 'key' });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  async get(key) {
    await this.ensureOpen();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cacheData'], 'readonly');
      const store = transaction.objectStore('cacheData');
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result ? request.result.data : null);
    });
  }

  async set(key, data) {
    await this.ensureOpen();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cacheData'], 'readwrite');
      const store = transaction.objectStore('cacheData');
      
      const request = store.put({
        key: key,
        data: data,
        timestamp: Date.now()
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async setVersion(version) {
    await this.ensureOpen();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['metadata'], 'readwrite');
      const store = transaction.objectStore('metadata');
      
      const request = store.put({
        key: 'cache-version',
        value: version,
        timestamp: Date.now()
      });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getVersion() {
    await this.ensureOpen();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['metadata'], 'readonly');
      const store = transaction.objectStore('metadata');
      const request = store.get('cache-version');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result ? request.result.value : null);
    });
  }

  async clearAll() {
    await this.ensureOpen();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cacheData'], 'readwrite');
      const store = transaction.objectStore('cacheData');
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async ensureOpen() {
    if (!this.db) {
      await this.open();
    }
  }
}

window.cacheDB = new CacheDB();
