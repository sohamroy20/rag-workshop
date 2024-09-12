import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
export class GeckoEmbedding {
    // constructor() {
    //     this.model = new GoogleVertexAIEmbeddings({model:'textembedding-gecko', maxConcurrency: 3, maxRetries: 5 });
    // }
    constructor(params) {
        Object.defineProperty(this, "model", {
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
        this.modelName = params?.modelName ?? 'textembedding-gecko';
        this.model = new GoogleVertexAIEmbeddings({
            model: this.modelName,
            maxConcurrency: 3,
            maxRetries: 5
        });
    }
    getDimensions() {
        return 768;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
