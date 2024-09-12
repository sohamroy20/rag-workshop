import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
export class TitanEmbeddings {
    constructor() {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new BedrockEmbeddings({ region: process.env.BEDROCK_AWS_REGION,
            credentials: {
                accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY,
            },
            model: "amazon.titan-embed-text-v1", maxConcurrency: 3, maxRetries: 5 });
    }
    getDimensions() {
        return 1024;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
