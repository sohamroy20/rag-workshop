import { BaseEmbeddings } from '../interfaces/base-embeddings.js';
export declare class TitanEmbeddings implements BaseEmbeddings {
    private model;
    constructor();
    getDimensions(): number;
    embedDocuments(texts: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
}
