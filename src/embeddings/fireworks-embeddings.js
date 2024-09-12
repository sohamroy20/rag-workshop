import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks";
export class FireworksEmbedding {
    // model names:
    // nomic-ai/nomic-embed-text-v1.5 (recommended)	137M
    // nomic-ai/nomic-embed-text-v1	137M
    // WhereIsAI/UAE-Large-V1	335M
    // thenlper/gte-large	335M
    // thenlper/gte-base	109M
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
        Object.defineProperty(this, "dimension", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dimension = this.dimension;
        this.modelName = params?.modelName ?? "nomic-ai/nomic-embed-text-v1";
        this.model = new FireworksEmbeddings({ modelName: this.modelName, maxConcurrency: 3, maxRetries: 5 });
    }
    getDimensions() {
        return this.dimension;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
