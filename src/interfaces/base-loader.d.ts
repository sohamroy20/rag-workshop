import { EventEmitter } from 'node:events';
import { LoaderChunk, UnfilteredLoaderChunk } from '../global/types.js';
import { BaseCache } from './base-cache.js';
export declare abstract class BaseLoader<T extends Record<string, string | number | boolean> = Record<string, string | number | boolean>, M extends Record<string, unknown> = Record<string, null>> extends EventEmitter {
    private static cache?;
    static setCache(cache?: BaseCache): void;
    protected readonly uniqueId: string;
    private readonly _canIncrementallyLoad;
    protected readonly chunkOverlap: number;
    protected readonly chunkSize: number;
    constructor(uniqueId: string, chunkSize?: number, chunkOverlap?: number, canIncrementallyLoad?: boolean);
    init(): Promise<void>;
    get canIncrementallyLoad(): boolean;
    getUniqueId(): string;
    private getCustomCacheKey;
    protected checkInCache(key: string): Promise<boolean>;
    protected getFromCache(key: string): Promise<Record<string, unknown>>;
    protected saveToCache(key: string, value: M): Promise<void>;
    protected deleteFromCache(key: string): Promise<false | void>;
    protected loadIncrementalChunk(incrementalGenerator: AsyncGenerator<LoaderChunk<T>, void, void>): Promise<void>;
    getChunks(): AsyncGenerator<LoaderChunk<T>, void, void>;
    abstract getUnfilteredChunks(): AsyncGenerator<UnfilteredLoaderChunk<T>, void, void>;
}
