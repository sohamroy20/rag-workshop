import { BaseLoader } from '../interfaces/base-loader.js';
export declare class PptLoader extends BaseLoader<{
    type: 'PptLoader';
}> {
    private readonly pathOrUrl;
    private readonly isUrl;
    constructor({}: {
        url: string;
        chunkSize?: number;
        chunkOverlap?: number;
    });
    constructor({}: {
        filePath: string;
        chunkSize?: number;
        chunkOverlap?: number;
    });
    getUnfilteredChunks(): AsyncGenerator<{
        pageContent: string;
        metadata: {
            type: "PptLoader";
            source: string;
        };
    }, void, unknown>;
    reformatFilePath(filePath: string): string;
}
