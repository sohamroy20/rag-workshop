import { BaseEmbeddings } from '../interfaces/base-embeddings.js';
export declare class AzureOpenAiEmbeddings implements BaseEmbeddings {
    private model;
    private azureOpenAIApiInstanceName;
    private modelName;
    private dimensions;
    private deploymentName;
    private apiVersion;
    constructor(params?: {
        deploymentName: string;
        apiVersion: string;
        azureOpenAIApiInstanceName: string;
        modelName: string;
    });
    getDimensions(): number;
    embedDocuments(texts: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
}
