/**
  Wrap a {@link FindContentFunc} with a {@link Reranker}
  to reorder the results of the content search.
 */
export function withReranker({ findContentFunc, reranker }) {
    return async ({ query }) => {
        const { queryEmbedding, content } = await findContentFunc(query);
        const { results } = await reranker({ query, results: content });
        return { queryEmbedding, content: results };
    };
}
