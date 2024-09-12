import { BaseLoader } from '../interfaces/base-loader.js';
export declare class YoutubeChannelLoader extends BaseLoader<{
    type: 'YoutubeChannelLoader';
}> {
    private readonly debug;
    private readonly channelId;
    constructor({ channelId, chunkSize, chunkOverlap, }: {
        channelId: string;
        chunkSize?: number;
        chunkOverlap?: number;
    });
    getUnfilteredChunks(): AsyncGenerator<{
        metadata: {
            type: "YoutubeChannelLoader";
            originalSource: string;
            source: string;
        };
        pageContent: string;
    }, void, unknown>;
}
