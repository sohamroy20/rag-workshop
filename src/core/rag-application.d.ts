import { BaseLoader } from '../interfaces/base-loader.js';
import { AddLoaderReturn } from '../global/types.js';
import { RAGApplicationBuilder } from './rag-application-builder.js';
export declare class RAGApplication {
    private readonly debug;
    private readonly queryTemplate;
    private readonly searchResultCount;
    private readonly cache?;
    private readonly vectorDb;
    private readonly reranker;
    private readonly model;
    private readonly embeddingRelevanceCutOff;
    private loaders;
    constructor(llmBuilder: RAGApplicationBuilder);
    private embedChunks;
    private getChunkUniqueId;
    init(): Promise<void>;
    private batchLoadEmbeddings;
    private batchLoadChunks;
    private incrementalLoader;
    addLoader(loader: BaseLoader): Promise<AddLoaderReturn>;
    getEmbeddingsCount(): Promise<number>;
    deleteLoader(uniqueLoaderId: string, areYouSure?: boolean): Promise<boolean>;
    deleteAllEmbeddings(areYouSure?: boolean): Promise<boolean>;
    getEmbeddings(cleanQuery: string): Promise<import("../global/types.js").ExtractChunkData[]>;
    getContext(query: string): Promise<import("../global/types.js").ExtractChunkData[]>;
    query(userQuery: string, conversationId?: string): Promise<{
        result: string;
        sources: string[];
    }>;
    createVectorIndex(): Promise<void>;
    docsCount(): Promise<number>;
}
