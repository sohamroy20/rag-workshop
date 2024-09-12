import { Document } from 'langchain/document';
import { Chunk } from '../global/types.js';
import { BaseEmbeddings } from '../interfaces/base-embeddings.js';
export declare class RAGEmbedding {
    private static singleton;
    static init(embeddingModel: BaseEmbeddings): void;
    static getInstance(): RAGEmbedding;
    static getEmbedding(): BaseEmbeddings;
    static translateChunks(chunks: Chunk[]): Document<Record<string, any>>[];
    private readonly embedding;
    private constructor();
}
