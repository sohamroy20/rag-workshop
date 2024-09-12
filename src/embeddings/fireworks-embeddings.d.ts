import { BaseEmbeddings } from '../interfaces/base-embeddings.js';
export declare class FireworksEmbedding implements BaseEmbeddings {
    private model;
    private readonly modelName;
    private dimension;
    constructor(params?: {
        modelName?: string;
        dimension: number;
    });
    getDimensions(): number;
    embedDocuments(texts: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
}
