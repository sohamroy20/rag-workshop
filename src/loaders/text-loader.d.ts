import { BaseLoader } from '../interfaces/base-loader.js';
export declare class TextLoader extends BaseLoader<{
    type: 'TextLoader';
}> {
    private readonly text;
    constructor({ text, chunkSize, chunkOverlap }: {
        text: string;
        chunkSize?: number;
        chunkOverlap?: number;
    });
    getUnfilteredChunks(): AsyncGenerator<{
        pageContent: string;
        metadata: {
            type: "TextLoader";
            source: string;
            textId: string;
        };
    }, void, unknown>;
}
