import { BaseReranker } from '../interfaces/base-reranker.js';
import { ExtractChunkData } from '../global/types.js';
export declare class CohereReranker implements BaseReranker {
    private cohereRerank;
    private modelName;
    private topN;
    constructor(params: any);
    reRankDocuments(query: string, documents: ExtractChunkData[]): Promise<ExtractChunkData[]>;
}
