import { BaseEmbeddings } from '../interfaces/base-embeddings.js';
export declare class CohereEmbeddings implements BaseEmbeddings {
    private model;
    private modelName;
    private dimensions;
    constructor(params?: {
        modelName?: string;
    });
    getDimensions(): number;
    embedDocuments(texts: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
}
