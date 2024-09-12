import { Conversation, FindContentFunc } from 'mongodb-chatbot-server';
export interface PreProcessQueryParams {
    query: string;
    conversation?: Conversation;
}
export interface PreProcessQueryResults {
    preprocessedQuery: string;
}
/**
    Preprocess a query to mutate it before using it to search for content.
 */
export type PreProcessQuery = ({ query, conversation }: PreProcessQueryParams) => Promise<PreProcessQueryResults>;
interface WithQueryPreprocessorParams {
    queryPreprocessor: PreProcessQuery;
    findContentFunc: FindContentFunc;
}
/**
  Wrap a {@link FindContentFunc} with a query preprocessor
  to mutate the query before searching for content.
 */
export declare function withQueryPreprocessor({ findContentFunc, queryPreprocessor, }: WithQueryPreprocessorParams): FindContentFunc;
export {};
