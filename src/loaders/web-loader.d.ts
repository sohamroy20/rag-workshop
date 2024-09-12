import { BaseLoader } from '../interfaces/base-loader.js';
export declare class WebLoader extends BaseLoader<{
    type: 'WebLoader';
}> {
    private readonly debug;
    private readonly contentOrUrl;
    private readonly isUrl;
    private readonly withSubpages;
    constructor({}: {
        url: string;
        chunkSize?: number;
        chunkOverlap?: number;
        withSubpages?: boolean;
    });
    constructor({}: {
        content: string;
        chunkSize?: number;
        chunkOverlap?: number;
        withSubpages?: boolean;
    });
    getUnfilteredChunks(): any;
}
