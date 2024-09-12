import { BaseLoader } from '../interfaces/base-loader.js';
export declare class DocxLoader extends BaseLoader<{
    type: 'DocxLoader';
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
            type: "DocxLoader";
            source: string;
        };
    }, void, unknown>;
    reformatFilePath(filePath: string): string;
}
