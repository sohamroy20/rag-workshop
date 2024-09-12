import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';
export declare class AzureChatAI extends BaseModel {
    private readonly debug;
    private readonly azureOpenAIApiInstanceName;
    private readonly azureOpenAIApiDeploymentName;
    private model;
    private readonly azureOpenAIApiVersion;
    private readonly maxTokens;
    private readonly topP;
    private readonly topK;
    constructor(params?: {
        azureOpenAIApiInstanceName?: string;
        azureOpenAIApiDeploymentName?: string;
        azureOpenAIApiVersion?: string;
        modelName?: string;
        temperature?: number;
        maxTokens?: number;
        topP?: number;
        topK?: number;
    });
    init(): Promise<void>;
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string>;
    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any>;
    private generatePastMessages;
}
