import { BaseDb } from '../interfaces/base-db.js';
import { BaseLoader } from '../interfaces/base-loader.js';
import { RAGApplication } from './rag-application.js';
import { BaseCache } from '../interfaces/base-cache.js';
import { BaseEmbeddings } from '../interfaces/base-embeddings.js';
import { BaseModel } from '../interfaces/base-model.js';
import { SIMPLE_MODELS } from '../global/constants.js';
import { BaseReranker } from '../interfaces/base-reranker.js';
export declare class RAGApplicationBuilder {
    private searchResultCount;
    private loaders;
    private vectorDb;
    private temperature;
    private queryTemplate;
    private cache?;
    private embeddingModel;
    private model;
    private embeddingRelevanceCutOff;
    private reranker;
    constructor();
    build(): Promise<RAGApplication>;
    addLoader(loader: BaseLoader): this;
    setSearchResultCount(searchResultCount: number): this;
    setVectorDb(vectorDb: BaseDb): this;
    setTemperature(temperature: number): this;
    setEmbeddingRelevanceCutOff(embeddingRelevanceCutOff: number): this;
    setQueryTemplate(queryTemplate: string): this;
    setCache(cache: BaseCache): this;
    setEmbeddingModel(embeddingModel: BaseEmbeddings): this;
    setModel(model: string | SIMPLE_MODELS | BaseModel): this;
    setReranker(reranker: string | BaseReranker): this;
    getLoaders(): BaseLoader<Record<string, string | number | boolean>, Record<string, null>>[];
    getSearchResultCount(): number;
    getVectorDb(): BaseDb;
    getTemperature(): number;
    getEmbeddingRelevanceCutOff(): number;
    getQueryTemplate(): string;
    getCache(): BaseCache;
    getEmbeddingModel(): BaseEmbeddings;
    getReranker(): BaseReranker;
    getModel(): BaseModel;
}
