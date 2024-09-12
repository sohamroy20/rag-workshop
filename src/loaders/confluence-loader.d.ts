import { BaseLoader } from '../interfaces/base-loader.js';
export declare class ConfluenceLoader extends BaseLoader<{
    type: 'ConfluenceLoader';
}> {
    private readonly debug;
    private readonly confluence;
    private readonly confluenceBaseUrl;
    private readonly spaceNames;
    constructor({ spaceNames, confluenceBaseUrl, confluenceUsername, confluenceToken, chunkSize, chunkOverlap, }: {
        spaceNames: [string, ...string[]];
        confluenceBaseUrl?: string;
        confluenceUsername?: string;
        confluenceToken?: string;
        chunkSize?: number;
        chunkOverlap?: number;
    });
    getUnfilteredChunks(): AsyncGenerator<any, void, unknown>;
    private getContentChunks;
}
