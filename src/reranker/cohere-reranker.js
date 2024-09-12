import { CohereRerank } from "@langchain/cohere";
import { Document } from "@langchain/core/documents";
export class CohereReranker {
    constructor(params) {
        Object.defineProperty(this, "cohereRerank", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "topN", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.modelName = params?.modelName ?? "rerank-english-v2.0";
        this.topN = params?.k ?? 5;
        this.cohereRerank = new CohereRerank({
            apiKey: process.env.COHERE_API_KEY,
            topN: this.topN,
            model: this.modelName,
        });
    }
    reRankDocuments(query, documents) {
        const docs = documents.map(doc => new Document({
            pageContent: doc.pageContent,
            metadata: doc.metadata
        }));
        return this.cohereRerank.compressDocuments(docs, query).then((rerankedDocuments) => {
            return rerankedDocuments.map((doc) => {
                return {
                    pageContent: doc.pageContent,
                    score: doc.metadata.relevanceScore,
                    metadata: doc.metadata
                };
            });
        });
    }
}
