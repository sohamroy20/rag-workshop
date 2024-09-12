import { BaseLoader } from '../interfaces/base-loader.js';
export declare class SitemapLoader extends BaseLoader<{
    type: 'SitemapLoader';
}> {
    private readonly debug;
    private readonly url;
    constructor({ url, chunkSize, chunkOverlap }: {
        url: string;
        chunkSize?: number;
        chunkOverlap?: number;
    });
    getUnfilteredChunks(): AsyncGenerator<any, void, unknown>;
}
