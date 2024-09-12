import { AzureOpenAIEmbeddings } from '@langchain/openai';
export class AzureOpenAiEmbeddings {
    constructor(params) {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "azureOpenAIApiInstanceName", {
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
        Object.defineProperty(this, "dimensions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "deploymentName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiVersion", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.azureOpenAIApiInstanceName = params?.azureOpenAIApiInstanceName;
        this.modelName = params?.modelName ?? 'text-embedding-ada-002';
        this.deploymentName = params?.deploymentName;
        this.apiVersion = params?.apiVersion;
        if (this.modelName === 'text-embedding-3-small') {
            this.dimensions = 1536;
        }
        else if (this.modelName === 'text-embedding-3-large') {
            this.dimensions = 3072;
        }
        else {
            this.dimensions = 1536;
        }
        this.model = new AzureOpenAIEmbeddings({
            azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
            azureOpenAIApiEmbeddingsDeploymentName: this.deploymentName,
            azureOpenAIApiVersion: this.apiVersion,
        });
    }
    getDimensions() {
        return this.dimensions;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
