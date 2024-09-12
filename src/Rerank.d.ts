import { EmbeddedContent, FindContentFunc, WithScore } from 'mongodb-chatbot-server';
export interface RerankerParams {
    query: string;
    results: WithScore<EmbeddedContent>[];
}
export interface RerankerResults {
    results: WithScore<EmbeddedContent>[];
}
/**
    Rerank search results based on the query and the initial search results.
 */
export type Rerank = ({ query, results }: RerankerParams) => Promise<RerankerResults>;
interface WithRerankerParams {
    reranker: Rerank;
    findContentFunc: any;
}
/**
  Wrap a {@link FindContentFunc} with a {@link Reranker}
  to reorder the results of the content search.
 */
export declare function withReranker({ findContentFunc, reranker }: WithRerankerParams): FindContentFunc;
export {};
