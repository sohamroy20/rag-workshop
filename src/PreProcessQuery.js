/**
  Wrap a {@link FindContentFunc} with a query preprocessor
  to mutate the query before searching for content.
 */
export function withQueryPreprocessor({ findContentFunc, queryPreprocessor, }) {
    return async ({ query }) => {
        const { preprocessedQuery } = await queryPreprocessor({ query });
        // TODO: support adding conversation context as an optional parameter to the findContentFunc
        const { queryEmbedding, content } = await findContentFunc({ query: preprocessedQuery });
        return { queryEmbedding, content };
    };
}
