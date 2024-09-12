import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';
export declare class Bedrock extends BaseModel {
    private readonly debug;
    private readonly modelName;
    private readonly maxTokens;
    private model;
    constructor(params?: {
        modelName?: string;
        maxTokens?: number;
        temperature?: number;
    });
    init(): Promise<void>;
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string>;
    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any>;
    private generatePastMessages;
}
