import { BaseLoader } from '../interfaces/base-loader.js';
export declare class ExcelLoader extends BaseLoader<{
    type: 'ExcelLoader';
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
            type: "ExcelLoader";
            source: string;
        };
    }, void, unknown>;
}
