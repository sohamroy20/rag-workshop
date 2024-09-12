import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
export class BedrockEmbedding {
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
        this.modelName = params?.modelName ?? "amazon.titan-embed-text-v1";
        this.dimension = params?.dimension ?? 1024;
        if (this.modelName === "amazon.titan-embed-text-v2:0") {
            this.dimension = params?.dimension ?? 1024;
        }
        else if (this.modelName === "amazon.titan-embed-image-v1") {
            // dimension can be either 256 | 384 | 1024
            this.dimension = params?.dimension ?? 1024;
        }
        this.model = new BedrockEmbeddings({ region: process.env.BEDROCK_AWS_REGION,
            credentials: {
                accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY,
            },
            model: this.modelName, maxConcurrency: 3, maxRetries: 5 });
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
