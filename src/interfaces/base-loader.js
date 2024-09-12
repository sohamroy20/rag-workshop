import md5 from 'md5';
import createDebugMessages from 'debug';
import { EventEmitter } from 'node:events';
export class BaseLoader extends EventEmitter {
    static setCache(cache) {
        BaseLoader.cache = cache;
    }
    constructor(uniqueId, chunkSize = 5, chunkOverlap = 0, canIncrementallyLoad = false) {
        super();
        Object.defineProperty(this, "uniqueId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_canIncrementallyLoad", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "chunkOverlap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "chunkSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.uniqueId = uniqueId;
        this._canIncrementallyLoad = canIncrementallyLoad;
        this.chunkOverlap = chunkOverlap;
        this.chunkSize = chunkSize;
        createDebugMessages('maap:loader:BaseLoader')(`New loader class initalized with key ${uniqueId}`);
    }
    async init() { }
    get canIncrementallyLoad() {
        return this._canIncrementallyLoad;
    }
    getUniqueId() {
        return this.uniqueId;
    }
    getCustomCacheKey(key) {
        return `LOADER_CUSTOM_${this.uniqueId}_${key}`;
    }
    async checkInCache(key) {
        if (!BaseLoader.cache)
            return false;
        return BaseLoader.cache.loaderCustomHas(this.getCustomCacheKey(key));
    }
    async getFromCache(key) {
        if (!BaseLoader.cache)
            return null;
        return BaseLoader.cache.loaderCustomGet(this.getCustomCacheKey(key));
    }
    async saveToCache(key, value) {
        if (!BaseLoader.cache)
            return;
        await BaseLoader.cache.loaderCustomSet(this.getCustomCacheKey(key), value);
    }
    async deleteFromCache(key) {
        if (!BaseLoader.cache)
            return false;
        return BaseLoader.cache.loaderCustomDelete(this.getCustomCacheKey(key));
    }
    async loadIncrementalChunk(incrementalGenerator) {
        this.emit('incrementalChunkAvailable', incrementalGenerator);
    }
    async *getChunks() {
        const chunks = await this.getUnfilteredChunks();
        for await (const chunk of chunks) {
            chunk.pageContent = chunk.pageContent
                .replace(/(\r\n|\n|\r)/gm, ' ')
                .replace(/\s\s+/g, ' ')
                .trim();
            if (chunk.pageContent.length > 0) {
                yield {
                    ...chunk,
                    contentHash: md5(chunk.pageContent),
                };
            }
        }
    }
}
