import { BaseEmbeddings } from '../interfaces/base-embeddings.js';
export declare class NomicEmbeddingsv1_5 implements BaseEmbeddings {
    private model;
    constructor();
    getDimensions(): number;
    embedDocuments(texts: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
}
