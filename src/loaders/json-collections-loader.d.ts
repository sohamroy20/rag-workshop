import { BaseLoader } from '../interfaces/base-loader.js';
export declare class JsonCollectionsLoader extends BaseLoader<{
    type: 'JsonCollectionsLoader';
}> {
    private readonly url;
    constructor({ url, chunkSize, chunkOverlap }: {
        url: string;
        chunkSize?: number;
        chunkOverlap?: number;
    });
    getUnfilteredChunks(): AsyncGenerator<any, void, unknown>;
    reformatFilePath(filePath: string): string;
}
