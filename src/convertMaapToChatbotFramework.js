export async function convertBaseModelToChatLlm(baseModel) {
    await baseModel.init();
    return {
        async answerQuestionAwaited({ messages }) {
            const systemMessage = messages.find((m) => m.role === 'system');
            // this only takes into account the latest user message,
            // which should have previous messages and retrieved context information
            // all in the `userMessage.contentForLlm` field.
            const userMessage = messages[messages.length - 1];
            const modelResponse = await baseModel.query(systemMessage.content, 
            // User content for LLM if it exists (which it should in the implementation),
            // otherwise use the original content
            userMessage.contentForLlm ?? userMessage.content, 
            // we shouldn't need to add context b/c this comes from the UserMessage.contentForLlm
            // Putting empty array b/c need placeholder
            []);
            return {
                role: 'assistant',
                content: modelResponse,
            };
        },
        // async answerQuestionStream({ messages }) {
        //     const systemMessage = messages.find((m) => m.role === 'system');
        //     const userMessage = messages[messages.length - 1] as UserMessage;
        //     const modelStream = await baseModel.queryStream( 
        //         systemMessage.content,
        //         userMessage.contentForLlm ?? userMessage.content,
        //         [],
        //     );
        //     let index = 0;
        //     for await (const chunk of modelStream) {
        //         index++;
        //         yield {
        //             id: index.toString(),
        //             created: new Date(),
        //             choices: [
        //                 {
        //                     finalReason: null,
        //                     index: index,
        //                     delta: {
        //                         role: "assistant",
        //                         content:
        //                           typeof chunk.content === "string" ? chunk.content : "",
        //                         toolCalls: [],
        //                     },
        //                 }
        //             ],
        //             promptFilterResults: [],
        //             // role: 'assistant',
        //             // content: chunk,
        //         };
        //     }
        // },
        answerQuestionStream: async ({ messages }) => (async function* () {
            const systemMessage = messages.find((m) => m.role === 'system');
            const userMessage = messages[messages.length - 1];
            const modelStream = await baseModel.queryStream(systemMessage.content, userMessage.contentForLlm ?? userMessage.content, []);
            let index = 0;
            for await (const chunk of modelStream) {
                index++;
                yield {
                    id: index.toString(),
                    created: new Date(),
                    choices: [
                        {
                            finishReason: null,
                            index: index,
                            delta: {
                                role: "assistant",
                                content: typeof chunk === "string" ? chunk : "",
                                toolCalls: [],
                            },
                        },
                    ],
                    promptFilterResults: [],
                };
            }
        })(),
    };
}
export function convertBaseEmbeddingsToEmbedder(baseEmbeddings) {
    return {
        async embed({ text }) {
            const embedding = await baseEmbeddings.embedQuery(text);
            return {
                embedding,
            };
        },
    };
}
export function convertBaseLoaderToDataSource(baseLoader) {
    // Random name for data source. The BaseLoader should be refactored
    // to include a name.
    const name = `DATA_SOURCE_${Date.now()}`;
    return {
        async fetchPages() {
            await baseLoader.init();
            const pages = [];
            for await (const chunk of baseLoader.getChunks()) {
                pages.push({
                    body: chunk.pageContent,
                    url: chunk.metadata.source,
                    // TODO: you should add format to the BaseLoader interface
                    // to support chunking based on format
                    format: 'txt',
                    sourceName: name,
                    metadata: chunk.metadata,
                });
            }
            return pages;
        },
        name,
    };
}
export function convertBaseRerankerToReranker(baseReranker) {
    return async ({ query, results }) => {
        const chunks = results.map((result) => {
            return {
                pageContent: result.text,
                score: result.score,
                metadata: {
                    id: result.chunkAlgoHash ?? '',
                    source: result.url ?? '',
                    uniqueLoaderId: result.sourceName ?? '',
                },
            };
        });
        const rerankedResults = await baseReranker.reRankDocuments(query, chunks);
        const embeddedContentOut = [];
        for (const result of rerankedResults) {
            const foundRes = results.findIndex((r) => {
                r.text === result.pageContent;
            });
            if (foundRes === -1) {
                throw new Error('Could not find the original result in the reranked results');
            }
            embeddedContentOut.push({
                ...results[foundRes],
                score: result.score,
            });
        }
        return {
            results: embeddedContentOut,
        };
    };
}
