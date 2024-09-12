import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks";
export class NomicEmbeddingsv1 {
    // model names:
    // nomic-ai/nomic-embed-text-v1.5 (recommended)	137M
    constructor() {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new FireworksEmbeddings({ modelName: "nomic-ai/nomic-embed-text-v1", maxConcurrency: 3, maxRetries: 5 });
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
